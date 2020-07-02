const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/login', (req, res) =>{
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        // console.log('data: ', data[0])
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user '))
        }else{
            res.status(400).json('wrong credentials, password is case sensative.')
        }
    })
    .catch(err =>  res.status(400).json('wrong credentials, try again.'))
})

app.post('/register', (req,res) => {
    const {email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    //save user, save encrypted password
    db.transaction(trx => {
        //insert into users table
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            // .then(console.log);
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register, user already taken'))
})

app.get('/profile/:id', (req,res) => {
    const {id } = req.params;
     db.select('*').from('users').where({'id': id})
        .then(user => {
            // console.log('my user: ', user, ' profile id: ', id);
            if(user.length){
                res.json(user[0]);
            }else{
                res.status(400).json('not found') 
            }
            
        })
        .catch(err => res.status(400).json('error getting user'))
 
})

app.put('/image',(req,res) => {
    const {id } = req.body;
 
    //use with relational database 'db'
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        // console.log('entries: ', entries[0])
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries') )
   
})

app.listen(port, ()=>{
    console.log('app is running on port: ', port);
})
