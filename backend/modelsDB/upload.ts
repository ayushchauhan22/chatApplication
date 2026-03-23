import mongoose, { InferSchemaType } from 'mongoose';
const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  fileType: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },

});

export type UploadFile = InferSchemaType<typeof uploadSchema>;

export default mongoose.model("Uploads", uploadSchema);