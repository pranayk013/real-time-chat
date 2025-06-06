"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
let globalChatId = 0;
class InMemoryStore {
    constructor() {
        this.store = new Map();
    }
    initRoom(roomId) {
        this.store.set(roomId, {
            roomId: roomId,
            chats: []
        });
    }
    getChats(roomId, limits, offset) {
        const room = this.store.get(roomId);
        if (!room) {
            return [];
        }
        return room.chats.reverse().slice(0, offset).slice(-1 * limits);
    }
    addChat(userId, name, roomId, message) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        const chat = {
            chatId: String(globalChatId++),
            userId,
            name,
            message,
            upvotes: []
        };
        room.chats.push(chat);
        return chat;
    }
    upvote(userId, roomId, chatId) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        // @ts-ignore
        const chat = room.chats.find(({ id }) => id === chatId);
        if (chat) {
            chat.upvotes.push(userId);
        }
        return chat;
    }
}
exports.InMemoryStore = InMemoryStore;
