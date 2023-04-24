const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://rushinnemlawala:rushin5096@cluster0.wuw6v9w.mongodb.net/test"

const connectToMongo = ()=> {
    mongoose.connect(mongoURI)
        console.log("Connected to mongo succcessfully")
}

module.exports = connectToMongo;