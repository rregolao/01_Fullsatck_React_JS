//Podemos endenter que a importação é o SCHEMA do banco de dados, pois o schema será colocado em um model e o model é um objeto que possue os métodos como inserior, deleter, ler, excluir... mas funciona basicamente com a regra do schema, como  esqueleto/desenho do módulo
const mongoose = require('mongoose');
//const { Profiler } = require('react');
const {Schema} =  mongoose;

//Instanciando a classe schema como novo objeto e argumentos sendo os campos da collection e os seus tipos
const userSchema = new Schema({
    //Dados básicos para autenticação
    name: String, //nome do usuário
    email: String, //email do usuário
    password: String, //senha do usuário
    profileImage: String, //imagem do usuário
    bio: String, //biografia do usuário
}, 
  { //Abre segundo objeto como configuração do módulo, como dois campos a serem criados, "createdAt" e "updatedAt", imprtante para sistema que depende de data para controle
    timestamps: true,
  }
);

//Definindo model e passando schema para compeltar os steps necessários do mongoose
const User = mongoose.model('User', userSchema );

//Cria usuário e exporta módulo de usuário para ser gerenciado pelo controller e ações com o banco de dados
module.exports = User;