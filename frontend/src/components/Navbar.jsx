//1. Início desenvolvimento do Navbar
import "./Navbar.css";

//1. Importa componente e icones, cada ícone pertence a uma biblioteca e esses pertencem ao bootstrap, portanto ".../bs"
import { NavLink, Link } from "react-router-dom";
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs";

//Hooks - 16. useState para estados, useAuth para pegar autenticação, useDipstach para ações de lougout, useSelector para pegar estados do Redux, useNavigate para redirecionar usuários
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Redux - 18. Importa logout do slice
import {logout, reset} from "../slices/authSlice";

const Navbar = () => {
  //16. armazena autenticação, usuário pela arrow function de busca, 
  const {auth} = useAuth();
  const {user} = useSelector((state) => state.auth);

  //70. Variável para busca
  const [query, setQuery] = useState("");

  //18. Instanciando o Navigate alocando em uma variável
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //18. Cria função de logout - Aplicar no SPAN de SAIR do return
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  //70. Função busca
  const handleSearch = (e) => {
    e.preventDefault();
    //70. Critério de busca
    if(query) {
        return navigate(`/search?q=${query}`);
    }
  };

  //1. Aplica desenvolvimento parcial com link, formulário, input, botões
  return (
    <nav id="nav">
      <Link to="/">ReactGram</Link>
      {/*70. Evento para busca */}
      <form id="search-form" onSubmit={handleSearch}>
        <BsSearch />
        <input 
            type="text" 
            placeholder="Pesquisar" 
            onChange={(e) => setQuery(e.target.value)} />
      </form>
      <ul id="nav-links">
        {/*16. Inicia toda navbar */}
        {auth ? (
            <>
             <li>
             <NavLink to="/">
             <BsHouseDoorFill />
             </NavLink>
             </li>
             {user && (
                <li>
                    <NavLink to={`/users/${user._id}`}>
                     <BsFillCameraFill />
                    </NavLink>
                </li>
             )}
             <li>
                <NavLink to="/profile">
                 <BsFillPersonFill />
                </NavLink>
             </li>
             <li>
                {/*17. Função de logout */}
                <span onClick={handleLogout}>Sair</span>
             </li>
            </>
        ) : (
            <>
             <li>
             <NavLink to="/login">Entrar</NavLink>
             </li>
             <li>
             <NavLink to="/register">Cadastrar</NavLink>        
             </li>
            </>
        )}
        {/*16. Finaliza navbar */}
      </ul>
    </nav>
  );
};

export default Navbar;