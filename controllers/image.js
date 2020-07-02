const handleImage = (req,res, db) => {
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
   
}


module.exports = {
    handleImage: handleImage
};