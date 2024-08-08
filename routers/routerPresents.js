const express = require('express')
const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken");
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


routerPresents.put("/:id", async (req,res)=>{
    let id = req.params.id
    let name = req.body.name
    let description = req.body.description
    let url = req.body.url
    let price = req.body.price

    if ( name == undefined ){
        errors.push("no name in body")
    }
    if ( description == undefined ){
        errors.push("no description in body")
    }
    if ( url == undefined ){
        errors.push("no url in body")
    }
    if ( price == undefined ){
        errors.push("no price in body")
    }
   
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let updatedItem = null;
    try {
        updatedItem = await database.query(
            'UPDATE items SET name = ?, description = ?, url = ?, price = ? WHERE id = ? AND idUser = ?', 
            [name,description,url,price,id,req.infoInApiKey.id ])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({modifiyed: updatedItem})
})



module.exports = routerPresents