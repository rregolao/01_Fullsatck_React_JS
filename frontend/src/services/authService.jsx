//9. Importa módulos do bloco 8
import { data } from "react-router-dom";
import {api, requestConfig} from "../utils/config";

//9.Função HTTP - Registrar usuário
const register = async(data) => {
    //9. Passa a função de "config.jsx" e por ser cadastro de usuário será um POST dados da própria requisição, portando a request está formada com esses dois argumentos
    const config = requestConfig("POST", data);

    //9. Avalia erro da requisição
    try {
        //9. Resposta de um await fetch com a url api + url correta da função de registro de usuário e fecha mandando a configuração. Do then para frente é o recebuimento de dados convertidos em objeto javascript, finaliza com catch para retornar erro especificamente ao catch da requisição
        const res = fetch(api + "/users/register", config)
            .then((res) => res.json())
            .catch((err) => err);
           
        //9. Se receber resposta, haverá um usuário e este usuário terá o id e token. Salvar esses dados na localStorage para extrair e avaliar se o usuário esta logado   
        if(res) {
            localStorage.setItem("user", JSON.stringify(res)); //O dado é chamado de "user" e converte em string a resposta
        }

        return res;
    } catch (error) {
        console.log(error);
    }
};

//17. Logout do usuário por função
const logout = () => {
    //Remove o usuário do local Storage
    localStorage.removeItem("user");
};

//20. Sign in um usuário recebendo dados "data"
const login = async(data) => {
    //20. Configura request para o tip POST e enviar dados para o servidor
    const config = requestConfig("POST", data);

    try {
        //20. Espera resposta da requisição de fetch para a url API + rota e finaliza com a configuração anterior
        const res = await fetch(api + "/users/login", config)
        //20. Pega os dados da requisição
        .then((res) => res.json())
        .catch((err) => err);

        //20. Checa se a resposta veio com sucesso e nesta sintaxe armazena na local storage, apenas se veio id, caso contrário, não salva
        if(res._id) {
            localStorage.setItem("user", JSON.stringify(res));
        }

        //20. Retorna resposta
        return res;
    } catch (error) {
        console.log(error);        
    }
};

//9. Cria objeto para inserir as funções e exporta-lo apenas uma vez. 17. logout, 20.. Login,
const authService = {
    register,
    logout,
    login,
};

export default authService;

//Conclusão: todo o SERVICE do projeto terá requisições, terá os dados necessários para fornecer para o backend e acessar os end-points da api. Falta apenas aplicar os estados de cada etapa de processamento de dados que está em SLICES