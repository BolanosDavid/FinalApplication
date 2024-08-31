const express = require('express')

const database = require("../database")


let routerFriends = express.Router()

routerFriends.post("/", async (req,res) => {
    let email = req.infoInApiKey.email

    let friend_email = req.body.email

    if(friend_email == undefined){
        return( res.status(400).json("no email in body"))
    }
    if(email == friend_email){
        return ( res.status(400).json("You cant add yourself to friend list"))
    }

    database.connect();
    let isFriend = await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend = ? ', [email,friend_email])
    if (isFriend.length > 0){
        return res.status(400).json("User is already in your friend list")
    }
    let insertedFriend = null;
    try {
        
        
            insertedFriend = await database.query(
                'INSERT INTO friends (emailMainUser,emailFriend) VALUES (?,?)',[email,friend_email])
        
    } catch (e){
        database.disConnect();
        return res.status(400).json("Can not find a user with that email")
    }

    database.disConnect();
    res.json({inserted: insertedFriend})
    
    



})
routerFriends.get("/", async (req, res) => {
    let userEmail = req.infoInApiKey.email;

    database.connect();
    let friends =await database.query("SELECT emailFriend FROM friends WHERE emailMainUser = ?", [userEmail])

    if(friends.length < 1 ){
        database.disConnect();
        return res.status(400).json({error: "No friends found with this email"})
    }else{
        database.disConnect();
        return res.json(friends);
    }



})


routerFriends.delete("/:email", async(req, res) => {
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