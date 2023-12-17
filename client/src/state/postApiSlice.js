import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/posts'

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //create post
        createPost: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            })
        }),
        //read all posts
        getPosts: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}`,
                method: 'GET'
            })
        }),
        //read all posts created by user
        getUserProfilePosts: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/filter`,
                method: 'GET'
            })
        }),
        //update post
        updatePost: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/update`,
                method: 'PUT',
                body: data
            })
        }),
        //update post's likes
        likePost: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/like`,
                method: 'PUT',
                body: data
            })
        }),
        deletePost: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/delete`,
                method: 'DELETE'
            })
        })
    })
})

export const { useCreatePostMutation, useGetPostsMutation, useGetUserProfilePostsMutation, useGetPostIdMutation, useUpdatePostMutation, useLikePostMutation, useDeletePostMutation } = postsApiSlice
