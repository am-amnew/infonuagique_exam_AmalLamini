const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://amal:Amal20011@cluster0.jhnfyyi.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    Prenom: String,
    Tele: String,
})
const Admin = new mongoose.model("admins", adminSchema)
module.exports = Admin