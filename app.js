import express from "express";
import cors from "cors";
import nodemailer from "./nodemailer.js";
import http from "http";
import { Server } from "socket.io";
import { ask } from "./openai.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.use("/", nodemailer);

const server = http.createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("ask", async (question) => {
    console.log("Received question:", question);

    if (typeof question !== "string" || !question.trim()) {
      socket.emit(
        "response",
        "Invalid question format. Please send a valid string."
      );
      return;
    }

    try {
      const response = await ask(question);
      socket.emit("response", response);
      console.log("Sending response:", response);
    } catch (error) {
      console.error("Error processing question:", error);
      socket.emit("response", "Error occurred: " + error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
