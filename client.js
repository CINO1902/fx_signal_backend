// const io = require("socket.io-client");
// const { Server } = require("socket.io");
// const socket = io("ws://localhost:4000");
// const pairprice = require("./model/pairprice");

// module.exports = (server) => {
//     console.log("WebSocket Server Initializing...");
//     const io = new Server(server, {cors: true});
//     io.on("connect", () => {

//     console.log("Connected to server:", socket.id);
//     // Function to fetch prices and emit to clients
//   const sendPrices = async () => {
//     try {
//       let prices = await pairprice.find({});
//       if (prices.length === 0) {
//         socket.emit("priceUpdate", { status: "empty", msg: "No signals found", signals: prices });
//       } else {
//         socket.emit("priceUpdate", { status: "success", msg: "Successful", signals: prices });
//       }
//     } catch (err) {
//       console.error(err);
//       socket.emit("priceUpdate", { status: "fail", msg: "Something went wrong" });
//     }
//   };

//   // Send prices immediately on connection
//   sendPrices();

//   // Send updated prices every 10 minutes
//   const interval = setInterval(sendPrices, 10 * 60 * 1000);

//   // Cleanup on disconnect
//   io.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//     clearInterval(interval);
//   });
// });

// io.on("message", (data) => {
//     console.log("Message from server:", data);
// });

// io.on("disconnect", () => {
//     console.log("Disconnected from server");
// });

// }