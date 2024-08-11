const { mongoose, Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const messageModel = model("Message", messageSchema);

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const conversationModel = model("Conversation", conversationSchema);
module.exports = { conversationModel, messageModel };
