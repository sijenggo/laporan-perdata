import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "ui"], // Hanya menyimpan auth dan ui
};

const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
