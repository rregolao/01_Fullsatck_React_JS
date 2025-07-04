require('dotenv').config();
const express = require('express');
const path = require('path'); //determina o diretório das imagens
const cors = require('cors'); //permite o acesso ao projeto pela aplicação do front end
const port = process.env.PORT; //o dotenv utulizará futuramente

//inicializa aplicação invocando o framework pela variável
const app = express();

//configurar respostas em JSON(texto, formato JS) e form data response(apenas para imagem)
app.use(express.json()) //express e json são dois middlewares do express
app.use(express.urlencoded({extended: false})); //aceita form data futramente para as requisições

//Cors - Será executado requisições do mesmo domínio. Chama o middwhere de "Cors" passando a credencial como true e a origem apontando de ondem vem a requisição. Atenção para o local exatado do react
app.use(cors({credentials: true, origin: "http://localhost:5173"}));

//Upload directory for images, utiliza outro middleware para a pasta "/uplaads" com arquivos estaticos declarado em "express.statics" eo path.json agrupa o diretório atual com a "/uploads" no nome do arquivo, dependendo do servidor, ele encontra este caminho das pastas das imagens
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//DB connection
require("./config/db");

//Rotas
const router = require("./routes/Router");
app.use(router);

//Inicia aplicação
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});