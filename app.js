const express = require('express')
const port = 4000



const app = express()
var cors = require('cors')
app.use(cors())
app.use(express.json())

const routerUsers= require("./routers/routerUsers")
const routerPresents = require("./routers/routerPresents")
const routerFriends = require("./routers/routerFriends")



app.use("/users", routerUsers)
app.use("/presents", routerPresents)
app.use("/friends", routerFriends)

app.listen(port,() => {
    console.log("Application listening succesfully")
})