'use strict'
/*Dependencias de la Main API*/
const bodyParser = require ('body-parser')
const express = require ('express')
const stormpath = require ('express-stormpath')
// const method_override = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
// const multer = require('multer')
const app = express()
app.locals.moment = require('moment');
// const mupload = multer({dest:'uploads/'})
// const APIfile = __dirname + '/Key.properties'
// const APIid = '6AI4RE7GB8HNBGPOVAA8D3BOF'
// const APIsecret = 'Ki6zk4DNuTs/+cky2ProC4szDeZWoMJiO0vIRW5YhaI'
// const APIpath = 'https://api.stormpath.com/v1/applications/6dE9P78g0bbttctVm5dOjo'
const Schema = mongoose.Schema

/*Variables de sistema*/
const port = process.env.PORT || 12000

mongoose.connect('mongodb://localhost/itesm',function(error,db){
  if(!error) console.log('Conexión a MongoDB')
  else console.log ('Error en conexión a DB')
})
mongoose.get('itesm')

app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))

/*Auth*/
app.use(stormpath.init(app,{
  "application":{
    href: 'https://api.stormpath.com/v1/applications/6dE9P78g0bbttctVm5dOjo'
  },
  "web":{
    "oauth2":{
      "enabled":true,
      "uri":"/oauth/token",
      "client_credentials":{
        "enabled":true,
        "accessToken":{
          "ttl":3600}
        },
          "password":{
            "enabled":true,
            "validationStrategy":"stormpath"
          }
    },
        "accessTokenCookie":{
          "name":"access_token",
          "httpOnly":true,
          "secure":null,
          "path":"/",
          "domain":null
        },
        "refreshTokenCookie":{
          "name":"refresh_token",
          "httpOnly":true,
          "secure":null,
          "path":"/",
          "domain":null
        },
        "register":{
          "enabled":true,
          "uri":"/register",
          "nextUri":"/verifyEmail",
          "autoLogin":false,
          "fields":{
            "givenName":{
              "enabled":true,
              "label":"First Name",
              "name":"givenName",
              "placeholder":"Nombre",
              "required":true,
              "type":"text"
            },
            "middleName":{
              "enabled":false,
              "label":"Middle Name",
              "name":"middleName",
              "placeholder":"Middle Name",
              "required":true,
              "type":"text"
            },
            "surname":{
              "enabled":true,
              "label":"Last Name",
              "name":"surname",
              "placeholder":"Apellido(s)",
              "required":true,
              "type":"text"
            },
            "username":{
              "enabled":false,
              "label":"Username",
              "name":"username",
              "placeholder":"Username",
              "required":true,
              "type":"text"
            },
            "email":{
              "enabled":true,
              "label":"Email",
              "name":"email",
              "placeholder":"Email",
              "required":true,
              "type":"email"
            },
            "password":{
              "enabled":true,
              "label":"Password",
              "name":"password",
              "placeholder":"Password",
              "required":true,
              "type":"password"
            }
          },
          "fieldOrder":[
            "username",
            "givenName",
            "middleName",
            "surname",
            "email",
            "password"
          ],
          "view":__dirname + '/views/layouts/register.jade'
        },
        "verifyEmail":{
          "uri":"/verify",
          "nextUri":"/",
          "view":__dirname + '/views/layouts/verify.jade'
        },
        "login":{
          "enabled":false,
          "uri":"/login",
          "nextUri":"/",
           "view": __dirname + '/views/layouts/login.jade'
        },
        "logout":{
          "enabled":false,
          "uri":"/logout",
          "nextUri":"/"
        },
        "forgotPassword":{
          "enabled":false,
          "uri":"/forgot",
          "view":__dirname + '/views/layouts/forgot-password.jade',
          "nextUri":"/login?status=forgot"
        },
        "changePassword":{
            "enabled":false,
            "autoLogin":false,
            "uri":"/change",
            "nextUri":"/login?status=reset",
            "view":__dirname + '/views/layouts/change-password.jade',
            "errorUri":"/forgot?status=invalid_sptoken"
          },
        "idSite":{
          "enabled":false,
          "uri":"/idSiteResult",
          "nextUri":"/",
          "loginUri":"",
          "forgotUri":"/#/forgot",
          "registerUri":"/#/register"
        },
        "me":{
          "enabled":false,
          "uri":"/me"
        }
    },
  website: true
}))

const reservaJSON = {
  fecha_inicio: Date,
  fecha_termino: Date,
  sala: String,
  description: String,
  nombre: String,
  matricula: String,
  email: String
}
const reservaSchema = new Schema(reservaJSON)
const db = mongoose.connection;
const Reserva = mongoose.model('Reserva',reservaSchema)

app.get('/',function(req,res){
  res.render('index')
})
app.get('/home',function(req,res){

})
app.get('/consulta',function(req,res){

})
app.get('/dashboard',stormpath.loginRequired,function(req,res){
  res.render('dashboard/index')
})
app.post('/reserva',stormpath.loginRequired,function(req,res){
  const data = {
    fecha_inicio: req.body.fechain,
    fecha_termino: req.body.fechat,
    sala: req.body.sala,
    description: req.body.desc,
    nombre: req.body.nombre,
    matricula: req.body.mat,
    email: req.body.email
  }
  const evento = new Reserva(data)
    evento.save(function(errro){
      console.log(evento)
      res.redirect('dashboard')
    })
  res.render('dashboard')
})
app.on('stormpath.ready',function(error){
  if(!error) console.log('Aplicación ejecutándose en: '+port)
  else console.log('Error al iniciar la app')
  app.listen(port)
})
