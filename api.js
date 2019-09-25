//Modulos
const express = require("express")
const bodyParser = require ("body-parser")
const loki = require("lokijs")
//auxiliares o helper
const server = express()
const port = 2000
const header = { "Content-Type" : "application/json; charset=utf-8"}

let personas = null

const db = new loki("datos.json", {
	autoload : true, //true los carga, y false los pisa. resetea la base cada vez que se arranca la app.
	autosave : true ,// true para que autosalve
	autosaveInternal : 5000,//tiempo en milisegundos
	autoloadCallback :  () => {//ar function//instrucciones luego del autoload,
		
		personas = db.getCollection("personas") || db.addCollection("personas")
		/*personas = db.getCollection("personas")
		if ( personas === null){
			personas = db.addCollection("personas") //obtener la coleccion. si me arroja nulo es que no existia, entonces la creo
		}/*/
	}
})


//configuraciones
server.listen( port )
server.use ( bodyParser.urlencoded({ extended : false }))
server.use ( bodyParser.json() )
//procesos
server.get("/api", (req, res) => {  //require y response
	res.set ( header ) //header de la rta de la peticion http del server
 	res.json( personas.data )
}) 

server.post("/api", (req, res) => {

	let persona = req.body
	personas.insert(persona) //persona es un registro, que se va a llenar con el hipotetico formulario que haga.

	res.set( header )
	res.json( { "rta" : "ok"})
})