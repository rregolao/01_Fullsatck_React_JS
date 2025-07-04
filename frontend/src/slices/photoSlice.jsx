//39. Importa Slice, Thunk para criar funções e photoService
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import photoService from "../services/photoService";

//39. Cria inicial state de photos em um array
const initialState = {
    photos: [],
    photo: {},
    error: false,
    success: false,
    loading: false,
    message: null,
};

//41. Publish user photo - Funções
export const publishPhoto = createAsyncThunk(
    "photo/publish",
    async(photo, thunkAPI) => {
        //41. Pega o token
        const token = thunkAPI.getState().auth.user.token;
        //41. Variável para os dados da requisição passando photo como data e o token 
        const data = await photoService.publishPhoto(photo, token);

        //41. Check for errors - Se verdadeiro, rejeita retornando o primeiro elemento
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        //41. Retorna dados
        return data;
    }
);

//44. Get user photos utilizando o Redux tool kit com "createAsyncThunk"
export const getUserPhotos = createAsyncThunk(
    "photo/userphotos",
    async (id, thunkAPI) => {
        //44. Pega o token
        const token = thunkAPI.getState().auth.user.token;
        //44. Variável de foto pelo id do usuário e token
        const data = await photoService.getUserPhotos(id, token);
        //44. Retorna dados da requisição
        return data;
    }
);

//48. Delete a photo
export const deletePhoto = createAsyncThunk(
    "photo/delete",
    async (id, thunkAPI) => {
        //44. Pega o token
        const token = thunkAPI.getState().auth.user.token;
        //44. Variável de foto pelo id do usuário e token
        const data = await photoService.deletePhoto(id, token);

        if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
        }

        //44. Retorna dados da requisição
        return data;
    }
);

//51. Update a photo
export const updatePhoto = createAsyncThunk(
    "photo/update",
    async (photoData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        //51. Para a atualização passa foto title em um objeto
        const data = await photoService.updatePhoto({title: photoData.title}, photoData.id, token);

        if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

//55. Get photo by id
export const getPhoto = createAsyncThunk("photo/getphoto", async (id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await photoService.getPhoto(id, token);

        if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

//59. Like a photo
export const like = createAsyncThunk("photo/like", async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await photoService.like(id, token);

        if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
});

//63. Add comment to a photo
export const comment = createAsyncThunk("photo/comment", async(commentData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await photoService.comment({comment:commentData.comment}, commentData.id, token);

        if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
});

//66. Get all photos - Os parametros da função demandam agumentos, 1-dados e 2-O thunkAPI, portantto nesta sintaxe não teremos como passar dados como id, data, entao usa o underline "_" seguido do thunkAPI para o Redux/React entender vazio
export const getPhotos = createAsyncThunk("photo/getall", async(_ , thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await photoService.getPhotos(token);

        return data;
});

//72. Search photo by title
export const searchPhotos = createAsyncThunk("photo/search", async(query, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await photoService.searchPhotos(query, token);

        return data;
});


//39. Exporta Slice com as funções criadas
export const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;        
        },
    },
    //41. Adiciona os extra reducers copiando de "photoSlice"
    extraReducers: (builder) => {
        builder
        .addCase(publishPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(publishPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photo = action.payload;
            state.photos.unshift(state.photo); //Método de array igual o push, adicona no primeiro lugar
            state.message = "Foto publicada com sucesso!"
        })
        .addCase(publishPhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.photo = {};
        })
        //44. Adiona extra reducers da função "getUserPhotos"
        .addCase(getUserPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getUserPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        })
        //48. Adiona extra reducers da função DELETE. O que acontece quando deleta uma foto com sucesso, o erro fica nulo e o state.photos passa por um desenvolvimento de filtragem por um array para checar cada uma das fotos, se tiver um id igual ao id deletado, exclui a foto do array, então muda o state em necessitar fazer uma nova requisição no sistema.
        .addCase(deletePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(deletePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = state.photos.filter((photo) => {
                return photo._id !== action.payload.id
            });

            state.message = action.payload.message;
        })
        .addCase(deletePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.photo = {};
        })
        //51. Extra reducers de atualização com função de update de maior complexidade
        .addCase(updatePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(updatePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos.map((photo) => {
                if(photo._id === action.payload.photo._id) {
                    return (photo.title = action.payload.photo.title);
                }
                return photo;
            });

            state.message = action.payload.message;
        })
        .addCase(updatePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.photo = {};
        })
        .addCase(getPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photo = action.payload;
        })
        //59. Bloco like
        .addCase(like.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            //59. Insere id do usuário que veio da requisição nos likes da foto
            if(state.photo.likes) {
                state.photo.likes.push(action.payload.userId);
            }

            //59. Insere likes no array de fotos
            state.photos.map((photo) => {
                if(photo._id === action.payload.photoId) {
                    return photo.likes.push(action.payload.userId);
                }
                return photo;
            });

            state.message = action.payload.message;
        })
        .addCase(like.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //63. Bloco de Comentário
        .addCase(comment.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photo.comments.push(action.payload.comment); //63. Comentários novos ficam sempre abaixo
            state.message = action.payload.message;
        })
        .addCase(comment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //66. Blogo get all photos
        .addCase(getPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        })
        //72. Extra reducers bloco search
        .addCase(searchPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(searchPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        });
    },
});

export const {resetMessage} = photoSlice.actions;
export default photoSlice.reducer;