type UserId = string;

export interface Chat{
    chatId:string;
    userId:UserId;
    name:string;
    message:string;
    upvotes:UserId[];
}

export abstract class Store{
    constructor(){

    }
    initRoom(roomId:string){

    }
    getChats(room:string , limits:number, offset:number){

    }
    addChat(userId:UserId ,name:string, room:string , message:string){

    }
    upvote(userId:UserId,roomId:string , chatId:string){

    }
}