import mongoose from 'mongoose';

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  images: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Founder', founderSchema);
