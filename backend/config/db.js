const mongoose = require('mongoose');
//Busca dbUser e dbPassword do .env, em PROD será dinamico e buscará usuários.
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

//Conexão chamando método do mongoose com a string de conexão criada no pelo criação do banco de dados do google mongoDb atlas
const conn = async () => {
    try {        
        const dbConn = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.id994lc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );
        console.log('Contectou ao banco!');
        //retorna conexão pois será utilizada em outro local
        return dbConn;
    } catch (error) {
        console.log(error);
    }
};
conn();
module.exports = conn;