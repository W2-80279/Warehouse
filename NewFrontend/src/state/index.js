import { createSlice } from "@reduxjs/toolkit";

// Correct the typo: "intialState" to "initialState"
const initialState = {
    mode: "light"
};

// Correct the export name: change `globalState` to `globalSlice`
export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? "dark" : 'light';
        }
    }
});

// Correct the export of the `actions` and `reducer`
export const { setMode } = globalSlice.actions;
export default globalSlice.reducer;
