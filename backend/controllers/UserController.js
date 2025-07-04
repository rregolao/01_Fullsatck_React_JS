const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {mongoose} = require('mongoose');

const jwtSecret = process.env.JWT_SECRET;

//Função gera token - Espera por um "id" do usuário
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: '7d',
    }); 
};

//Função registro do usuário e login
const register = async ( req, res ) => {
    //3.Pega dados do body
    const {name, email, password} = req.body;

    //3.Checa se usuário eestá cadastrado no sistema com método do Mongo findOne filtrando por email
    const user = await User.findOne({email});

    //3.Condicional para erro
    if(user) {
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]});
        return
    }

    //3.Gerar password hash pela bcrypt
    const salt = await bcrypt.genSalt(); // Gera string aleatória
    const passwordHash = await bcrypt.hash(password, salt); // Finaliza concatenação de senha quebrado para o banco

    //3.Cria usuário
    const newUser = await User.create({
        name,
        email,
        password: passwordHash, //Cria no banco de dados a senha concatenada e quebrada
    });

    //3.Se o usuário foi criado com sucesso, retorna o token
    if(!newUser) { //Condição de erro do sistema
        res.status(422).json({errors: ['Houve um erro, por favor tente mais tarde.'],});
        return;
    }

    //3.Status de sucesso para criação, manda id do usuário para futuramente utilizar no front-end
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    });
};
//CONCLUSÃO BLOCO: Checa se o usuário já existe no sistema pelo primeiro "if", cria uma senha na biblioteca de bcript para o usuário, cria usuário no sistema, checa se teve problema na criação e com o sucesso, envia o token para o usuário efetuar o login

//4.Login do usuário para finalizar a rota em User_Router.jsx 5.-Completa o login
const login = async (req, res) => {
    //5.Recebe dados do body
    const {email, password} = req.body;

    //5.Checa se usuário existe com método do mongoBD filtrando por email
    const user = await User.findOne({email});
    //5.Condição para não existir com erro 404
    if(!user) {
        res.status(404).json({errors: ['Usuário não encontrado.']});
        return;
    }

    //5.Checa se o password está correto, neste ponto já foi resgado o usuário, portanto, já temos a senha dele
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ['Senha inválida.']});
        return;
    }  
    //5.Se não tiver erros, retorna usuário e token
    res.status(200).json({
        _id: user._id, 
        profileImage: user.profileImage, //retorna imagem
        token: generateToken(user._id),
    });
};

//7.Função para pegar usuário loggado, foi adicinado o usuário a requisição no middleware de authGuard e será aproveitado
const getCurrentUser = async(req, res) => {
    const user = req.user
    //7.Responde no JSON com status do usuário na condição sem senha
    res.status(200).json(user);
};

//9.Função update
const update = async (req, res) => {
    //10.Pega dados do body
    const {name, password, bio} = req.body
    //10.Inicia variável com profile image como null
    let profileImage = null
    //10.Checa se chegou propiedade de arquivo da requisição, se chegou iguala ao filename declarado no imageUpload
    if(req.file) {
        profileImage = req.file.filename;
    }
    //10.Pega usuário da requisição
    const reqUser = req.user;
    //10.O id do mongoDB e uma string longa, precisa converter epelo mongoose e retirar a senha
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password");
    //const user = await User.findById(reqUser._id).select("-password"); //ATENÇÃO: Problemas recorrentes de sintexes do MongoDB pelo operador "NEW" acima, a linha de código abaixo é simplificada evitando a menssagem DEPRECATED mas também funciona.
   
    //10. Confirma se o nome chegou, se verdadeiro confirma que o novo nome é o que veio da requisição
    if(name) {
        user.name = name;
    }
    //10. Se o password chegou, atualiza a senha do usuário com gerador de senha hash
    if(password) {
        const salt = await bcrypt.genSalt(); // Gera string aleatória
        const passwordHash = await bcrypt.hash(password, salt); // Finaliza concatenação de senha quebrado para o banco
        //A senha é gravada pela criptografia, mesma forma da criação de usuário
        user.password = passwordHash;
    }
    //10. Checa se veio profileImage
    if(profileImage) {
        user.profileImage = profileImage;
    }
    //10. Checa se veio a bio
    if(bio) {
        user.bio = bio;
    }
    //10. Finaliza salvando dados no banco do mongoDb
    await user.save();

    //10. Com o sucesso, retorna o usuário
    res.status(200).json(user);
};

//11. Get/Regastar usuário por id, por ser um get extrai o id da URL
const getUserById = async(req, res) => {
    //Passa o dado da URL para efetuar a desestruturação e pegar o valor que necessitamos, o ID
    const {id} = req.params;
    //Encontra usuário por id sem o password e o trycatch trata erro na tentativa de encontar o usuário, se não conseguir é pq o id está inválido
    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password");
        //SINTAXES ALTERNATIVAS MONGODB
        //User.findById(mongoose.Types.ObjectId.createFromHexString(id)).select("-password");

        //COM MÉTODO
        //if (!(mongoose.Types.ObjectId.isValid(id))) {
        //    res.status(400).json({errors: [`Invalid provided id ${id}.`]});
        //    return;
        //  }

        //Checa se usuário existe, Se não existir envia erro com mensagem
        if(!user) { 
        res.status(404).json({errors: ['Usuário não encontrado.']});
        return;
    }
        //Sucesso, envia usuário
        res.status(200).json(user); 
    } catch (error) {
        res.status(404).json({errors: ['Usuário não encontrado.']});
        return;
    }
};

//Disponibiliza função para as rotas em modo de objeto para poder selacionar uma a uma
module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
};