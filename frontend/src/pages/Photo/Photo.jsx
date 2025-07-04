//53. Inicia bloco Photo
import "./Photo.css";

//53. Importa upload do arquivo de configuração
import {uploads} from "../../utils/config"

//53. Components, 56. photoItem, 
import Message from "../../components/Message";
import {Link} from "react-router-dom";
import PhotoItem from "../../components/PhotoItem";

//53. Hooks, 61. useResetMessage, 
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//56. Redux, 60. like, 64. comment,
import {getPhoto, like, comment} from "../../slices/photoSlice";
import LikeContainer from "../../components/LikeContainer";

const Photo = () => {
    //56. Variáveis
    const {id} = useParams();

    //56. Variáveis
    const dispatch = useDispatch();

    //61. Variável com hook e dispatch do Redux
    const resetMessage = useResetComponentMessage(dispatch);

    //56. Variáveis
    const {user} = useSelector((state) => state.auth)
    const {photo, loading, error, message} = useSelector((state) => state.photo)

    //64. Comentários com state
    const [commentText, setCommentText] = useState("");

    //56. Load photo date
    useEffect(() => {
        dispatch(getPhoto(id));
    }, [dispatch, id]);

    //60. Insert a Like e comentário, executa o like passando o id a foto 
    const handleLike = () => {
        dispatch(like(photo._id));

        //61. Chama função do hook
        resetMessage();
    };

    //64. Inseert a comment - Função de execução do comentário
    const handleComment = (e) => {
        e.preventDefault();

        const commentData = {
            comment: commentText,
            id: photo._id,
        }

        dispatch(comment(commentData));

        setCommentText("");

        resetMessage();
    };

    if(loading) {
        return <p>Carregando...</p>
    }

  return (
    <div id="photo">
        <PhotoItem photo={photo} />
        <LikeContainer photo={photo} user={user} handleLike={handleLike} />
        {/*61. Tipos de mensagem */}
        <div className="message-container">
            {error && <Message msg={error} type="error" />}
            {message && <Message msg={message} type="success" />}
        </div>
        {/*64. Bloco de comentários, no h3 conta a quantidade de comentários,  */}
        <div className="comments">
            {photo.comments && (
                <>
                 <h3>Comentários: ({photo.comments.length}) </h3>
                 <form onSubmit={handleComment}>
                 <input 
                    type="text"
                    placeholder="Insira o seu comentário..."
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText || ""}
                />
                 <input type="submit" value="Enviar" />
                 </form>
             {/*64. Se não tiver comentário */}
             {photo.comments.length === 0  && <p>Não há comentários...</p>}
             {photo.comments.map((comment) => (
                <div className="comment" key={comment.comment}>
                    <div className="author">
                        {comment.userImage && (
                            <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                        )}
                        <Link to={`/users/${comment.userId}`}>
                            <p>{comment.userName}</p>
                        </Link>
                    </div>
                    <p>{comment.comment}</p>
                </div>
            ))}
         </>
            )}
        </div>
    </div>
  );
};

export default Photo;