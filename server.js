const express = require('express');
const app = express();
app.use(express.json());

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

    ]
}

//create route to test get/post is working using postman
app.get('/', (req, res)=>{
    // send response to postman
    res.send('this is working!');
} )

app.post('/login', (req, res) =>{
    // res.send('login');
    if(req.body.emailAddress === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success');
    }else{
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req,res) => {
    const {email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()  
    });
    res.json(database.users[database.users.length-1]);

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