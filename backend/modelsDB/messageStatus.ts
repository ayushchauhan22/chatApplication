import mongoose from "mongoose";

const messageStatusSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
    },

    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },

    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent',
    },

    seenBy: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    deliveredAt: Date,
    seenAt: Date,
  },
  {
    timestamps: true,
  },
);

messageStatusSchema.index({ message_id: 1 }, { unique: true });
messageStatusSchema.index({ conversation_id: 1, status: 1 });
messageStatusSchema.index({ sender_id: 1, status: 1, conversation_id: 1 });

export default mongoose.model("MessageStatus", messageStatusSchema);