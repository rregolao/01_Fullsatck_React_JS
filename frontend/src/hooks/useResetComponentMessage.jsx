//61. Redux
import { resetMessage } from "../slices/photoSlice";

//61. Sempre receberá o dispatch quando estiver utilizando o hook pois ele retornará algo que utiliza o dispatch, 
export const useResetComponentMessage = (dispatch) => {
    return () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };
};