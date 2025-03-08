import express from 'express'
import { bootStrap } from './Src/app.controller.js'
import { Server } from "socket.io";
import Chat from './Src/DB/Models/chat.model.js';
import dotenv from "dotenv"
dotenv.config();

const app = express()
const port = process.env.PORT;
await bootStrap(app,express)
const server = app.listen(port, () => console.log(`Linked In App Is listening on port ${port}!`))
export const io = new Server(server, { cors: { origin: "*" } });



// All Socket Events
export let onlineHRs= {}
io.on('connection', (socket) => {

    socket.on('set-role', (user) => {
      if (user.HR) {
        onlineHRs[socket.id] = user._id; 
      }
    });

    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, message } = data;
  
      const sender = await User.findById(senderId);
      if (!sender.HR && !sender.companyOwner) {
        socket.emit('error', { message: 'Only HR or company owner can start the conversation' });
        return;
      }

      let chat = await Chat.findOne({ senderId, receiverId });
      if (!chat) {
        chat = await Chat.create({senderId,receiverId,messages: [{ message, senderId }],});
      } else {

        chat.messages.push({ message, senderId });
        await chat.save();
      }
 
      io.to(receiverId).emit('receiveMessage', { senderId, message });
    });
  
    socket.on('disconnect', () => {
      if (onlineHRs[socket.id]) {
        delete onlineHRs[socket.id];
      }
    });
  });