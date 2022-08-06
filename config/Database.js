const mongoose = require('mongoose')
require('dotenv').config()

class Database {

    // This will create the DB connection
    constructor() {
        this.connection = null;
    }

    connect () {
        console.log('Connecting to database...')

        // const connectionURL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.vyamcoz.mongodb.net/?retryWrites=true&w=majority`

        mongoose.connect(process.env.LOCAL_MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connected to database.')
            this.connection = mongoose.connection
        }).catch(err => {
            console.error(err)
        })
    }
    
}

module.exports = Database;