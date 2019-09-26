//Modulos
const express = require("express")
const bodyParser = require ("body-parser")
const loki = require("lokijs")
//auxiliares o helper
const server = express()
const port = 2000
const header = { "Content-Type" : "application/json; charset=utf-8"}

let peliculas = null

const db = new loki("nerdflix.json", {
	autoload : true, //true los carga, y false los pisa. resetea la base cada vez que se arranca la app.
	autosave : true ,// true para que autosalve
	autosaveInternal : 5000,//tiempo en milisegundos
	autoloadCallback :  () => {//ar function//instrucciones luego del autoload,
		
		peliculas = db.getCollection("peliculas") || db.addCollection("peliculas")
		/*peliculas = db.getCollection("peliculas")
		if ( peliculas === null){
			peliculas = db.addCollection("peliculas") //obtener la coleccion. si me arroja nulo es que no existia, entonces la creo
		}/*/
	}
})

//configuraciones
server.listen( port )
server.use ( bodyParser.urlencoded({ extended : false }))
server.use ( bodyParser.json() )

server.use ( express.static("./public"))

server.set('json spaces', 4)

//procesos
server.get("/api", (req, res) => {  //require y response
	res.set ( header ) //header de la rta de la peticion http del server
 	res.json( peliculas.data )
}) 
server.get("/api/:id", (req, res) => {  //require y response

	 let elID = req.params.id

	 let laPelicula = peliculas.get(elID) || { error : "pelicula no encontrada"}
 	res.json( laPelicula)
})


server.post("/api", (req, res) => {

	let pelicula = req.body
	peliculas.insert( pelicula ) //pelicula es un registro, que se va a llenar con el hipotetico formulario que haga.

	//res.set( header )
	res.json( { "rta" : "ok"})
})