import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    posts: [],
    //screen size
    isMobile: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        clearUserInfo: (state) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        },
        setOnlineFriend: (state, action) => {
            const updatedFriends = state.userInfo.friends.map((friend) => {
                if (friend._id === action.payload.friend._id) return action.payload.friend
                return friend
            })
            state.userInfo.friends = updatedFriends
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post
                return post
            })
            state.posts = updatedPosts
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload
        }
    }
})

export const { setUserInfo, clearUserInfo, setOnlineFriend, setPosts, setPost, setIsMobile } = authSlice.actions
export default authSlice.reducer  