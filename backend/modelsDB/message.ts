import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: false,
      default: null,
    },


    fileUrl: {
      type: String,
      required: false,
      default: null,
    },

    uploadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },

    filename: {
      type: String,
      required: false,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Message", messageSchema);