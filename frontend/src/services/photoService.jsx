//39. Importa API e requestConfig
import {api, requestConfig} from '../utils/config';

//40. Publish an user photo, passando dados da foto e token
const publishPhoto = async(data, token) => {
    //40. Configura REquisição do método POSt, passa dados, token e como true no último argumento
    const config = requestConfig("POST", data, token, true)

    //40. TryCath para erros - Pegando resposta da requisição, convertendo texto em objeto JS
    try {
        const res = await fetch(api + "/photos", config)
            .then((res) => res.json())
            .catch((err) => err);
        
        //40. Retorna resposta
        return res;        
    } catch (error) {
        console.log(error);     
    }
};

//43. Get user Photos - Pega foto de id por usuário específico
const getUserPhotos = async(id, token) => {
    //43. Config de GET
    const config = requestConfig("GET", null, token); //Segue metodologia do "config.jsx" com dados nulos e token do bloco "else if"

    //43. TryCath para erros - Pegando resposta da requisição, passando id e config e convertendo texto em objeto JS
    try {
         const res = await fetch(api + "/photos/user/" + id, config)
            .then((res) => res.json())
            .catch((err) => err);       

         //43. Retorna resposta
         return res;  
    } catch (error) {
        console.log(error) ;
    }
};

//47. Delete a photo
const deletePhoto = async(id, token) => {
    //47. Configura request com método DELETE
    const config = requestConfig("DELETE", null, token);

    try {
        const res = await fetch(api + "/photos/" + id, config)
            .then((res) => res.json())
            .catch((err) => err); 

        //47. Retorna resposta
        return res;  
    } catch (error) {
        console.log(error);    
    }
};

//50. Update a photo
const updatePhoto = async(data, id, token) =>{
    const config = requestConfig("PUT", data, token);

    try {
        const res = await fetch(api + "/photos/" + id, config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};

//54. Get pgoto by id, como o parametro está na url não rpecisa passar no config
const getPhoto = async(id, token) => {
    const config = requestConfig("GET", null, token);

    try {
        const res = await fetch(api + "/photos/" + id, config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};

//58. Like a photo
const like = async(id, token) => {
    const config = requestConfig("PUT", null, token);

    try {
        const res = await fetch(api + "/photos/like/" + id, config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};

//62. Add comment to a photo
const comment = async(data, id, token) =>{
    const config = requestConfig("PUT", data, token);

    try {
        const res = await fetch(api + "/photos/comment/" + id, config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};

//65. Get all photos
const getPhotos = async(token) =>{
    const config = requestConfig("GET", null, token);

    try {
        const res = await fetch(api + "/photos", config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};

//71. Search photo by title
const searchPhotos = async(query, token) => {
    const config = requestConfig("GET", null, token);

    try {
        const res = await fetch(api + "/photos/search?q=" + query, config)
            .then((res) => res.json())
            .catch((err) => err); 

        return res;  
    } catch (error) {
        console.log(error);      
    }
};


const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto,
    getPhoto,
    like,
    comment,
    getPhotos,
    searchPhotos,
};

export default photoService;