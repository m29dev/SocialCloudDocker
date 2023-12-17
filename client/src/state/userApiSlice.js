import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //get whoever's profile
        getUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}`,
                method: 'GET',
            })
        }),
        searchUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            })
        }),
        //add / remove friend
        addRemoveFriend: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/${data.friendId}`,
                method: 'PUT',
            })
        }),
        //update my account
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/edit`,
                method: 'PUT',
                body: data.formData
            })
        }),
        //delete my account
        deleteUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}/delete`,
                method: 'DELETE',
            })
        })
    })
})

export const { useGetUserProfileMutation, useSearchUserMutation, useAddRemoveFriendMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice
