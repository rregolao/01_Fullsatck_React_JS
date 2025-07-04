import "./Profile.css";

//33. Inicia arquivo, importa uploads para ter a url das imagens hospedadas
import { uploads } from "../../utils/config";

//33. Componentes - Message, Link para acesso a fotos e Icones na ordem vizualizar, editar e deletar
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg} from "react-icons/bs";

//33. Hooks - Selector e Dispatch para o Redux
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

//36. Redux Slice - 36. getUserDetails, 42. publishPhoto, 45. getUserPhotos, 49. deletePhoto, 52. updatePhoto,
import {getUserDetails} from "../../slices/userSlice";
import {publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto} from "../../slices/photoSlice";

const Profile = () => {
    //36. Pega o id
    const {id} = useParams();
    //36. Chama o hook do redux para funções com chamada de dados
    const dispatch = useDispatch();
    //36. Aplica dois estados para o usuário e replica o mesmo para usuário atenticado
    const {user, loading} = useSelector((state) => state.user);
    const {user: userAuth} = useSelector((state) => state.auth);
    //42. Aplica estados para foto
    const {photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto} = useSelector((state) => state.photo);
    //42. Aplica estados para o título da foto
    const  [title, setTitle] = useState("");
    const  [image, setImage] = useState("");

    //52. States específicos para edição
    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editTitle, setEditTitle] = useState("");

    //38. New form and edit form ref - Acesso ao formulário através do hook de referencias através do REACT
    const newPhotoForm = useRef();
    const editPhotoForm = useRef();

    //36. Load user data, o userEffect é disparado com o dispatch e o id do usuário. Com esse sucesso ele faz um dispatch em getUserDetails passando o id
    //45. Adiciona "getUserPhotos"
    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id)); //Com esse id preenchido, preenche o "user" da  variável "const {user, loading} = useSel..." e para exibi-lo, trabalha o html abaixo
    }, [dispatch, id]);


    //49. Função Resetar Componente
    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };

    //38. Função para postar foto
    const submitHandle = (e) => {
        e.preventDefault();

        //42.Cria objeto de foto
        const photoData = {
            title,
            image,
        };

        //42. Build form data - Trata a foto
        const formData = new FormData();
        //42. Variável para fazer loop em todas as chaves do objeto "photoData", com o "forEach" para cada chave, na função aplica o append parar criar o formData
        const photoFormData = Object.keys(photoData).forEach((key) => 
            formData.append(key, photoData[key]));
        //42. Com o form data criado, adiciona a foto pelo append
        formData.append("photo", photoFormData);
        //42. Dispatch em publisFjoto enviando os dados "formData"
        dispatch(publishPhoto(formData));
        //42. Reset no title
        setTitle("");

        //49. Invoca função
        resetComponentMessage();

    };

    //42. Copia função de "EditProflile"
    const handleFile = (e) => {
        //42. Armazena imagem em uma variável
        const image = e.target.files[0];
        //Aolica o set em image da variável
        setImage(image);
    };

    //49. Delete a photo
    const handleDelete = (id) => {
        dispatch(deletePhoto(id));
        resetComponentMessage();
    };

    //52. Show or hide forms -Exibe ou enconde de acordo com a classe
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle("hide");
        editPhotoForm.current.classList.toggle("hide");
    };

    //52. Update a photo
    const handleUpdate = (e) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            id: editId,
        };

        dispatch(updatePhoto(photoData));

        resetComponentMessage();
    };

    //52. Open edif form
    const handleEdit = (photo) => {
        if(editPhotoForm.current.classList.contains("hide")) {
            hideOrShowForms();
        }

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditImage(photo.image);
    };

    //52. Opção para cancelar edição 
    const handleCancelEdit = () => {
        hideOrShowForms();
    };

    //36. State de loading, se tiver demontra o status de carregando
    if(loading) {
        return <p>Carregando...</p>
    };

  return (
    <div id="profile">
        <div className="profile-header">
            {/*36. Se tiver a imagem pode exibir no caminho abaixo, nome e bio */}
            {user.profileImage && (
                <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
            )}
            <div className="profile-description">
                <h2>{user.name}</h2>
                <p>{user.bio}</p>
            </div>
        </div>  
        {/*38. Compara ids do Reducer, se sim segue desenvolvimento */}
        {id === userAuth._id && (
            <>
             <div className="new-photo" ref={newPhotoForm}>
                <h3>Compartilhe algum momento seu:</h3>
                <form onSubmit={submitHandle}>
                    <label>
                        <span>Título para a foto:</span>
                        <input 
                         type="text" 
                         placeholder="Insira um título" 
                         onChange={(e) => setTitle(e.target.value)}
                         value={title || ""}                         
                        />
                    </label>
                    <label>
                        <span>Imagem:</span>
                        {/*42 Aplica função com onChange */}
                        <input type="file" onChange={handleFile} />
                    </label>
                    {/*42. Loading*/}
                    {!loadingPhoto && <input type="submit" value="Postar" />}
                    {loadingPhoto && (
                        <input type="submit" disabled value="Aguarde..." />
                    )}
                </form>
             </div>  
             {/*52. Formulário de edição, classe escondida para clique de edição apenas */}
             <div className="edit-photo hide" ref={editPhotoForm}>
                <p>Editando:</p>
                {editImage && (
                    <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                )}
                <form onSubmit={handleUpdate}>
                        <input 
                         type="text" 
                         onChange={(e) => setEditTitle(e.target.value)}
                         value={editTitle || ""}                         
                        />
                        <input type="submit" value="Atualizar" />
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                            Cancelar edição
                        </button>
                </form>
            </div>  
             {/*42. Mensagem*/}
             {errorPhoto && <Message msg={errorPhoto} type="error" />}
             {messagePhoto && <Message msg={messagePhoto} type="success" />}
            </>
        )}
        {/*45. Exibir foto */}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {photos && 
                  photos.map((photo) => (
                    <div className="photo" key={photo._id}>
                      {photo.image && (
                        <img 
                          src={`${uploads}/photos/${photo.image}`} 
                          alt={photo.title} 
                        />
                        )}
                        {id === userAuth._id ? (
                            <div className="actions">
                                {/*49. Excluir */}
                                <Link to={`/photos/${photo._id}`}>
                                  <BsFillEyeFill />
                                </Link>
                                 <BsPencilFill onClick={() => handleEdit(photo)} />
                                 <BsXLg onClick={() => handleDelete(photo._id)} />
                            </div>
                        ) : (
                        <Link className="btn" to={`/photos/${photo._id}`}>
                            Ver
                        </Link>
                    )}
                    </div>
                ))}
                {photos.length === 0 && <p>Ainda não há fotos publicadas...</p>}
            </div>
        </div>
    </div>
  );
};

export default Profile;