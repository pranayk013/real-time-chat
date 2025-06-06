import z from "zod";

export enum SupportedMessage {
    JoinRoom= "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvotedMessage = "UPVOTE_MESSAGE"
}
export type IncomingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: initMessageType
} | {
    type: SupportedMessage.SendMessage,
    payload: UserMessageType
} | {
    type: SupportedMessage.UpvotedMessage,
    payload: UpvoteMessage
};

export const initMessage = z.object({
    name : z.string(),
    userId : z.string(),
    roomId : z.string()
})

export type initMessageType = z.infer<typeof initMessage>;

export const UserMessage = z.object({
    message : z.string(),
    userId : z.string(),
    roomId : z.string()
})

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
    roomId : z.string(),
    userId : z.string(),
    chatId : z.string()
})

export type UpvoteMessage = z.infer<typeof UpvoteMessage>;