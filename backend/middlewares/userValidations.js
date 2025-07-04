//2.Será itrabaldo com tudo que vem no corpo da requisição
const {body} = require("express-validator");

//2.Função para retornar erros do body
const userCreateValidation = () => {
    //2.Valida se o body name é uma string. Se o usuário não enviar dados podemos entender que não é uma string portanto já temos uma validação. Limita campo mínimo de 3 caracteres
    return [
        body('name')
        .isString()
        .withMessage('O nome é obrigatório!')
        .isLength({min: 3})
        .withMessage('O nome precisa ter no mínimo 3 caracteres.'),
    body('email') //Inicia validação do bloco e-mail
        .isString()
        .withMessage('O e-mail é obrigatório.')
        .isEmail()
        .withMessage('Insira um e-mail válido.'),
    body('password') //Inicia validação do bloco do body
        .isString()
        .withMessage('A senha é obrigatória.')
        .isLength({min: 5})
        .withMessage('A senha precisa ter no mínimo 5 caracteres.'),    
    body('confirmPassword') //Inicia validação do bloco de senha
        .isString()
        .withMessage('A confirmação de senha é obrigatória.')
        //Precisa confirmar a senha, trata como custom pois não há comandos nativos. Pega o valor do campo e inicia rodar uma função solicitando uma requisição
        .custom((value, {req}) => {
            if(value != req.body.password) {
                throw new Error('As senhas não são iguais.'); //Mensagem para erro de senha
            }
            return true; //Se anterior for falso 
        }),
    ];
};

//4.Função que retorna um array para avaliar se o usuário enviou email e senha. Finaliza validando login no UserController e em seguida rota no User_Router.jsx
const loginValidation = () => {
    return [
        body('email') //Retorna o body, no momento tem apenas email e senha
            .isString() //valida se é uma string
            .withMessage('O e-mail é obrigatório.') //Dado obrigatório
            .isEmail() //valida se é um email
            .withMessage('Insira um e-mail válido.'), //Dado obrigatório
        body('password') //Inicia validação do bloco do body
        .isString()
        .withMessage('A senha é obrigatória.')
     ]
}

//9.Função para atualilzar usuário
const userUpdateValidation = () => {
    return [
    body('name')
        .optional() //Nome opcional
        .isLength({min:3}) //No mínimo 3 caracteres
        .withMessage('O nome precisa pelo menos 3 caracteres.'), //validação anterior com mensagem
    body('password')
        .optional() //Nome opcional
        .isLength({min:5}) //No mínimo 3 caracteres 
        .withMessage('O nome precisa pelo menos 5 caracteres.'), //validação anterior com mensagem
    ];
};

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};

//Importar no userRoutes!