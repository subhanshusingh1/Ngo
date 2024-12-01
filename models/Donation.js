import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Donation', donationSchema);
