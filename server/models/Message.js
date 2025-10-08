import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Message', messageSchema);
