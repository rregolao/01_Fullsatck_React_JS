//23. Inicia desenvolvimento
import "./EditProfile.css";

//28. Importa upload para gerenciar os diretórios de upload de imagem
import {uploads} from "../../utils/config";

//28. Hooks, React e Redux
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//28. Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

//28. Components
import Message from "../../components/Message";

const EditProfile = () => {
    //28. Pega os dados do usuário através do dispatch para executar as funções do redux
    const dispatch = useDispatch();

    //28. Pega os states do slice, passando user como argumento de onde pegar
    const {user, message, error, loading} = useSelector((state) => state.user);

    //28. States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setImageProfile] = useState("");
    const [bio, setBio] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    //28. Load user data, sempre será executado quando tiver um dispacth, sendo o dispath em profile
    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    //28. Fill form with user data - Pegar o user do useSelector e checa no if se o usuário veio, se verdairo preenche campos
    useEffect(() => {
        if(user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
        }
    },[user]);

    //23. Aplica função handlesubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        //32. Get uer data from states, pega os dados do objeto e adiciona em userData
        const userData = {
            name,
        };

        //32. Checa se tem imagem do perfil, igualando o profileImage no state, replica para bio e password
        if (profileImage) {
            userData.profileImage = profileImage;
        }

        if (bio) {
            userData.bio = bio;
        }

        if (password) {
            userData.password = password;
        };

        /*
        //SINTAXE ALTERNATIVA
        const formData = new FormData();
        Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
        dispatch(updateProfile(formData));
        */

        //SINTAXE ORIGINAL
        //32. Build form data, nãm tem formato para converter em JSON, portanto será instanciado um novo objeto de form data para adicionar tudo o que temos
        const formData = new FormData();
        //32. Para isso sera realizado um loop em todas as chaves que serão enviadas, o foreach pega a chave de cada item enviado para o loop. Será adicionado cada chave de todos os itens
        const userFormData = Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
        //32. Passando em um objeto chamado usuário, insere todos os dados do loop - foreach acima, o objeto fica bem mais completo
        formData.append("user", userFormData);
        //32. Faz o dispatch do objeto que precisa atualizar
        await dispatch(updateProfile(formData));

        //32. Retorna mensagem temporariao de sucesso pelo time out
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };

    //29. Trabalha com a imagem
    const handleFile = (e) => {
        //29. Armazena imagem em uma variável
        const image = e.target.files[0];

        //29. Aolica o set em image da variável
        setPreviewImage(image);

        //29. Atualiza estado da imagem
        setImageProfile(image);
    };

  return (
    <div id="edit-profile" >
        <h2>Edite seus dados</h2>
        <p className="subtitle">
            Adicione uma imagem de perfil e conta mais sobre você...
        </p>
        {/*29. Image preview */}
        {(user.profileImage || previewImage) && (
            <img 
             className="profile-image" 
             src={
                previewImage 
                ? URL.createObjectURL(previewImage) 
                : `${uploads}/users/${user.profileImage}`
             } 
             alt={user.name} 
            />
        )}
        <form onSubmit={handleSubmit}>
            {/*28. Formulário do profile */}
            <input 
                type="text" 
                placeholder="Nome" 
                onChange={(e) => setName(e.target.value)} 
                value={name || ""} 
            />
            <input 
                type="email" 
                placeholder="E-mail" 
                disabled value={email || ""} 
            />
            <label>
                <span>Imagem do Perfil:</span>
                <input type="file" onChange={handleFile} />
            </label>
            <label>
                <span>Bio:</span>
                <input 
                    type="text" 
                    placeholder="Descrição do perfil" 
                    onChange={(e) => setBio(e.target.value)} 
                    value={bio || ""}
                />
            </label>
            <label>
                <span>Quer alterar sua senha?</span>
                <input 
                    type="password" 
                    placeholder="Digite sua nova senha"  
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password || ""}
                />
            </label>
            {/*32. Bloco para atualizar o profile */}
            {!loading && <input type="submit" value="Atualizar" />}
            {loading && <input type="submit" value="Aguarde..." disabled /> }
            {error && <Message msg={error} type="error" />}
            {message && <Message msg={message} type="sucess" />}
        </form>
    </div>
  );
};

export default EditProfile;