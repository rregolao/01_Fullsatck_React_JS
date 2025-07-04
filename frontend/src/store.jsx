import {configureStore} from "@reduxjs/toolkit";

//10. Import authReducer, 25. userReducer, 39. photoReducer
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import photoReducer from "./slices/photoSlice";

//10. 25. userReducer, 39. photoReducer,
export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer,
    },
});