const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://amal:Amal20011@cluster0.jhnfyyi.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
const commentSchema = new mongoose.Schema({
    comment: String



})
const Comment = new mongoose.model("comment", commentSchema)
module.exports = Comment