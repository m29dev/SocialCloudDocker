import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from 'react-router-dom'
import store from './state/store.js'
import { Provider } from 'react-redux'
import LoginPage from './screens/authPages/LoginPage.jsx'
import RegisterPage from './screens/authPages/RegisterPage.jsx'
import ProfilePage from './screens/userPages/ProfilePage.jsx'
import HomePage from './screens/HomePage.jsx'
import EditAccountPage from './screens/userPages/EditAccountPage.jsx'
import ProtectedRoute from './screens/ProtectedRoute.jsx'
import ChatPage from './screens/userPages/ChatPage.jsx'
//init socket io
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000', { autoConnect: false })

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App socket={socket} />}>
            <Route
                path="/"
                element={<Navigate to="/login" replace={true} />}
            ></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="register" element={<RegisterPage />}></Route>

            <Route element={<ProtectedRoute />}>
                <Route path="posts" element={<HomePage />}></Route>
                <Route path="users/:id" element={<ProfilePage />}></Route>
                <Route
                    path="users/:id/edit"
                    element={<EditAccountPage />}
                ></Route>
                <Route
                    path="chat/:id"
                    element={<ChatPage socket={socket} />}
                ></Route>
            </Route>

            <Route path="*" element={<h1>404</h1>}></Route>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <React.StrictMode>
            <RouterProvider router={router}></RouterProvider>
        </React.StrictMode>
    </Provider>
)
