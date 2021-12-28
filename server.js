const pool = require('./db.js').getPool();
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

let games = []

io.on('connection', async (socket)=>{
    let user = ["", "", "", ""]
    console.log("New socket connection: " + socket.id);

    socket.on('counter', ()=>{
        count++;
        console.log(count);
        console.log(socket.id);
        io.emit('counter', count);
    })

    socket.on('login', async(userData)=>{
        console.log("Username: ", userData.password);
        const users = await pool.query('SELECT * FROM users WHERE user_name = $1', [userData.username]);
        if(users.rows.length===0){
            console.log('within')
            io.emit('status', 401);
            return;
        }

        const validPassword = await bcrypt.compare(userData.password, users.rows[0].user_password);

        if(!validPassword){
            io.emit('status', 402);
            return;
        }
        id = users.rows[0].user_id;
        console.log("myid", id)
        user[0] = id
        io.emit('status', 200);
    })

    socket.on('register', async(userData)=>{
        console.log("Username: ", userData.username);
        console.log("Password: ", userData.password);
        try{
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING *', [userData.username, hashedPassword]);
            id = await pool.query('SELECT user_id FROM users WHERE user_name = $1', [userData.username]);
            user[0] = id
            io.emit('status', 200)
        }
        catch(error){
            io.emit('status', 405)
        }
    });

    socket.on('create_room', ()=>{
        var thisGameId = (Math.random() * 1000000 ) | 0;
        socket.join(thisGameId.toString());
        console.log("gameID: ", thisGameId)
        user[1] = thisGameId.toString()
        io.to(socket.id).emit("room_id", thisGameId)
    });

    socket.on('join_room', (room)=>{
        fRoom = room[0]
        socket.join(fRoom);
        var room = io.sockets.adapter.rooms.get(fRoom).size
        if(room === 2 ) {
            user[1] = fRoom
            games.push([fRoom, "", ""])
            io.to(socket.id).emit('sessionJoin', room)
            io.in(fRoom).emit("session", room)
        }
    });
    //
    // socket.on('confirmBoard', (board)=>{
    //     user[2] = board
    //     // socket.emit('createGame')
    //     for(let game of games){
    //         if(game[0][0] === user[1]){
    //             // console.log("Here1")
    //             // console.log("game", game[1])
    //             console.log("userrr", user[0])
    //             if(game[0][1] === user[0] && game[0][2] != ""){
    //                 console.log("Here2")
    //                 io.to(socket.id).emit('gameCreated', "true")
    //                 io.in(fRoom).emit("gameCreated", "false")
    //             }
    //             else if(game[0][2] === user[0] && game[0][1] != ""){
    //                 console.log("Here3")
    //                 io.to(socket.id).emit('gameCreated', "true")
    //                 io.in(fRoom).emit("gameCreated", "false")
    //             }
    //             else if(game[0][1] == "") game[0][1] = user;
    //             else if(game[0][2] == "") game[0][2] = user;
    //             console.log("game1: ", game[0][1])
    //             console.log("game2: ", game[2])
    //         }
    //     }
    // });
    //
    // socket.on('createGame', ()=>{
    //     for(let game in games){
    //         console.log("Here")
    //         if(game[0] === user[1]){
    //             console.log("Here1")
    //             if(game[1] === user[0] && game[2] != ""){
    //                 console.log("Here2")
    //                 io.to(socket.id).emit('gameCreated', "false")
    //                 io.in(fRoom).emit("gameCreated", "true")
    //             }
    //             else if(game[2] === user[0] && game[1] != ""){
    //                 console.log("Here3")
    //                 io.to(socket.id).emit('gameCreated', "false")
    //                 io.in(fRoom).emit("gameCreated", "truuue")
    //             }
    //             else if(game[1] == "") game[1] = user;
    //             else if(game[2] == "") game[2] = user;
    //             console.log("Here")
    //         }
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