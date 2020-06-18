const express = require('express');
const app = express();
const port = 3000;

//create route to test get/post is working using postman
app.get('/', (req, res)=>{
    // send response to postman
    res.send('this is working!');
} )

app.listen(port, ()=>{
    console.log('app is running on port: ', port);
})
