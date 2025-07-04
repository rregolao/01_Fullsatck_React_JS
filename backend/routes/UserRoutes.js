const express = require("express");
const router = express.Router();

//1.Controller, adiciona o 4.login de UserController, 7.getCurrentUser, 11.getUserById,
const {register, login, getCurrentUser, update, getUserById,} = require('../controllers/UserController');

//1.Middlewares
const validate = require('../middlewares/handleValidation');
//2.Nova importação com desestruturação, pela lógica o erro acontece ANTES da validação do usuário, portanto aplica-se antes do VALIDATE e invocando função com "()" e adicona o loginValidation de userValidations.jsx. 9.Adiciona userUpdateValidation 
const {userCreateValidation, loginValidation, userUpdateValidation,} = require("../middlewares/userValidations");
//7.Importa arquivo "authGuard.jsx"
const authGuard = require('../middlewares/authGuard');
//importa imageUpload
const {imageUpload} = require('../middlewares/imageUpload');

//1.Router - Aplica validade entre requisição do usuário entre a rota e o register.
router.post("/register", userCreateValidation(), validate, register);
//4.Cria rota para /login executando o loginValidation
router.post("/login", loginValidation(), validate, login);
//7.Cria rota de get para retorno do usuário
router.get("/profile", authGuard, getCurrentUser);
//9.Rota de atualização com PUT, demanda autenticação pelo "authGuard", demanda validação pelo "userUpdateValidation", o "validate" e finaliza com imagem para salvar caminho no Banco de daos e finaliza com a função update
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single('profileImage'), update);
//11.Rota de parametro dinamico
router.get("/:id", getUserById);


module.exports = router;