//8. Inicia exportando url da api
export const api = "http://localhost:5000/api";
//8. URL do upload para exportar imagens, exporta url para não inserir em todos locais
export const uploads = "http://localhost:5000/uploads";

//8. Função para exportar urls, passando método da requisição, dados que serão enviados, token para requisições autenticadas e não autenticadas, inicia como null para usuário não autenticado, imagem com valor nulo, ambas nulo serão configuradas na etapa abaixo
export const requestConfig = (method, data, token = null, image = null) => {    
    //Variável sem valor inicial, será criado conforme condição if/else abaixo
    let config;

    //Se tiver uma imagem, o config será formado por um objeto que terá o método que será enviado como argumento, terá o body com dados, headers como obrigatórios mas em objetos vazios
    if(image) {
        config = {
            method,
            body: data,
            headers: {},
        };

        //Verifica se o método é um delete ou não tem dados, o like não terá dados, por isso pega apenas método que no servidor resolve a função sozinha, o body não vai
    } else if(method === "DELETE" || data === null) {
        config = {
            method,
            headers: {},
        };

        //Quando há dados por inserção, o método é o que virá da requisição, body com requisição montando em formato de DATA, diferente dos anteriores de imagem e por ser JSON, configura os headers dentro o objeto
    } else {
        config = {
            method,
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json",},
        };
    }

    //Confirme se recebeu o token, passa os dados do authorization e bearer conforme configurado na aba REACTGRAM no Postman
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    //Objeto de configuração da requisição
    return config;
};