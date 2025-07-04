const mongoose = require('mongoose');
const {Schema} = mongoose;

const photoSchema = new Schema({
    image: String, //Banco de dados não salva imagem, apenas o caminho
    title: String,
    likes: Array, //Armazena, qtde, conteúdo
    comments: Array, //Armazena, qtde, conteúdo e comentários
    userId: mongoose.ObjectId, //usuário que iseriu a foto, não é uma string comum, é uma string do mongoose
    userName: String, //Nome do usuário na foto
}, 
    {
    timestamps: true,   
    }
);

//Define como módulo de foto como schema como segundo argumento
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;