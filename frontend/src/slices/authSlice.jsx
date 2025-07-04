//10. Importa módulos do Redux e Serviços, pois é dele que sairá as funções para executar as coisas do sistema que correspondem a esse slice, Services e Slices estão conectados
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

//10. Pega usuário salvo do "./services/authService" pela LOCALSTORAGE
const user = JSON.parse(localStorage.getItem("user"));

//10. Neste state, a variável usuário será preenchida pelo usuário captado, se vazio é nulo. Estado de erro, loading e sucssso que inicia em falso
const initialState = {
    user: user ? user : null,
    error: false,
    sucess: false,
    loading: false,
};

//10. Registrar usuário e logar - Está alocando o usuário na localstorage portanto isso caracteriza estar autenticado. Exporta função register e cria função asyncThunk com argumento "auth/register" onde o nome "auth" segue a convenção como nome da entidade que estamos trabalhando que é a autenticação e o register é a ação atual, comoo "auth/login","/logout" etc...E o segundo argumento é a função que recebe o usuário e a "thinkAPI" permite utilizar funções extras como parar a execução e identificar erros da API.
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    //10. Variável armazenando dados do "Register.jsx" passando o usuário
    const data = await authService.register(user);
    //10. Checa erros, se tiver, virá da requisição, o rejectwithvalue rejeitará a requisição devido ao erro
        if(data.errors) {
        //"data.errors[0]" no backend terá um array com varias mensagens, neste projeto a exbibição é erro por erro, portanto pega o primeiro elemento e exibe na tela. Outra opção de desenvolvimento do backend/API seria pegar erro por erro e colocar nos inputs necessários.
        return thunkAPI.rejectWithValue(data.errors[0]); 
        }
    //10. Retorno do usuário cadastrado    
    return data;
    }
);

//17. Logout do usuário exportando uma função assincrona
export const logout = createAsyncThunk("auth/logout", async() => {
    await authService.logout();
});

//21. Sign in um usuário (Copia 10. e cola como 21. Alterando apenas nome e rota)
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    //21. Variável armazenando dados do "Register.jsx" passando o usuário
    const data = await authService.login(user);
    //21. Checa erros, se tiver, virá da requisição, o rejectwithvalue rejeitará a requisição devido ao erro
        if(data.errors) {
        //21. "data.errors[0]" no backend terá um array com varias mensagens, neste projeto a exbibição é erro por erro, portanto pega o primeiro elemento e exibe na tela. Outra opção de desenvolvimento do backend/API seria pegar erro por erro e colocar nos inputs necessários.
        return thunkAPI.rejectWithValue(data.errors[0]); 
        }
    //21. Retorno do usuário cadastrado    
    return data;
    }
);


//10.Cria Slice com as funções disponíveis deste arquivo Slice
export const authSlice = createSlice({
    //10. Nomear propiedades para assumi-las no STORAGE e futuramente poder extrair valores atravéz destes nomes
    name: "auth",
    initialState, //Passa o estágio inicial para o "name"
    reducers: { //Passa função do SLICES que reseta todos os estados, bascamente reseta tudo para o início
        reset: (state) => {
            state.loading = false;
            state.error = false;
            state.sucess = false;
        },
    },
    //10. Faz parte das execuções da API, trabalha diretamente com os estados atuais da requisição e o constructor cria cada ação separadamente. Esses dados recebidos virão da função REGISTER e o "return data" da função register é pego pelo argumento "action" abaixo. É possível trafegar dados, não é apenas alterar Estados, pega SLICE de autenticação e pegar os dados de usuário ("state.user = action.payload") se teve sucesso.
    extraReducers: (builder) => {
        //10. add.Case adicona diversos casos se a requisição foi enviada e não tem resposta, seta o estado de loading como TRUE e Error FLASE
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.sucess = true;
            state.error = null;
            state.user = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        }) //17. Adiciona lgoout limpando tudo
        .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.sucess = true;
            state.error = null;
            state.user = null;
        })
        //21. Copia bloco acima e altera rota para "login"
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.sucess = true;
            state.error = null;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        });
    },
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;