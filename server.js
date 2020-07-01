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

// // test to make sure table is working
// //   console.log(db.select('*').table('users'));
// db.select('*').from('users').then(data => {
//     console.log(data);
// })

 
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }

//     ]
    // ,
    // login: [
    //     {
    //         id: '123',
    //         hash:'$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K',
    //         email: 'john@gmail.com'
    //     }

    // ]
// }

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


    // // res.send('login');
    // bcrypt.compare("cookies", '$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K', function(err, res) {
    //     // res == true
    //     console.log('first guess: ', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K', function(err, res) {
    //     // res == true
    //     console.log('wrong password: ', res)
    // });
    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     res.json(database.users[0]);
    //     // res.json('success');
    // }else{
    //     res.status(400).json('error logging in');
    // }
})

app.post('/register', (req,res) => {
    const {email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log('hash of password: ',hash);
    // });
     //use this for local database array "database"
    // database.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()  
    // });
    // res.json(database.users[database.users.length-1]);
    //use this for the relational database "db"
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
    //use with the database array 'database'
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id){
    //         found = true;
    //        return res.json(user);
    //     }
    // })
    // if (!found){
    //     res.status(400).json('user not found');
    // }
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
    //use with database array 'database'
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id){
    //         found = true;
    //         user.entries ++;
    //        return res.json(user.entries);
    //     }
    // })
    // if (!found){
    //     res.status(400).json('user not found');
    // }

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


/* ROUTES 
* --> res = this is working!
* /login --> POST = success/fail
* /register --> POST = user
* /profile/:userId -->  GET = user
* /image --> PUT --> user
* 
*/