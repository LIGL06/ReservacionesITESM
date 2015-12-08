/*Dependencias de la Main API*/
const bodyParser = require ('body-parser')
const express = require ('express')
const stormpath = require ('express-stormpath')
const method_override = require('method-override')
const mongoose = require('mongoose')
const multer = require('multer')
const app = express()
const mupload = multer({dest:'uploads/'})
const APIfile = __dirname + '/Key.properties'
const APIid = '6AI4RE7GB8HNBGPOVAA8D3BOF'
const APIsecret = 'Ki6zk4DNuTs/+cky2ProC4szDeZWoMJiO0vIRW5YhaI'
const APIpath = 'https://api.stormpath.com/v1/applications/1j3A4OUqTuPikLGcU5M7Yy'
const Schema = mongoose.Schema

/*Variables de sistema*/
const port = process.env.PORT || 8000

mongoose.connect('mongodb://localhost/itesm',function(error,db){
  if(!error) console.log('Conexión a DB')
  else console.log ('Error en conexión a DB')
})

app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))
/*Auth*/
/*Stormpath Auth Init*/
app.use(stormpath.init(app,{
  "client": {
    "apiKey":{
      "file": APIfile,
      "id": APIid,
      "secret": APIsecret
    },
      "cacheManager":{
        "defaultTtl": 300,
        "defaultTti": 300,
        "caches": {
          "account": {
            "ttl": 300,
            "tti": 300
          }
        }
      },
  "baseUrl": "https://api.stormpath.com/v1",
  "connectionTimeout": 30,
  "authenticationScheme": "SAUTHC1", // or "BASIC"
  "proxy":{
    "port": "",
    "host": "",
    "username": "",
    "password": ""
  }
},
  website: true,
}))


const reservaJSON = {
  fecha: Date,
  sala: String,
  description: String,
  nombre: String,
  matricula: String,
  email: String
}
const reservaSchema = new Schema(reservaJSON)
const Reserva = mongoose.model('Reserva',reservaSchema)

app.get('/',function(req,res){
  res.render('index')
})
app.get('/home',function(req,res){
  res.render('home/index')
})
app.get('/reserva',function(req,res){
  res.render('reserva/index')
})

app.on('stormpath.ready',function(error){
  if(!error) console.log('Aplicación ejecutándose en: '+port)
  else console.log('Error al iniciar la app')
  app.listen(port)
})
