import "./Search.css";

//69.  hooks, 70. useQuery
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { useQuery } from "../../hooks/useQuery";

//69. components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

//73. Redux
import { searchPhotos, like } from "../../slices/photoSlice";


const Search = () => {
    //73. Importa o hook query para executa-lo e pega o que vem da busca com o search pelo "get q"
    const query = useQuery();
    const search = query.get("q");
    const dispatch = useDispatch();
    const resetMessage = useResetComponentMessage(dispatch);

    //73. Pega usuário logado e fotos do Reducer
    const {user} = useSelector(state => state.auth)
    const {photos, loading} = useSelector(state => state.photo)

    //73. Load photos - Carrega fotos baseado na busca, depende do dispatch e da variável search
    useEffect(() => {
        //73. Efetua a busca das fotos
        dispatch(searchPhotos(search));
    }, [dispatch, search]);

  //73 Copia Like a photo de "home.jsx"
  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  if(loading) {
    return <p>Carregando...</p>
  };

  return (
    <div id="search">
        <h2>Você está buscando por: {search}</h2>
        {photos && 
         photos.map((photo) => (
            <div key={photo._id}>
                <PhotoItem photo={photo} />
                <LikeContainer photo={photo} user={user} handleLike={handleLike} />
                <Link className="btn" to={`/photos/${photo._id}`}>
                    Ver mais
                </Link>
            </div>
        ))}
        {photos && photos.length === 0 && (
            <h2 className="no-photos"> 
                Não foi encontrado resultado para sua busca...
            </h2>
        )}
    </div>
  );
};

export default Search;