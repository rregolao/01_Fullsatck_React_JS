//26. Inicia importando api e requesConfig
import {api, requestConfig} from "../utils/config";

//26. Função Get user Detail, recebe dados do token
const profile = async(data, token) => {
    //26. Configura a requisição pelo requestConfig, método get e passando dados da requisição, passando o token para evitar o bloqueio
    const config = requestConfig("GET", data, token);

    try {
        //26. Pega a resposta fazendo um fetch para a API concatenando a rota e passando a config como argumento para a requisição. O then converte a resposa em um objeto javascript e o catch pega o erro da requisição e entrega o erro.
        const res = await fetch(api + "/users/profile", config)
            .then((res) => res.json())
            .catch((err) => err);

      //26. Retorna resposta
      return res;        

    } catch (error) {
        console.log(error);        
    }
};

//30. Update user details - Função assincrona para pegar dados(necessário para atualizar usuário pelas chaves) e token(precisa estar autenticado)
const updateProfile = async(data, token) => {
    //30. Configura o verbo da requisição, do tio PUT de atualização, dados para atualizar e token permite dizer que está autenticado, true para dizer que contém imagens
    const config = requestConfig("PUT", data, token, true);

    try {
        //30. Configura resposta, o then pega a resposta e converte em objeto JS pois td chega como texto, o catch pega o erro
        const res = await fetch(api + "/users/", config)
                    .then((res) => res.json())
                    .catch((err) => err);
      //30. Retorna resposta
      return res;
    } catch (error) {
        console.log(error);
    }
};

//33. Get user Details - Função passando o id
const getUserDetails = async (id) => {
    //33. Configura requisição passando parametro GET
    const config = requestConfig("GET");

    try {
        //33. Pega o usuário, converte em json retorna erro
        const res = await fetch(api + "/users/" + id, config)
                        .then((res) => res.json())
                        .catch((err) => err); 
        //33. Retorna resposta
        return res;
    } catch (error) {
        console.log(error);        
    }
};

//26. Cria objeto para exportar todas as funções
const userService = {
    profile,
    updateProfile,
    getUserDetails,
};

export default userService;