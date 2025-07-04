const {validationResult} = require("express-validator");

//1.Por ser u m middleware cria req, res e next
const validate = (req, res, next) => {
    const errors = validationResult(req);

    //1.Se não tiver erro, segue
    if(errors.isEmpty()) {
        return next();
    };
    //1.Se não estiver vazio tem erro, portanto, extrai erros da requisição
    const extractedErros = [];

    //1.Armazena erros em um array, faz um map para cada erro nomeando de "err" e armazenada cada um no extratedErros, envia para o front end
    errors.array().map((err) => extractedErros.push(err.msg));
    //1.retorna erro da requisição em status 422 que a requisição não foi bem sucedida por algum motivo, resposta em JSON
    return res.status(422).json({
        errors: extractedErros //envia para o front end consultar todos os erros
    });
};

module.exports = validate;

//Aplicar esse bloco nas rotas!