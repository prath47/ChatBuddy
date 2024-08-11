const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const {
  getuserdetailsfromtoken,
} = require("../helpers/getuserdetailsfromtoken");
const { userModel } = require("../models/userModel");
const {
  conversationModel,
  messageModel,
} = require("../models/conversationModel");
const { getConversation } = require("../helpers/getConversation");

const app = express();

// socket connections
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "*",
  },
});

//online user
const onlineUsers = new Set();

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  //current user details
  const user = await getuserdetailsfromtoken(token);

  //create a room
  socket.join(user?._id?.toString());
  onlineUsers.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUsers));

  socket.on("message-page", async (userId) => {
    console.log(userId);
    const userDetails = await userModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      online: onlineUsers.has(userId),
      profile_pic: userDetails?.profile_pic,
    };

    socket.emit("message-user", payload);

    //get previous messages
    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          {
            sender: user?._id,
            receiver: userId,
          },
          {
            sender: userId,
            receiver: user?._id,
          },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  //new message
  socket.on("new message", async (data) => {
    //check conversation available both between both user
    let conversation = await conversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    });

    //if conversation is not available
    if (!conversation) {
      const createConversation = await conversationModel.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await messageModel.create({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const updateConversation = await conversationModel.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $push: { messages: message?._id },
      }
    );

    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          {
            sender: data?.sender,
            receiver: data?.receiver,
          },
          {
            sender: data?.receiver,
            receiver: data?.sender,
          },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    //send conversation
    const lastConversationSender = await getConversation(data?.sender);
    const lastConversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", lastConversationSender);
    io.to(data?.receiver).emit("conversation", lastConversationReceiver);
  });

  //sidebar
  try {
    socket.on("sidebar", async (currentUserId) => {
      const conversation = await getConversation(currentUserId);

      socket.emit("conversation", conversation);
    });
  } catch (error) {
    console.log(error);
  }

  socket.on("seen", async (msgByUserId) => {
    let conversation = await conversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await messageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: msgByUserId,
      },
      { $set: { seen: true } }
    );

    //send conversation
    const lastConversationSender = await getConversation(user?._id?.toString());
    const lastConversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", lastConversationSender);
    io.to(msgByUserId).emit("conversation", lastConversationReceiver);
  });

  //disconnet
  socket.on("disconnect", () => {
    onlineUsers.delete(user?._id?.toString());
    console.log("User Disconnected", socket.id);
  });
});

module.exports = { app, server };
