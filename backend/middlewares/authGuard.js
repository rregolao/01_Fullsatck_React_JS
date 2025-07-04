//6.Importa usuário e jwt para validar token
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

//6.função recebendo req, res e next
const authGuard = async (req, res, next) => {
    //6.Checa se a requisição tem autorização, pois se não tiver, não haverá token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Busca a segunda parte do header, há um espaço, na sintaxe: authHeader.split('')[1];

    //6.Checa se header tem um token
    if(!token) return res.status(401).json({errors: ['Acesso negado!']});

    //6.Checa se o token é valido com try catch, se cair no catch é inválido, o try valida a veracidade dos dados
    try {
        const verified = jwt.verify(token, jwtSecret);
        //6.pega o usuário pelo id da requisição para utilizar futuramente, o verified retorna em objeto todas as propiedades do token e o select não retorna com a senha
        req.user = await User.findById(verified.id).select("-password");
        next(); //prossegue com a requisição
        
    } catch (error) {
        res.status(401).json({errors: ['Token inválido.']});        
    }
};
//Conclusão deste middleware: valida se o token vem da requisição pela constante do "token", se não vier seta acesso negado, o try valida se o token combina com o secret e o req.uiser tenta achar o usuário,  portanto há 3 validações para barrar a tentativa de forjar o token, de alguma maneira, ou, tentan entrar em algum local impedido

module.exports = authGuard;