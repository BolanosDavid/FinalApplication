const express = require('express')
const database = require("../database")


let routerPresents = express.Router()

routerPresents.post("/", async (req,res) => {

    let userId = req.infoInApiKey.id

    let name = req.body.name
    let description = req.body.description
    let url = req.body.url
    let price = parseDouble(req.body.price)
    let errors = []

    if( name == undefined ){
        errors.push("no name in body")
    }
    if( description == undefined ) {
        errors.push("no description in body")
    }

    if ( url == undefined){
        errors.push("no url in body")
    }
    if( price == undefined ){
        errors.push("no price in body")
    }

    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }
    database.connect()
    let insertedPresent = null;
    try {
        insertedPresent = await database.query(
            'INSERT INTO presents (userId,name,description,url,price) VALUES (?,?,?,?,?)',
            [userId, name,description,url,price])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedPresent})

})


routerPresents.get("/", async (req,res) => {
        let userEmail = req.infoInApiKey.email
        
        database.connect();
        let userId = await database.query("SELECT userId FROM users WHERE email = ?", [userEmail])
        let userPresents = await database.query('SELECT presents.* FROM presents WHERE presents.userId =  ?', [userId])

        if (userPresents.length < 1){
            database.disConnect();
            return res.status(400).json({error: "No presents with this id"})
        } else {
            database.disConnect();
            return res.send(presents)
        }
    
});
routerPresents.get("/:id", async (req,res) => {
    let presentsId = req.params.id
    let userId = req.infoInApiKey.id

    if ( presentsId == undefined ){
        return res.status(400).json({error: "no id in param"})
    }
    
    database.connect();
    
    let userPresents = await database.query('SELECT * FROM presents WHERE presents.id =  ?', [presentsId])
    if(userPresents.userId == userId){
        if (userPresents.length < 1){
            database.disConnect();
            return res.status(400).json({error: "No present with this id"})
        } else {
            database.disConnect();
            return res.send(presents)
        }
    }else{
        database.disConnect();
        return res.status(400).json({error: "Present userId and Apikey userId does not match"})
    }

});
routerPresents.delete("/:id", async (req,res) => {
   
        let id = req.params.id
        if ( id == undefined ){
            return res.status(400).json({error: "no id "})
        }
        database.connect();
        try {
        
            let presents = await database.query('SELECT * FROM presents WHERE id = ? AND userId = ?', 
                [id, req.infoInApiKey.id])
    
            if ( presents.length > 0){
                await database.query('DELETE FROM presents WHERE id = ?', 
                    [id])
                
            }
        } catch (e){
            res.status(400).json({error: e })
            return
        }
        
        database.disConnect();
        res.json({deleted: true})
    
})


routerPresents.put("/:id", async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json("No id in params");
    }

    let name = req.body.name;
    let description = req.body.description;
    let url = req.body.url;
    let price = req.body.price;

    // Si todos los campos del body son undefined, se asume que no es el dueño quien hace la petición
    if (!name && !description && !url && !price) {
        let friendEmail = req.infoInApiKey.email;

        try {
            database.connect();
            let ownersEmailResult = await database.query('SELECT users.email FROM presents JOIN users ON presents.userId = users.userId WHERE presents.id = ?', [id]);
            if (ownersEmailResult.length < 1) {
                return res.status(400).json("Present owner not found");
            }
            let ownersEmail = ownersEmailResult[0].email;
            let isFriend = await database.query("SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend = ?", [ownersEmail, friendEmail]);
            if (isFriend.length < 1) {
                return res.status(400).json("Not in friend list");
            }

            let chosenByResult = await database.query("SELECT chosenBy FROM presents WHERE id = ?", [id]);
            if (chosenByResult.length < 1 || chosenByResult[0].chosenBy) {
                return res.status(400).json("Present is already chosen by another friend");
            }

            if (friendEmail === ownersEmail) {
                return res.status(400).json("Owner cannot give a present to himself");
            }

            let updatedPresent = await database.query('UPDATE presents SET chosenBy = ? WHERE id = ?', [friendEmail, id]);
            return res.status(200).json({ modified: updatedPresent });

        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        } finally {
            database.disConnect();
        }

    } else {
        let errors = [];

        if (!name) errors.push("no name in body");
        if (!description) errors.push("no description in body");
        if (!url) errors.push("no url in body");
        if (!price) errors.push("no price in body");

        if (errors.length > 0) {
            return res.status(400).json({ error: errors });
        }

        try {
            database.connect();

            let updatedPresent = await database.query(
                'UPDATE presents SET name = ?, description = ?, url = ?, price = ? WHERE id = ? AND userId = ?',
                [name, description, url, price, id, req.infoInApiKey.id]
            );

            return res.status(200).json({ modified: updatedPresent });

        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        } finally {
            database.disConnect();
        }
    }
});

routerPresents.get("", async(req,res) => {
    let queryEmail = req.query.email
    let apiEmail = req.infoInApiKey.email
    

    if(queryEmail != undefined){
        database.connect()
        let isFriend =await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend = ? ', [apiEmail,queryEmail])
        if( isFriend.length < 1){
            database.disConnect();
            return res.status(400).json("Email in query does not have you in friends")
        }else{
            let userId = await database.query("SELECT users.userId FROM users WHERE email = ?",[queryEmail])
            let presents = await database.query("SELECT * FROM presents WHERE userId = ?",[userId])
            database.disConnect();
            return res.json(presents);
        }
    }
})


module.exports = routerPresents