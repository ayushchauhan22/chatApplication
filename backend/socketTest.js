// import { io } from 'socket.io-client';

// const SERVER_URL = 'http://localhost:5000';

// // Replace these with real IDs from your DB
// const conversationId = 'CONVERSATION_ID_HERE';
// const user1Id = 'USER1_ID_HERE';
// const user2Id = 'USER2_ID_HERE';

// // create two socket clients
// const user1 = io(SERVER_URL);
// const user2 = io(SERVER_URL);

// /* ================= USER 1 ================= */

// user1.on('connect', () => {
//   console.log('User1 connected:', user1.id);

//   // mark user online
//   user1.emit('connection', user1Id);

//   // join conversation room
//   user1.emit('join_conversation', conversationId);

//   // send message after 2 seconds
//   setTimeout(() => {
//     console.log('User1 sending message...');

//     user1.emit('send_message', {
//       conversationId,
//       senderId: user1Id,
//       text: 'Hello from User1',
//     });
//   }, 2000);
// });

// user1.on('receive_message', (message) => {
//   console.log('User1 received message:', message);
// });

// user1.on('message_delivered', (data) => {
//   console.log('User1 message delivered:', data);
// });

// user1.on('message_seen', (data) => {
//   console.log('User1 message seen:', data);
// });

// /* ================= USER 2 ================= */

// user2.on('connect', () => {
//   console.log('User2 connected:', user2.id);

//   // mark user online
//   user2.emit('connection', user2Id);

//   // join conversation room
//   user2.emit('join_conversation', conversationId);
// });

// user2.on('receive_message', (message) => {
//   console.log('User2 received message:', message);

//   // simulate delivered
//   user2.emit('message_delivered', {
//     messageId: message._id,
//     conversationId,
//   });

//   // simulate reading message
//   setTimeout(() => {
//     user2.emit('message_seen', {
//       messageId: message._id,
//       conversationId,
//     });
//   }, 2000);
// });

// user2.on('message_delivered', (data) => {
//   console.log('User2 delivery update:', data);
// });

// user2.on('message_seen', (data) => {
//   console.log('User2 seen update:', data);
// });

// /* ================= DISCONNECT ================= */

// user1.on('disconnect', () => {
//   console.log('User1 disconnected');
// });

// user2.on('disconnect', () => {
//   console.log('User2 disconnected');
// });
