import { apiSlice } from "./apiSlice";

const AUTH_URL = '/api/auth'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data
            })
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST'
            })
        }),
    })
})

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation } = authApiSlice