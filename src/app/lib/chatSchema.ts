const mongoose = require('mongoose');

// Message Schema
const MessageSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // Format: "objectId1#objectId2"
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Chat Schema
const ChatSchema = new mongoose.Schema({
    chatId: { type: String, unique: true, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    unseenCount: { type: Map, of: Number, default: {} }, // Tracks unseen messages per user
    lastMessage: { type: String, default: "" },
}, { timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);
export const Chat = mongoose.model('Chat', ChatSchema);

