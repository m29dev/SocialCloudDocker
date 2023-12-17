/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Navbar from "./components/Navbar.jsx";
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = ({ socket }) => {
  const { userInfo } = useSelector((state) => state.auth)
  socket.auth = { userId: userInfo?._id }
  socket.connect()

  return (
    <>
      <CssBaseline></CssBaseline> 

      <Navbar socket={socket}></Navbar>
      <Outlet></Outlet>

      <ToastContainer
        style={{
          marginTop: "55px"
        }}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App