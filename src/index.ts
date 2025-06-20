import {connection, Message, server as WebSocketServer} from "websocket"
import http from "http";
import {UserManager} from "./UserManager";
import {IncomingMessage, initMessage, SupportedMessage} from "./messages/incomingMessages";
import {InMemoryStore} from "./InMemoryStore";
import {OutgoingMessage , SupportedMessage as OutgoingSupportingMessages} from "./messages/outgoingMessages";

const server = http.createServer(function (request:any, response: {
    writeHead: (arg0: number) => void;
    end: () => void;
}) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
const userManager = new UserManager();
const store = new InMemoryStore();


server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: true
});

function originIsAllowed(origin:string) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try{
                messageHandler(connection,JSON.parse(message.utf8Data));
            }catch (e){

            }

            //console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws: connection ,message: IncomingMessage){
    if (message.type === SupportedMessage.JoinRoom){
        const payload = message.payload;
        userManager.addUser(payload.name,payload.userId,payload.roomId,ws);
    }
    if(message.type === SupportedMessage.SendMessage){
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId,payload.userId);
        if(!user){
            console.error("User not found");
            return;
        }
        let chat = store.addChat(payload.userId,user.name,payload.roomId,payload.message);
        if(!chat){
            console.error("Chat not found");
            return;
        }
        const outgoingPayload : OutgoingMessage= {
            type : OutgoingSupportingMessages.AddChat,
            payload : {
                roomId:payload.roomId,
                message:payload.message,
                name:user.name,
                upvotes:0,
                chatId:""
            }
        }
        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload);
    }
    if(message.type === SupportedMessage.UpvotedMessage){
        const payload = message.payload;
        const chat = store.upvote(payload.userId,payload.roomId,payload.chatId);
        if(!chat){
            console.error("Chat not found");
            return;
        }

        const outgoingPayload : OutgoingMessage= {
            type : OutgoingSupportingMessages.UpdateChat,
            payload : {
                roomId:payload.roomId,
                message:"",
                name:"",
                upvotes:chat.upvotes.length,
                chatId:payload.chatId
            }
        }
        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload);
    }
}
