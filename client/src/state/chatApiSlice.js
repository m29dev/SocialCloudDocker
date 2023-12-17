import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/chats'

export const chatsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //create / update chat
        sendChat: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}/${data.friendId}`,
                method: 'POST',
                body: data
            })
        }),
        //read chat
        getChat: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}/${data.friendId}`,
                method: 'GET'
            })
        }),
        // //update chat
        // updateChat: builder.mutation({
        //     query: (data) => ({
        //         url: `${USERS_URL}/${data.userId}/${data.friendId}`,
        //         method: 'PUT',
        //         body: data.message
        //     })
        // })
    })
})

export const { useSendChatMutation, useGetChatMutation, } = chatsApiSlice
