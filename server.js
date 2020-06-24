const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }

    ],
    login: [
        {
            id: '123',
            hash:'$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K',
            email: 'john@gmail.com'
        }

    ]
}

//create route to test get/post is working using postman
app.get('/', (req, res)=>{
    // send response to postman
    res.send(database.users);
} )

app.post('/login', (req, res) =>{
    // res.send('login');
    bcrypt.compare("cookies", '$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K', function(err, res) {
        // res == true
        console.log('first guess: ', res)
    });
    bcrypt.compare("veggies", '$2a$10$Xq1XSNKK75fCkfUUMvCR2OVuPCoVJOwssagEoyK.23eJIl7Ud4F7K', function(err, res) {
        // res == true
        console.log('wrong password: ', res)
    });
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
        // res.json('success');
    }else{
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req,res) => {
    const {email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log('hash of password: ',hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()  
    });
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
    const {id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
           return res.json(user);
        }
    })
    if (!found){
        res.status(400).json('user not found');
    }
})

app.put('/image',(req,res) => {
    const {id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries ++;
           return res.json(user.entries);
        }
    })
    if (!found){
        res.status(400).json('user not found');
    }

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