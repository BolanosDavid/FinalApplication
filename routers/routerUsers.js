const express = require('express')
const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken");
const database = require("../database")


let routerUsers = express.Router()

routerUsers.post("/login", async (req,res) =>{
    let email = req.body.email
    let password = req.body.password
    let errors = []

    if ( email == undefined ){
        errors.push("no email in body")
    }
    if ( password == undefined ){
        errors.push("no password in body")
    }
    
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }
    
    database.connect();
    let selectedUsers = null;
    try {
        selectedUsers = await database.query('SELECT userId, email FROM users WHERE email = ? AND password = ?',
            [email, password])
    
    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }
    
    if ( selectedUsers.length == 0){
        return res.status(401).json({error: "invalid email or password"})
    }
    
    database.disConnect();
    
    let apiKey = jwt.sign(
        { 
            email: selectedUsers[0].email,
            id: selectedUsers[0].userId
        },"FraseSecretaIndescifrable");
    activeApiKeys.push(apiKey)
    res.json({
        apiKey: apiKey,
        id: selectedUsers[0].userId,
        email: selectedUsers[0].email,
    })
})
 

routerUsers.post("/", async (req,res)=>{
    let email = req.body.email
    let password = req.body.password 
    let errors = []
    if ( email == undefined ){
        errors.push("no email in body")
    }
    if ( password == undefined ){
        errors.push("no password in body")
    }
    if ( password.length < 5){
        errors.push("Password must be over 5 characters")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let insertedUser = null;
    try {

        userWithSameEmail = await database.query('SELECT email FROM users WHERE email = ?',
            [email])

        if ( userWithSameEmail.length > 0){
            database.disConnect();
            return res.status(400).json({error: "Already a user with that email"})
        }

        insertedUser = await database.query('INSERT INTO users (email,password) VALUES (?,?)',
            [email, password])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedUser})
})


routerUsers.get("/disconect", async (req,res)=>{
    const index = activeApiKeys.indexOf(req.query.apiKey);
    if (index > -1) { 
        activeApiKeys.splice(index, 1); 
        res.json({removed: true})
    } else {
        return res.status(400).json({error: "user not found"})
    }

})





module.exports = routerUsers