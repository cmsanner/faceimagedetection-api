const handleRegister = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleRegister: handleRegister
};