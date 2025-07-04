//13.Chama módulo de foto e mongoose para operações no banco de dados
const Photo = require('../models/Photo');
const mongoose = require('mongoose');
const User = require('../models/User');

//13.Função de foto, inserir foto com usuário relacionado a ela
const insertPhoto = async(req, res) => {
    //13. O que chega da requisição é apenas o body, portanto pegaremos ele
    const {title} = req.body;
    const image = req.file.filename;

    //13. Busca e pega o usuário pelo id da requisição
    const reqUser = req.user
    const user = await User.findById(reqUser._id);

    //13. Cria foto
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    //13. Se a foto foi criada com sucesso, retornar dados de erro 422 e sucesso 201
    if(!newPhoto) {
        res.status(422).json({
            errors: ['Houve um problema, por favor tente novamente mais tarde.'],
        });
        return; //Caso tenha erro, retorna para evitar continuação da função
    }
    //13. Se tiver sucesso
    res.status(201).json(newPhoto);
};

//14. Função para excluir a foto do banco de dados
const deletePhoto = async(req, res) => {
    //14. Pega o id da url com req.params
    const {id} = req.params;
    //14. Pega o usuário pela requisição
    const reqUser = req.user;

    try {
    //14. Pega a foto no Model 
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

    //14. Checa se a foto existe, incia se não existir com erro 404
    if(!photo) {
        res.status(404).json({errors: ['Foto não encontrada.']});
        return; //Caso tenha erro, retorna para evitar continuação da função
    }
    //14. Verificar se a foto pertence ao usuário com método "equals" do mongoose, se não pertencer retorna erro 422
    if(!photo.userId.equals(reqUser._id)) {
        res.status(422).json({errors: ['Ocorreu um erro, por favor, tente novamente mais tarde.']});
    }
    //14. Passando dessa validação, podemos excluir com método mongoose
    await Photo.findByIdAndDelete(photo._id);
    //14. Retorna sucesso com status 200 pelo id e mensagem de sucesso
    res.status(200).json({id: photo._id, message: 'Foto excluída com sucesso.'});
    } catch (error) {
      res.status(404).json({errors: ['Foto não encontrada.']});
      return; //Caso tenha erro, retorna para evitar continuação da função
    }
};

//15. Pegando todas as fotos com métido de filtro vazio ".find({})" para pegar todas com outro método "sort" para ordenar pelos criados e o "-1" pega a partir dos mais novos para exibir smepre no topo dos posts, feche com método de execução da query ".exec()"
 const getAllPhotos =async(req, res) => {
    const photos = await Photo.find({})
        .sort([['createdAt', -1]])
        .exec();
    //Retorno com sucesso para carregar as fotos
    return res.status(200).json(photos);
};

//16. Pegar as fotos do usuário, o usuário pode acessar fotos de outros, por isso a busca é por ID da URL e não da requisição
const getUserPhotos = async(req, res) => {
    const {id} = req.params;
    const photos = await Photo.find({userId: id}) //Na foto o id do usuário está como userid e o _id é o id da própria foto
        //16. Ordenar e executar
        .sort([['createdAt', -1]])
        .exec();
    //16. Retornar com sucesso status 200 no JSON
    return res.status(200).json(photos);

};

//17. Resgatando foto por id que virá pela url, pelo 'params' busca a foto que foi recebida pela url. Mantém um padrão de buscar foto pela url analisando os params e se não encontrar retorna erro 404 com return para evitar lock/loop e finaliza com status 200 para o sucesso
const getPhotoById = async(req, res) => {
    const {id} = req.params
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    //17. Checa se a foto existe e se não exitir retona erro 404
    if(!photo) {
        res.status(404).json({erros: ['Foto não encontrada.']});
        return
    }
    //17. Envia a foto para o json pelo sucesso
    res.status(200).json(photo);
};

//18. Update/Atualizar a foto por id que virá pela url, pelo 'params' busca a foto que foi recebida pela url.
const updatePhoto = async(req, res) => {
    const {id} = req.params;
    const {title} = req.body; //Somente o título pode ser alterado
    //18. Pega o usuário da requição
    const reqUser = req.user;
    //18. Pega a foto
    const photo = await Photo.findById(id); //Sintaxe alternativa: .findById({ _id: id});
    //18. Checa se a foto existe e se não exitir retona erro 404
    if(!photo) {
        res.status(404).json({errors: ['Foto não encontrada.']});
        return;
    }
    //18. Chega se a foto pertence ao usuário da requisição, caso negativo cai no erro 422
    if(!photo.userId.equals(reqUser._id)) {
        res.status(422).json({errors: ['Ocorreu um erro, por favor, tente novamente mais tarde.']});
        return;
    }
    //18.Verifica se o título veio e salva a foto com status de sucesso 200 enviando json
    if(title) {
        photo.title = title;
    }
    await photo.save();
    res.status(200).json({photo, message: 'Foto atualizada com sucesso!'});
};

//19.Like em foto, pega o id da foto pela url e usuário da foto que deu o like, procura a foto pelo id
const likePhoto = async(req, res) => {
    const {id} = req.params;
    const reqUser = req.user;
    const photo = await Photo.findById(id);
    
    //19. Checa se a foto existe e se não exitir retona erro 404
    if(!photo) {
        res.status(404).json({errors: ['Foto não encontrada.']});
        return;
    }
    
    //19. Checa se o usuário já deu like na foto, checa o array e analisa se nele estáo o usuário
    if(photo.likes.includes(reqUser._id)) {
        res.status(422).json({errors: ['Você já curtiu esta foto.']});
        return;
    }

    //19. Se a foto exite e não teve like, insere o id do usuário em um array
    photo.likes.push(reqUser._id);
    await photo.save(); //atualizando a foto se fosse um update

    //19. Sucesso com mensagem de retorno com id o usuário que curtiu a foto e mensagem
    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida"});
};

//20. Fucionalidade de Comentários, pega o id da foto pela url e comentário do body pela requisição, armazena usuário
const commentPhoto = async(req, res) => {    
    const {id} = req.params;
    const {comment} = req.body;
    const reqUser = req.user;
    //Encontra usuário e foto por id
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);
    //20. Checa se a foto existe e se não exitir retona erro 404
    if(!photo) {
        res.status(404).json({errors: ['Foto não encontrada.']});
        return;
    }
    //20. Aloca comentários em um array. Primeiro cria variável para inserir comentários em um objeto com os dados necessários para a interface
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    };
    //20. Segundo, insere comentário do usuário em um array para inserir na foto
    photo.comments.push(userComment);
    
    //20. Salva operação
    await photo.save();

    //20. Retorna sucesso
    res.status(200).json({
        comment: userComment,
        message: 'O comentário foi adicionado com sucesso.'
    });
};

//21. Busca fotos por título
const searchPhotos = async(req, res) => {
    //21. Espera por um argumento "a" da query string da url, não vem como parametro, faz parte da url
    const {q} = req.query;
    //21. Array de fotos procurando onde o título contenha (utiliza expressão regular RegExp) "q" em qualquer lugar da String e o "i" igonora case sensitive
    const photos = await Photo.find({title: new RegExp(q, 'i')}).exec();
    //21. resultado de sucesso mensagem 200 e json com a foto
    res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
};