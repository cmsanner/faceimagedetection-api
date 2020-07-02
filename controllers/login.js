const handleLogin = (req, res, db, bcrypt) =>{
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
    .catch(err => {
        console.log('#19 login err: ', err)
        res.status(400).json('wrong credentials, try again.')
    } )
}

module.exports = {
    handleLogin: handleLogin
};