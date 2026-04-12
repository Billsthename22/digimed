const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io on the same server
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust this to your production domain later
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a private room based on Appointment ID or Chat ID
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending messages
    socket.on("send_message", (data) => {
      // data: { roomId: string, sender: string, text: string, time: string }
      
      // Broadcast to everyone in the room (including doctor and student)
      // Use .to(roomId) so messages stay private to this consultation
      io.to(data.roomId).emit("receive_message", data);
      
      // OPTIONAL: Here is where you would save to MongoDB/PostgreSQL
      // await db.messages.create({ data });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> DigiMed Server Ready on http://localhost:${PORT}`);
  });
});
