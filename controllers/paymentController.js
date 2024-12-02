// import asyncHandler from "express-async-handler";
// import Razorpay from "razorpay";
// import Donation from "../models/Donation.js";

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // @Desc Create Payment Order
// // @Route POST /api/v1/create-order
// // @Access Public
// const createOrder = asyncHandler(async (req, res) => {
//   const { amount, currency = "INR", receipt, volunteerId, eventId } = req.body;

//   // Validate request body
//   if (!amount || !receipt || !volunteerId || !eventId) {
//     return res.status(400).json({
//       success: false,
//       message: "Amount, receipt, volunteerId, and eventId are required.",
//     });
//   }

//   try {
//     // Create Razorpay order
//     const options = {
//       amount: amount * 100, // Convert to paise for Razorpay
//       currency,
//       receipt,
//     };

//     const order = await razorpay.orders.create(options);

//     if (order) {
//       // Save the donation record with pending status
//       const donation = await Donation.create({
//         amount,
//         currency,
//         volunteer: volunteerId,
//         event: eventId,
//         orderId: order.id,
//         status: "pending",
//       });

//       // Respond with Razorpay order and donation details
//       res.status(200).json({
//         success: true,
//         message: "Order created successfully.",
//         order,
//         donation,
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "Failed to create Razorpay order.",
//       });
//     }
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating payment order.",
//     });
//   }
// });


// // @Desc Verify Payment
// // @Route POST /api/v1/verify-payment
// // @Access Public
// const verifyPayment = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   // Validate required fields
//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     return res.status(400).json({
//       success: false,
//       message: "All payment fields are required.",
//     });
//   }

//   try {
//     // Generate HMAC SHA256 signature
//     const key_secret = process.env.RAZORPAY_KEY_SECRET;
//     const generated_signature = crypto
//       .createHmac("sha256", key_secret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generated_signature === razorpay_signature) {
//       // Update the donation record to successful
//       const donation = await Donation.findOneAndUpdate(
//         { orderId: razorpay_order_id }, // Updated field to match your schema
//         { razorpayPaymentId: razorpay_payment_id, status: "successful" },
//         { new: true }
//       );

//       if (!donation) {
//         return res.status(404).json({
//           success: false,
//           message: "Donation record not found.",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: "Payment verified successfully.",
//         donation,
//       });
//     } else {
//       // Update the donation record to failed
//       await Donation.findOneAndUpdate(
//         { orderId: razorpay_order_id },
//         { status: "failed" }
//       );

//       res.status(400).json({
//         success: false,
//         message: "Payment verification failed.",
//       });
//     }
//   } catch (error) {
//     console.error("Error verifying Razorpay payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error verifying payment.",
//     });
//   }
// });


// export {createOrder, verifyPayment };
