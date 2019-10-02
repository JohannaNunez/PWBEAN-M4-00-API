//Modulos
const express = require("express")
const bodyParser = require ("body-parser")
const loki = require("lokijs")
const joi = require ( "@hapi/joi")
//auxiliares o helper
const server = express()
const port = 2000

const schema = joi.object({

	titulo : joi.string().alphanum().min(3).max(50).required(),
	descripcion : joi.string().alphanum().max(280).required(),  
	estreno :  joi.number().integer().min(1895).max(new Date().getFullYear()),
	poster : joi.string().uri(), 
	trailer :  joi.string().uri()

})

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
//Obtener una sola peli
server.get("/api", (req, res) => {  //require y response
	res.set ( header ) //header de la rta de la peticion http del server
 	res.json( peliculas.data )
}) 
//obtener una sola peli por ID
server.get("/api/:id", (req, res) => {  //require y response

	 let elID = req.params.id

	 let laPelicula = peliculas.get(elID) 

 	res.json( laPelicula )
})

//↓ crear una nueva peli
server.post("/api", (req, res) => {

	let pelicula = req.body //los datos estan en req body, y lo guardo en pelicula
	//peliculas.insert( pelicula ) //pelicula es un registro, que se va a llenar con el hipotetico formulario que haga.

	let rta = schema.validate( pelicula , {abortEarly : false })

	if ( rta.error ) {

		let errores = rta.error.details.map(function(error){
			let msg = new Object ()
			msg[error.path [0]] = error.message 

			return msg
		})
		res.json( {"errors" : errores} )
	} else {
		peliculas.insert(pelicula)
		res.json({ "rta" : "ok"})
	}
})
//↓ actualizar una peli por ID
server.put("/api/:id", (req, res) => {
	 let elID = req.params.id
	 let laPelicula = peliculas.get(elID) //SE GUARDA LA UBICACION

	 let nuevosDatos = req.body
	 laPelicula.titulo = nuevosDatos.titulo
	 laPelicula.descripcion = nuevosDatos.descripcion
	 laPelicula.estreno = nuevosDatos.estreno
	  laPelicula.poster = nuevosDatos.poster
	  laPelicula.trailer = nuevosDatos.trailer

	 peliculas.update(laPelicula)

	 res.json({ "peli_actualizada" :  laPelicula})
})
//↓ borrar una peli
server.delete("/api/:id", (req, res) => {  //ver si existe el datp
	 let elID = req.params.id
	 let laPelicula = peliculas.get(elID)

	
	 peliculas.remove ( laPelicula ) //borrar
	 res.json({ "peli_borrada" : laPelicula }) //esto te muestra el dato cuando

	})