import "./Auth.css";

//3. Componentes. 13. Message
import { Link } from "react-router-dom";
import Message from "../../components/Message";

//3. Hooks, 11.useSelector e useDispatch,
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//11. Redux - Importa métodos
import {register, reset} from "../../slices/authSlice";

const Register = () => {
  //6.Cadastro dos States com todos iniciando com string vazia
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //11. Neste bloco de States adicona hook dispatch, ele permitirá a utilização das funções REDUX (reset, register)
  const dispatch = useDispatch();

  //11. Extrair STATES do "authSlice.jsx" por meio do useSelector abaixo, poderia pegar qualquer state mas nesse caso foi apenas do "authSlice", portanto qual é o estado e de qual contexto/reducer
  const {loading, error} = useSelector((state) => state.auth);

  //3. Função handleSubmit, previnindo o evento de envio do fomulário, será feito "debaixo dos panos"
    const handleSubmit = (e) => {
    e.preventDefault();

  //6.O State acima forma um usuário abaixo e falta o disparo na sintaxe de "onChange" no retorno abaixo pegada cada valor de um input, quando não tiver valor, preenhce com o perador ou "||" sendo uma string vazia e evita erro no console
  const user = {
     name,
     email,
     password,
     confirmPassword,
    };
    
    console.log(user);

    //11. Dispatch em register passando os dados do usuário na API para obter uma resposta
    dispatch(register(user));
  };

  //11. LIMPA TODOS AUTH STATES: Sempre que tiver um dispatch, haverá um userEffect, quando acontecer um login será necessário remover qualquer erro pois estamos fazendo uma nova requisição e desta maneira zera tudo e pega os dados de uma nova requisição, desta maneira deixa o reset automatizado antes de qualquer função disparar uma requisição assincrona. O motivo de todo esse trabalho é em razão de não consegir disparar o RESET
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  //3. Atualiza campos e lavels de cadastro com links de conta existente com redirecianamento
  return (
    <div id="register">
     <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome" 
          onChange={(e) => setName(e.target.value)}
          value={name || ""} 
        />
        <input 
          type="email" 
          placeholder="E-mail" 
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}  
        />
        <input 
          type="password" 
          placeholder="Senha" 
          onChange={(e) => setPassword(e.target.value)}
          value={password || ""} 
        />
        <input 
          type="password" 
          placeholder="Confirme a senha" 
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword || ""} 
        />
        {/*13. Sntaxe para mensagem de erro de acordo com estados do slice */}
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled /> }
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Ja tem conta? <Link to="/login" >Clique aqui.</Link>
        </p>
    </div>
  );
};

export default Register;