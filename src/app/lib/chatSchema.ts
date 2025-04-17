import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Number, required: true }
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  messages: { type: [MessageSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now },
  seenCount: { type: Number, default: 0 }
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSessionSchema);
export default Chat;

