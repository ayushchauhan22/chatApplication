import mongoose from "mongoose";

const messageStatusSchema = new mongoose.Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent"
  },

},{
  timestamps: true   
});

export default mongoose.model("MessageStatus", messageStatusSchema);