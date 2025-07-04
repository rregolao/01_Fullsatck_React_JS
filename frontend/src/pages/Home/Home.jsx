import "./Home.css"

//67. Components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

//67. Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//67. Redux
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {

  //67. Invoca componentes importados
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  //67. Invoca componentes importados, pega o usuário do redux autenticado com o useSelector
  const {user} = useSelector((state) => state.auth)
  const {photos, loading} = useSelector((state) => state.photo)

  //67. Load all photos - Requisição para trazer todas as fotos
  useEffect(() => {
    dispatch(getPhotos())
  }, [dispatch])

  //67. Like a photo
  const handleLike = (photo) => {
    //67. Dispatch de likes passando id
    dispatch(like(photo._id));
    //67. Limpa a mensagem dos likes
    resetMessage();
  };

  //67. Mensagem para loading
  if(loading) {
    return <p>Carregando...</p>
  };


  return (
    /*68. Checa se as fotos existem e com o map chama as fotos individualmente como foto. O retorno será em JSX com uma div dentro */
    <div id="home">
        {photos && photos.map((photo) => (
            <div key={photo._id}>
                <PhotoItem photo={photo} />
                <LikeContainer photo={photo} user={user} handleLike={handleLike} />
                <Link className="btn" to={`/photos/${photo._id}`}>
                    Ver mais
                </Link>
            </div>))}
        {/*68. Fotos vazias */}
        {photos && photos.length === 0&& (
            <h2 className="no-photos"> 
                Ainda não há fotos publicadas, {" "} 
                <Link to={`/users/${user._id}`}>clique aqui</Link>
            </h2>
        )}
    </div>
  );
};

export default Home;