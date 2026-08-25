const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
const Razorpay = require("razorpay");

admin.initializeApp();
const db = admin.firestore();

// Initialize Razorpay
// We'll use Firebase environment config or process.env for the keys later.
// For now, we mock it or expect the user to set environment variables.
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "mock_key_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_key_secret",
  });
};

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  try {
    const { name, phone, email } = data;
    
    if (!name || !phone) {
      throw new functions.https.HttpsError("invalid-argument", "Name and phone are required.");
    }

    // Get current config for the draw
    const configDoc = await db.collection("config").doc("draw").get();
    let entryFee = 50; // default ₹50
    if (configDoc.exists) {
      entryFee = configDoc.data().entry_fee || 50;
    }

    const rzp = getRazorpayInstance();
    const orderOptions = {
      amount: entryFee * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await rzp.orders.create(orderOptions);

    // Create a pending entry in Firestore
    const entryRef = db.collection("entries").doc();
    await entryRef.set({
      name,
      phone,
      email: email || "",
      amount: entryFee,
      razorpay_order_id: order.id,
      status: "pending",
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      entryId: entryRef.id,
      orderId: order.id,
      amount: orderOptions.amount,
      currency: orderOptions.currency
    };

  } catch (error) {
    console.error("Error creating order:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_webhook_secret";
    
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      console.error("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    // Event is legitimate
    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find the entry with this order_id
      const entriesSnapshot = await db.collection("entries")
        .where("razorpay_order_id", "==", orderId)
        .limit(1)
        .get();

      if (entriesSnapshot.empty) {
        console.error("No entry found for order ID:", orderId);
        return res.status(404).send("Entry not found");
      }

      const entryDoc = entriesSnapshot.docs[0];
      if (entryDoc.data().status === "paid") {
        return res.status(200).send("Already processed");
      }

      // Generate a coupon code transactionally
      await db.runTransaction(async (transaction) => {
        // Simple generation logic: ONAM-XXXXXX
        const generateCode = () => `ONAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        let couponCode = generateCode();
        let isUnique = false;
        
        // Ensure uniqueness (simple retry logic)
        for (let i = 0; i < 3; i++) {
          const existing = await transaction.get(db.collection("entries").where("coupon_code", "==", couponCode).limit(1));
          if (existing.empty) {
            isUnique = true;
            break;
          }
          couponCode = generateCode();
        }

        if (!isUnique) {
          throw new Error("Failed to generate unique coupon code");
        }

        transaction.update(entryDoc.ref, {
          status: "paid",
          razorpay_payment_id: paymentId,
          coupon_code: couponCode
        });
      });
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
});
