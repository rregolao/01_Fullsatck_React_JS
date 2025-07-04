import "./LikeContainer.css";

//60. Importa icones
import {BsHeart, BsHeartFill} from "react-icons/bs";

//60. Props - Verifica se todos os dados vieram, se verdadeiro, exibe
const LikeContainer = ({photo, user, handleLike}) => {
  return (
    <div className="like">
        {/*60. Checa se veio os dados e likes e user para exibir algo, a condição está se tem like ou se terá pelo "):("  e o like inclui no array, se o like existir o BsHeartFill exige o like, caso contrário, vazio pelo BsHeart, o onCLick executa a função enviada com props */}
        {photo.likes && user && (
          <>
             {photo.likes.includes(user._id) ? (
                 <BsHeartFill />
             ) : (
                 <BsHeart onClick={() => handleLike(photo)} />
             )}
             {/*60. Contagem de likes */}
             <p>{photo.likes.length} like(s)</p>
          </>
        )}
    </div>
  );
};

export default LikeContainer;