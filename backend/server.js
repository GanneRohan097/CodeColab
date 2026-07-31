const express = require('express')
const http = require('http');
const cors = require('cors')
const webSocket = require('ws');
const { type } = require('os');
const app = express();
const rooms = new Map(); //A Map stores key → value pairs.
app.use(cors())

const server = http.createServer(app);

const wss = new webSocket.Server({
    server
});//Creates a WebSocket server and attach it to the existing HTTP server

wss.on("connection", (ws) => {
    console.log("A client connected");
    //Receive the message on the server
    ws.on("message", (msg) => {
        const data = JSON.parse(msg.toString());
        if (data.type === "join-room") {
            if (!rooms.has(data.roomId)) {
                rooms.set(data.roomId, []);
            }
            rooms.get(data.roomId).push({
                socket: ws,
                username: data.username
            });
            const participants = rooms
                .get(data.roomId)
                .map(client => client.username);
            for (const client of rooms.get(data.roomId)) {
                client.socket.send(
                    JSON.stringify({
                        type: "participants",
                        users: participants
                    })
                );
            }
            console.log("Join Room Request");
            console.log(data.roomId);
            console.log(data.username);
        }
        if (data.type === "code-change") {
            for (const clients of rooms.get(data.roomId)) {
                if (clients.socket !== ws) {
                    clients.socket.send(
                        JSON.stringify({
                            type: "code-change",
                            code: data.code
                        })
                    );
                }

            }
        }

        //two way communication
    })
    ws.on("close", () => {
        console.log("Client disconnected");
        //Delete disconnected socket from list
        //We don't know which room this socket belongs to.So we need to search all rooms.
        for (const [roomId, clients] of rooms) {
            const updatedClients = clients.filter(client => client.socket !== ws);
            rooms.set(roomId, updatedClients);
            const participants = updatedClients.map(client => client.username);
            for (const client of updatedClients) {
                client.socket.send(
                    JSON.stringify({
                        type: "participants",
                        users: participants
                    })
                );
            }
        }

    });
})
app.get('/', (req, res) => {
    res.send("Servering running...")
})

app.get('/getId', (req, res) => {
    const id = Math.floor(Math.random() * 900) + 100;
    console.log("id: ", id);
    res.json({
        id: id
    });

})
server.listen(7000, () => {
    console.log("Server running on port 7000")
})