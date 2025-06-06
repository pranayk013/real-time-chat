import {Chat, Store} from "./store/Store";
type UserId = string;
let globalChatId = 0;
export interface Room{
    roomId:string;
    chats:Chat[]
}
export class InMemoryStore implements Store{
    private store:Map<string,Room>;
    constructor(){
        this.store = new Map<string,Room>();
    }
    initRoom(roomId:string){
        this.store.set(roomId,{
            roomId:roomId,
            chats:[]
        });
    }
    getChats(roomId:string , limits:number, offset:number){
       const room = this.store.get(roomId);
       if(!room){return []}
       return room.chats.reverse().slice(0,offset).slice(-1*limits);
    }
    addChat(userId:UserId,name:string,roomId:string , message:string){
        if(!this.store.get(roomId)){
            this.initRoom(roomId);
        }
        const room = this.store.get(roomId);
        if(!room){
            return;
        }
        const chat = {
            chatId:String(globalChatId++),
            userId,
            name,
            message,
            upvotes:[]
        }
        room.chats.push(chat);
        return chat;
    }
    upvote(userId:UserId,roomId:string , chatId:string){
        const room = this.store.get(roomId);
        if(!room){
            this.initRoom(roomId);
        }
        // @ts-ignore
        const chat = room.chats.find( ({id}) => id === chatId);

        if(chat){
            chat.upvotes.push(userId);
        }
        return chat;
    }
}