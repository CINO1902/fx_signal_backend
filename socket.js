// const { Server } = require("socket.io");

// let io;

// module.exports = {
//   init: (server) => {
//     io = new Server(server, {
//       cors: {
//         origin: "*",
//       },
//     });

//     io.on("connection", (socket) => {
//       console.log("Client connected:", socket.id);
//       socket.emit("welcome", { msg: "Connected!", time: new Date() });
//     });
//   },
//   getIO: () => {
//     if (!io) {
//       throw new Error("Socket.io is not initialized!");
//     }
//     return io;
//   },
// };
