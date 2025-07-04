//14. Importando módulos react e react-redux para dados da STORE
import { useState, useEffect } from "react";
import {useSelector} from "react-redux";

//14. Exporta função hook
export const useAuth = () => {
    //14. Pega o usuário de useSelector do state sendo o stateauth. O user é extraido do register.jsx
    const {user} = useSelector((state) => state.auth);
    //14. Estabelece State, a aplicação não retornará dados antes de ter confirmação se o usuário esta logado
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    //14.Pelo state, ativa userEffect sempre que o usuário mudar do STATE do redux(useSelector). Essa função será geral para todas as etapas que necessitam de validação para confirmar se o usuário está logado, por isso o tratamento será unico mas a cada etapa haverá validação piscando a tela para definir quais componentes exibir.
    useEffect(() => {
        //Validação verdadeiro e falso para autenticação
        if(user) {
            setAuth(true);
        } else {
            setAuth(false);
        }

        setLoading(false);

    }, [user]);
    return {auth, loading};
};