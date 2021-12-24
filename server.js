const pool = require('./db.js').getPool();
const bcrypt = require("bcrypt");
require('dotenv').config()

const express = require("express");
const socket = require("socket.io");
const fs = require("fs");
const app = express();

var PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

app.use(express.static('public'));
console.log("Server is running on port: " + PORT);
const io = socket(server);

var count = 0;

io.on('connection', async (socket)=>{

    console.log("New socket connection: " + fetchUserId(socket));

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
            io.emit('status', 401);
            return;
        }
        const validPassword = await bcrypt.compare(userData.password, users.rows[0].user_password);
        if(!validPassword){
            io.emit('status', 402);
            return;
        }
        io.emit('status', 200);
    })

    socket.on('register', async(userData)=>{
        console.log("Username: ", userData.password);
        try{
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING *', [userData.username, hashedPassword]);
            io.emit('status', 200)
        }
        catch(error){
            io.emit('status', 405)
        }
    })

    socket.on('join_room', (room)=>{
        socket.join("abc");
    });

    socket.on('test', (room)=>{
        socket.sockets.in(room).emit("message", "hello mthfckers")
    });

})