import Message from '../models/Message.js';

export default {
  async getUsersChats(req, res) {
    try {
      const { userId } = req.params;

      const userMessages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).sort({ createdAt: -1 });

      const uniqueChats = [];
      const chatSet = new Set();

      for (const msg of userMessages) {
        const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;

        if (!chatSet.has(partnerId)) {
          chatSet.add(partnerId);
          uniqueChats.push({
            partnerId,
            lastMessage: msg.text,
            createdAt: msg.createdAt,
          });
        }
      }

      return res.status(200).json(uniqueChats);
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
      res.status(500).json({ message: error.message });
    }
  },
};
