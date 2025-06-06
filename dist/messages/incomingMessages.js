"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpvoteMessage = exports.UserMessage = exports.initMessage = exports.SupportedMessage = void 0;
const zod_1 = __importDefault(require("zod"));
var SupportedMessage;
(function (SupportedMessage) {
    SupportedMessage["JoinRoom"] = "JOIN_ROOM";
    SupportedMessage["SendMessage"] = "SEND_MESSAGE";
    SupportedMessage["UpvotedMessage"] = "UPVOTE_MESSAGE";
})(SupportedMessage || (exports.SupportedMessage = SupportedMessage = {}));
exports.initMessage = zod_1.default.object({
    name: zod_1.default.string(),
    userId: zod_1.default.string(),
    roomId: zod_1.default.string()
});
exports.UserMessage = zod_1.default.object({
    message: zod_1.default.string(),
    userId: zod_1.default.string(),
    roomId: zod_1.default.string()
});
exports.UpvoteMessage = zod_1.default.object({
    roomId: zod_1.default.string(),
    userId: zod_1.default.string(),
    chatId: zod_1.default.string()
});
