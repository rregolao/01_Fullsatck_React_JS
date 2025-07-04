const {body} = require('express-validator');

//12-Função retornando condições
const photoInsertValidation = () => {
    return [
        body('title')
        .not()
        .equals('undefined') // caso o usuário poste um dado no formato diferente de JSON, como form Data, o servidor converterá o valor undefined para uma string undefined
        .withMessage('O título é obrigatório.')
        .isString()
        .withMessage('O título é obrigatório.')
        .isLength({min: 3}) //Caracteres mínimos
        .withMessage('O título precisa ter no mínimo 3 caracteres.'),
        body('image').custom((value, {req}) => {//custom validator para imagem, recebe valor e requisção
          //Se não tem arquivo, não veio a imagem, cai em nova mensagem de erro
          if(!req.file) {
            throw new Error('A imagem é obrigatória.');
          }
          return true;
        }),
    ];
};

//18.Função para atualiar titulo da foto
const photoUpdateValidation = () => {
  return [
    body('title')
    .isString()
    .withMessage('O título é obrigatório.')
    .isLength({min: 3}) //Caracteres mínimos
    .withMessage('O título precisa ter no mínimo 3 caracteres.'),
  ];
};

//20. Validação de comentário fazend com que seja uma string e obrigatório
const commentValidation = () => {
  return [
    body('comment')
    .isString()
    .withMessage('O comentário é obrigatório.'),
  ];
};

module.exports = {
    photoInsertValidation,
    photoUpdateValidation,
    commentValidation,
};