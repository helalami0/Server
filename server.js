// const pool = require('./db.js').getPool();
const bcrypt = require("bcrypt");
// require('dotenv').config()

const express = require("express");
const socket = require("socket.io");
const fs = require("fs");
const app = express();

var PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

app.use(express.static('public'));
console.log("Server is running on port: " + PORT);
const io = socket(server);
io.rooms = []
io.gamesMap = new Map()

var count = 0

io.on('connection', async (socket) => {
    console.log("New socket connection: " + socket.id);

    socket.on('counter', () => {
        count++;
        console.log(count);
        console.log(socket.id);
        io.emit('counter', count);
    })
    //
    // socket.on('login', async(userData)=>{
    //     console.log("Username: ", userData.password);
    //     const users = await pool.query('SELECT * FROM users WHERE user_name = $1', [userData.username]);
    //     if(users.rows.length===0){
    //         console.log('within')
    //         socket.emit('status', 401);
    //         return;
    //     }
    //
    //     const validPassword = await bcrypt.compare(userData.password, users.rows[0].user_password);
    //
    //     if(!validPassword){
    //         socket.emit('status', 402);
    //         return;
    //     }
    //     id = users.rows[0].user_id;
    //     console.log("myid", id)
    //     socket.userid = id
    //     socket.username = userData.username
    //     socket.emit('status', 200);
    // })
    //
    // socket.on('register', async(userData)=>{
    //     console.log("Username: ", userData.username);
    //     console.log("Password: ", userData.password);
    //     try{
    //         const hashedPassword = await bcrypt.hash(userData.password, 10);
    //         const newUser = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING *', [userData.username, hashedPassword]);
    //         id = await pool.query('SELECT user_id FROM users WHERE user_name = $1', [userData.username]);
    //         socket.userid = id
    //         socket.emit('status', 200)
    //     }
    //     catch(error){
    //         socket.emit('status', 405)
    //     }
    // });
    //
    // socket.on('create_room', ()=>{
    //     var thisGameId = ((Math.random() * 1000000 ) | 0).toString();
    //     socket.join(thisGameId);
    //     console.log("gameID: ", thisGameId)
    //     socket.roomid = thisGameId
    //     io.rooms.push(thisGameId)
    //     console.log("Specific: ", socket.roomid)
    //     console.log("General: ", io.rooms)
    //     io.to(socket.id).emit("room_id", thisGameId)
    //     io.gamesMap.set(thisGameId, [])
    // });
    //
    // socket.on("testing", ()=>{
    //     // socket.emit("test", socket.roomid)
    //     console.log("testinng", io.gamesMap.get(socket.roomid))
    // });
    //
    // socket.on('join_room', (room)=>{
    //     fRoom = room[0]
    //     if(io.gamesMap.has(fRoom)){
    //         var room = io.sockets.adapter.rooms.get(fRoom).size
    //         if(room === 1 ) {
    //             socket.join(fRoom);
    //             socket.roomid = fRoom
    //             socket.emit('sessionJoin', room)
    //             io.in(fRoom).emit("session", room)
    //         }
    //     }
    // });
    //
    // socket.on('confirmBoard', (board)=>{
    //     socket.board = board
    //     let game = io.gamesMap.get(socket.roomid)
    //     if(game.length == 0){
    //         io.gamesMap.set(socket.roomid, [socket.userid])
    //     }
    //     else if(game.length == 1 && !game.includes(socket.userid)){
    //         game.push(socket.userid)
    //         io.gamesMap.set(socket.roomid, game)
    //
    //         //Random player begins
    //         let random_boolean = Math.random() < 0.5;
    //         io.in(fRoom).emit("gameCreated", random_boolean)
    //         socket.emit("gameCreated", !random_boolean)
    //     }
    // });

    //
    // socket.on('attack', (cell)=>{
    //     for(let game in games){
    //         if(game[0] === user[1]){
    //             if(game[1][0] != user[0]){
    //                 if(game[1][2][cell] == "1"){ //check if cell should be int or string
    //                     io.in(user[1]).emit("touched", true)
    //                 }
    //                 else{
    //                     io.in(user[1]).emit("touched", false)
    //                 }
    //             }
    //             else{
    //                 if(game[2][2][cell] == "1"){ //check if cell should be int or string
    //                     io.in(user[1]).emit("touched", true, cell)
    //                     io.to(socket.id).emit('touched', false, cell)
    //                 }
    //                 else{
    //                     io.in(user[1]).emit("touched", false, cell)
    //                     io.to(socket.id).emit('touched', true, cell)
    //                 }
    //             }
    //         }
    //     }
    // });
    //
    // socket.on('gameOver', ()=>{
    //     io.in(user[1]).emit("Winner")
    //     for(let game in games){
    //         if(game[0] === user[1]){
    //             game = []
    //         }
    //     }
    // });
})