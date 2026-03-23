import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],

  is_group: {
    type: Boolean,
    default: false
  },

  group_name: {
    type: String,
    default: null
  }

},{
  timestamps: true   
});

conversationSchema.index({ participants: 1, updatedAt: -1 });
export default mongoose.model("Conversation", conversationSchema);