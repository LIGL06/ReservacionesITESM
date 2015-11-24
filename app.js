const express = require('express')
const stormpath = require('express-stormpath')
const mongoose = require('mongoose')
const date = new Date()
const app = express()
const Schema = mongoose.Schema
const port = process.env.PORT || 5000

mongoose.connect('mongodb://localhost/itesm',function(error,db){
  if(!error) console.log('Conexión a DB')
  else console.log ('Error en conexión a DB')
})

app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))

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
  res.render('home/index')
})
app.get('/home',function(req,res){
  res.render('home/index')
})
app.get('/reserva',function(req,res){
  res.render('reserva/index')
})

app.on('stormpath.ready',function(error){
  if(!error) console.log('Aplicación ejecutándose')
  else console.log('Error al iniciar la app')
  app.listen(port)
})
