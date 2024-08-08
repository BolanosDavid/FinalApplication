const express = require('express')

const database = require("../database")
const { route } = require('./routerFriends')


let routerFriends = express.Router()

routerFriends.post("/", async (req,res) => {
    let email = req.infoInApiKey.email

    let friend_email = req.body.email

    if(friend_email == undefined){
        return( res.status(400).json("no email in body"))
    }

    database.connect();
    let insertedPresent = null;
    try {
        insertedPresent = await database.query(
            'INSERT INTO friends (emailMainUser,emailFriend) VALUES (?,?)',
            [email,friend_email])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedPresent})



})
routerFriends.get("/", async (req, res) => {
    let email = req.infoInApiKey.email

    database.connect();
    let friends = database.query("SELECT * FROM friends WHERE emailMainUser = ?", [email])

    if(friends.length < 1 ){
        database.disConnect();
        return res.status(400).json({error: "No friends found with this email"})
    }else{
        database.disConnect();
        return friends;
    }



})


routerFriends.delete("/:email", async(res, res) => {
    let emailToDelete = req.params.email

    if ( emailToDelete == undefined){
        return res.status(400).json("No email in params")
    }

    database.connect();
    
    try {
        await database.query('DELETE FROM friends WHERE emailMainUser = ? AND emailFriend = ?',[req.infoInApiKey.email,emailToDelete]) 
         
    } catch (e){
        res.status(400).json({error: e })
        return
    }
    
    database.disConnect();
    res.json({deleted: true})



})




module.exports = routerFriends