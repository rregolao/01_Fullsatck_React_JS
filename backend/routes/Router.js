const express = require("express"); //importa express
const router = express(); //nomeia a instancia express como router

//importa as rotas de usuário para disponibilizar para apliação - Demanda configuração de acesso no POSTMAN
router.use("/api/users", require("./UserRoutes"));
//13. Nova rota para foto sendo habilitada no POST
router.use("/api/photos", require("./PhotosRoutes"));

//Rotas da aplicação, usuário, post, fotos...
router.get('/', (req, res) => {
    res.send('API Working!');
});

//Exporta o módulo
module.exports = router;