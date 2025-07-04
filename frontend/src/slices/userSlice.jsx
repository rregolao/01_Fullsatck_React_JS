//25. Inicia desenvolvimento, 27. userService,
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import userService from "../services/userService";

//25.Armazena Estados
const initialState = {
    user: {},
    error: false,
    success: false,
    loading: false,
    message: null,
};

//27. Função pega o user Details para preenher fomulário do usuário, passa a rota exata do profile do usuário.O próximo argumento é uam função assincrona que passa o usuário e a thunkAPI para fazer a requisição
export const profile = createAsyncThunk(
    "user/profile", 
    async(user, thunkAPI) => {
        //27. A thunkAPI pega o token que está salvo no "auSlice", é necessário pegar o "token" para poder processar a requisição no backend
        const token = thunkAPI.getState().auth.user.token
        //27. Extrai dados pelo suerService com método profile passando user e token
        const data = await userService.profile(user, token)
        //27. Retorna dados atráves do service
        return data;
    }
);

//31. Update user details - Atualiza perfil chamando a funlão de "user/update"
export const updateProfile = createAsyncThunk(
    "user/update",
    //31. thunkApi para pegar o token
    async(user, thunkAPI) => {
        //31. Pega o token
        const token = thunkAPI.getState().auth.user.token;
        //31. Os dados virão do serviço imortado, passa a função de update, passa o usuário que chega da requisição e o token pego antes com a thunkAPI
        const data = await userService.updateProfile(user, token);

        //31. Check for errors, se dados chegaram, pelo retorn da thunkApi pega pela funlão erro do elmento 0 para imprimir o erro
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        //31. Retorna o dado
        return data;
    }
);

//25. Exporta função REDUCER
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },
    //27. Cria nova propiedade para o objeto copiando de "authSlice", um novo REDUCER passando o build
    extraReducers: (builder) => {
        builder
        .addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(profile.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        })
        //31. Copia de authSlice e cola o bloco incluindo apenas o "state.message" da atualização
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
            state.message = "Usuário atualizado com sucesso!"
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = {};
        })
        .addCase(getUserDetails.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getUserDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }); 
    },
});

//34. Get user details com nome "user/get" que é apenas uma referencia do próprio Redux. Não precisa passar token pois nas rotas do backend "userRoutes" ela não tem o "VALIDATION" e portanto está publica
export const getUserDetails = createAsyncThunk(
    "user/get",
    //34. O id é enviado para o backend com dados do usuário, thunkAPI é a função que poderá ser utilizada
    async(id, thunkAPI) => {
        //34. Passa o id para pegar dados do usuário
        const data =  await userService.getUserDetails(id);
        //34. retorna dados
        return data;
    }
);

export const {resetMessage} = userSlice.actions
export default userSlice.reducer;