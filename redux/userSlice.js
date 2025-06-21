import { createSlice } from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
    userInfo: null,
    churchInfo: null,
    churchMedia: [],
    connectedFriends: [],
    networkStatus: true
};

export const userSlice = createSlice({
    name: 'userInfo', // This is the name of the slice, we will later use this name to access the slice from the store
    initialState: initialState, // This is the initial state of the slice
    reducers: {
        // All the reducers go here
        login: (state, action) => {
            state.userInfo = action.payload;
        },
        setChurch: (state, action) => {
            state.churchInfo = action.payload;
        },
        logout: (state) => {
            state.userInfo = null;
        },
        clearChurch: (state) => {
            state.churchInfo = null;
            state.churchMedia = new Array();
        },
        updateUserInfo: (state, { payload }) => {
            state.userInfo = {
                ...state.userInfo,
                ...payload
            }
        },
        churchYoutubeMedia: (state, { payload }) => {
            state.churchMedia = payload
        },
        userConnectedFriends: (state, { payload }) => {
            state.connectedFriends = payload
        },
        updateNetworkStatus: (state, { payload }) => {
            state.networkStatus = payload
        }
    },
});

export const { 
    login, 
    setChurch, 
    logout, 
    clearChurch, 
    updateUserInfo, 
    churchYoutubeMedia,
    userConnectedFriends,
    updateNetworkStatus
} = userSlice.actions;

export default userSlice.reducer;