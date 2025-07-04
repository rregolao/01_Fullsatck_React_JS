//8.Multer gerencia upload de arquivos
const multer = require('multer');
//8.Patch gerencia caminhos e diretórios da aplicação referente a parte do Nodejs
const path = require('path');

//8.Função para definir o destino armazenamento da imagem
const imagemStorage = multer.diskStorage({
    //8.chamda de outra função que recebe requisição, arquivo e callback
    destination: (req, file, cb) => {
        //8.variável para pasta vazia
        let folder = "";

        //8.Se a url da imagem que está sendo inserida inclui user
        if(req.baseUrl.includes('users')) {
            //8.Então a pasta será igual a user
            folder = 'users'
            //8.Se não, incluir photos, insere na base de photos
        } else if(req.baseUrl.includes('photos')) { //Poderia para o else direto, o else if permite adições condicionais futuras
            folder = 'photos'
        }
        //8.call back, pasta para salvar imagens é uploads e a variável no final, define o caminho da imagem, no caso uploads do projeto.
        cb(null, `uploads/${folder}/`)
    },
    //Função para tratar o nome do arquivo definitivo
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//8.Função que validaçãom da imagem e onde será salva
const imageUpload = multer({
    storage: imagemStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|PNG|JPG)$/)) { //SINTAXE OPCIONAL com "i" pega variações:  .match(/.(png|jpg)$/i)
        //atualiza apenas formatos png e jpg
        return cb(new Error('Por favor, envie apenas uma png ou jpg!'));
        }
        //Se não caiu no if faz com que o códugo seja continuado pela cb
        cb(undefined, true);
    },
});

module.exports = {imageUpload};