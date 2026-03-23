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

export default mongoose.model("MessageStatus", messageStatusSchema);