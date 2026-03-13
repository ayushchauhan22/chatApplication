import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true
  },

  status: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      delivered: Boolean,
      seen: Boolean
    }
  ],

},{
  timestamps: true   
});

export default mongoose.model("Message", messageSchema);