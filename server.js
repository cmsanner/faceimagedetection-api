const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const login = require('./controllers/login');
const { handleProfile } = require('./controllers/profile');
const { handleImage } = require('./controllers/image');

//NOTE: using postgres database and we downloaded pg, so use client: 'pg'
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'Chris',
      password : 'test',
      database : 'smartbrain'
    }
  });

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

//create route to test get/post is working using postman
app.get('/', (req, res)=>{
    // send response to postman
    res.send(database.users);
} )

app.post('/login', (req, res) => { login.handleLogin(req, res, db, bcrypt) } )
app.post('/register', (req, res) => { register.handleRegister(req,res, db, bcrypt)} )
app.get('/profile/:id', (req,res,db ) => {handleProfile(req, res, db) })
app.put('/image',(req,res) => {handleImage(req, res, db) })

app.listen(port, ()=>{
    console.log('app is running on port: ', port);
})
