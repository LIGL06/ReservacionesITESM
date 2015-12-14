'use strict'
/*Dependencias de la Main API*/
const bodyParser = require ('body-parser')
const express = require ('express')
const stormpath = require ('express-stormpath')
const method_override = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
// const multer = require('multer')
const app = express()
// const mupload = multer({dest:'uploads/'})
// const APIfile = __dirname + '/Key.properties'
// const APIid = '6AI4RE7GB8HNBGPOVAA8D3BOF'
// const APIsecret = 'Ki6zk4DNuTs/+cky2ProC4szDeZWoMJiO0vIRW5YhaI'
// const APIpath = 'https://api.stormpath.com/v1/applications/6dE9P78g0bbttctVm5dOjo'
const Schema = mongoose.Schema

/*Variables de sistema*/
const port = process.env.PORT || 12000

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
          "view":"register"
        },
        "verifyEmail":{
          "uri":"/verify",
          "nextUri":"/",
          "view":"verify"
        },
        "login":{
          "enabled":false,
          "uri":"/login",
          "nextUri":"home",
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
          "view":"forgot-password",
          "nextUri":"/login?status=forgot"
        },
        "changePassword":{
            "enabled":false,
            "autoLogin":false,
            "uri":"/change",
            "nextUri":"/login?status=reset",
            "view":"change-password",
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
