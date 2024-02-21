import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true,
                state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false,
                state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true,
                state.error = null
        },
        udpateSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false,
                state.error = null
        },
        updateFailure: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },
        deleteStart: (state) => {
            state.loading = true,
                state.error = null
        },
        deleteSuccess: (state) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        },
        deleteFailure: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },
        signOutSucess: (state) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        },
    },
})

export const { signInStart, signInSuccess, signInFailure, updateStart, udpateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure ,signOutSucess} = userSlice.actions

export default userSlice.reducer