import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        clearAuth: (state) => {
            state.accessToken = null;
        }
    }});
export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;