import "./App.css";

//Router
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

//15. Hooks
import { useAuth } from "./hooks/useAuth";

//1. Components, 23. EditProfile, 33. Profile, 53. Photo, 69. Search
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EditProfile from "./pages/EditProfile/EditProfile";
import Profile from "./pages/Profile/Profile";
import Photo from "./pages/Photo/Photo";
import Search from "./pages/Search/Search";


function App() {
    //15. Extrai do que vem do app sendo loading e estado de autenticado. O local host aponta para autenticação ativa pela variável "user" de slice, armazena usuário
    const {auth, loading} = useAuth();

    //15. Condição para loading
    if(loading) {
        return <p>Carregando...</p>;
    }


  return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              {/*15. Se tiver autenticado o usuário acessa a home, senão ":" redireciona para login. Segue com outras condições, 23. Rota "/profile", 33. Rota "/users/:id"*/}
              <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} />
              <Route path="/profile" element={auth ? <EditProfile /> : <Navigate to="/login" />} />
              <Route path="/users/:id" element={auth ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!auth ? <Register /> : <Navigate to="/" />} />
              <Route path="/search" element={auth ? <Search /> : <Navigate to="/login" />} />
              <Route path="/photos/:id" element={auth ? <Photo /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
  );
};

export default App;