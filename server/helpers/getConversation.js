const { conversationModel } = require("../models/conversationModel");

const getConversation = async (currentUserId) => {
  if (currentUserId.length == 0) return [];

  const currentUserConversation = await conversationModel
    .find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("receiver");

  const conversation = currentUserConversation.map((conv) => {
    const countUnseenMsg = conv.messages.reduce((prev, curr) => {
      const msgByUserId = curr?.msgByUserId?.toString();
      if (msgByUserId !== currentUserId) {
        return prev + (curr.seen ? 0 : 1);
      } else {
        return prev;
      }
    }, 0);
    return {
      _id: conv?._id,
      sender: conv?.sender,
      receiver: conv?.receiver,
      unseenMessage: countUnseenMsg,
      lastMsg: conv.messages[conv?.messages.length - 1],
    };
  });
  return conversation;
  //   socket.emit("conversation", conversation);
};

module.exports = { getConversation };
