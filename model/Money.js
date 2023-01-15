const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://amal:Amal20011@cluster0.jhnfyyi.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
const moneySchema = new mongoose.Schema({
    number: String,
    date1: {
        type: String,

    },
    date2: {
        type: String,

    },

    password: String


})
const Money = new mongoose.model("money", moneySchema)
module.exports = Money