import "./Auth.css"

//Componentes - 19. Link, Message para exibir mensagens de erro
import {Link} from "react-router-dom";
import Message from "../../components/Message";

//Hooks - 19. useEffect, useState, useSelector para pegar contextos e executar funções, useDispatch
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux - 22. login e reset,
import {login, reset} from "../../slices/authSlice"

const Login = () => {
  //19. Cria States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //22. inicializa Hooks e Redux com os estados que serão alterados
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state) => state.auth);
  
  const handleSubmit = (e) => {
    e.preventDefault();  

  //22. Cria objeto usuário com base nos States que acontecem pelos inputs antes de disparar o dispatch
  const user = {
    email,
    password,
  };

  //22. Dispatch com função de login passando usuário
  dispatch(login(user));
  };

  //22. Limpa todos os estados após login ser realizado
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
        <h2>ReactGram</h2>
        <p className="subtitle">Faça o login para ver o que há de novo.</p>
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="E-mail" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email || ''} 
            />
            <input 
                type="password" 
                placeholder="Senha" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password || ''} 
            />
        {/*22. Sntaxe para mensagem de erro de acordo com estados do slice, copia de Register.jsx e cola aqui */}
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled /> }
        {error && <Message msg={error} type="error" />}
        </form>
        <p>Não tem uma conta? <Link to="/register">Clique aqui</Link></p>
    </div>
  );
};

export default Login;