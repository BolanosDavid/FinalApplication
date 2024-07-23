const express = require('express')
const jwt = require("jsonwebtoken");
const activeApiKeys = require("./activeApiKeys")
const port = 4000



const app = express()
var cors = require('cors')
app.use(cors())
app.use(express.json())


app.use(["/users","/friends"] ,(req,res,next)=>{
	console.log("middleware execution")

	let apiKey = req.query.apiKey
	if ( apiKey == undefined ){
		res.status(401).json({ error: "no apiKey" });
		return 
	}
	let infoInApiKey = jwt.verify(apiKey, "FraseSecretaIndescifrable");
	if ( infoInApiKey == undefined || activeApiKeys.indexOf(apiKey) == -1){
		res.status(401).json({ error: "invalid apiKey" });
		return 	
	}
	req.infoInApiKey = infoInApiKey;
  next()
})

app.listen(port,() => {
    console.log("Application listening succesfully")
})