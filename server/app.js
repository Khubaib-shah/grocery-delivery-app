import "dotenv/config";
import { connectDB } from "./src/config/connectDB.js";
import fastify from "fastify";
import { PORT } from "./src/config/config.js";
import fastifySocketIO from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = fastify();

  app.register(fastifySocketIO, {
    cors: { origin: "*" },

    pingInterval: 1000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Grocery App running on " + addr);
    }
  });
  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A user is Connected");

      socket.on("joinRoom", (orderId) => {
        socket.on("disconnect", () => {
          console.log("User Disconnected ");
        });
      });
    });
  });
};
start();
