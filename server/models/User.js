import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userNickname: { type: String, required: true },
    userEmail: { type: String, required: true },
    userHashedPassword: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
