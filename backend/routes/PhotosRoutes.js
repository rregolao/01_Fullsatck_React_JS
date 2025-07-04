//12.Inicia bloco fotos
const express = require('express');
const router = express.Router();

//Controller - Desestruração neste objeto
//13.InserPhoto, 14.deletePhoto, 15.getAllPhotos, 16.getUserPhotos, 17.getPhotoById, 18.updatePhoto, 19.likePhoto, 20.commentPhoto, 21.searchPhotos
const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos} = require('../controllers/PhotoController');

//Middlewares
//12. importa middeware, 13.ImageUpload, 18.photoUpdateValidation, 20.commentValidation
const {photoInsertValidation, photoUpdateValidation, commentValidation} = require('../middlewares/photoValidation');
const authGuard = require('../middlewares/authGuard');
const validate = require('../middlewares/handleValidation');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
//13.Cria rota post para image, authguard para estar autenticado, imageUpload como middleware do validate, photoinsertvalidation, validate p/ imprimir erros, insertphoto
router.post("/", authGuard, imageUpload.single('image'), photoInsertValidation(), validate, insertPhoto) //"image" é o campo da requisição
//14.Cria rota de exclusão com metodo delete e id dinamico, espera usuário autenticado pelo authGuard e finaliza com deletePhoto
router.delete("/:id", authGuard, deletePhoto);
//15.Rota para usuário autenticado e a função para resgatar todas as fotos
router.get("/", authGuard, getAllPhotos);
//16. Rota dinamica por usuário, deve estar autenticado e a função para resgatar todas as fotos GetUserPhotos
router.get("/user/:id", authGuard, getUserPhotos);
//21. Rota que recebe a query e precisa ficar nesta posição para não ser confundida com outros ids abaixo. Não vai paramentro dinamico
router.get("/search", authGuard, searchPhotos);
//17. Rota por id abaixo da rota anterior, pois acima pode gerar erro de entendimento que o "user" na verdade é um "/id", neste caso a ordem importa pela arquitetura Express
router.get("/:id", authGuard, getPhotoById);
//18. Rota de Put de fotos de usuário autenticado e a função do middleware atualiznado título photoUpdateValidation
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
//19. Rota dinamica de Put para Like
router.put("/like/:id", authGuard, likePhoto);
//20. Rota dinamica Put para comentários com  atutenticação, validação de comentários e dados de erro para o fronto com validate
router.put("/comment/:id", authGuard, commentValidation(), validate, commentPhoto);

module.exports = router;