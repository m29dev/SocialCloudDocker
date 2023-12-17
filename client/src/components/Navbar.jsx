/* eslint-disable react/prop-types */
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Avatar } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearUserInfo } from '../state/authSlice'
import { useLogoutUserMutation } from '../state/authApiSlice'
import SearchBar from './widgets/SearchBar';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import { useEffect } from 'react';
import { useGetPostsMutation } from "../state/postApiSlice";
import { setPosts } from "../state/authSlice";
import { toast } from 'react-toastify';

export default function Navbar({ socket }) {
    const { userInfo } = useSelector((state) => state.auth)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    //handle refresh posts onClick at 'SocialCloud'
    const [getPosts] = useGetPostsMutation()
    const getPostsApi = async () => {
        try {
            toast.loading('refreshing...', {
                position: "top-center",
            })
            const res = await getPosts({ id: userInfo._id }).unwrap()

            //clear toast after 1sec
            setTimeout(() => {
                toast.dismiss()
                dispatch(setPosts({ posts: res }))
            }, 1000)
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    //handle message notifications
    const [newMessageNumber, setNewMessageNumber] = useState(0)
    const [sender, setSender] = useState('')
    useEffect(() => {
        socket.on('receivePrivateMessage', (data) => {
            if (window.location.pathname !== `/chat/${data.sender}`) {
                setNewMessageNumber(newMessageNumber + 1)
                setSender(data.sender)
            }
        })
    }, [socket, newMessageNumber])

    //handle logout
    const [logout] = useLogoutUserMutation()
    const handleLogout = async () => {
        try {
            await logout().unwrap()
            dispatch(clearUserInfo())
            navigate('/login')
            toast.success(`You've been logged out`)
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    //handle menu options
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            style={{
                marginTop: "40px"
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                handleMenuClose()
                navigate(`/users/${userInfo._id}`)
            }}>
                Profile
            </MenuItem>

            <MenuItem onClick={() => {
                handleMenuClose()
                navigate(`/users/${userInfo._id}/edit`)
            }}>
                Edit Account
            </MenuItem>

            <MenuItem onClick={() => {
                handleMenuClose()
                handleLogout()
            }}>
                Logout
            </MenuItem>
        </Menu>
    )

    return (
        <>
            {(userInfo && (
                <Box
                    sx={{ flexGrow: 1 }}
                    style={{
                        position: "fixed",
                        top: "0",
                        width: "100%",
                        zIndex: "2"
                    }}
                >
                    <AppBar position="static" >
                        <Toolbar>
                            <CloudCircleIcon
                                onClick={() => {
                                    getPostsApi()
                                    navigate('/posts')
                                    window.scrollTo(0, 0)
                                }}
                                style={{ cursor: "pointer", width: '35px', height: '35px' }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                onClick={() => {
                                    getPostsApi()
                                    navigate('/posts')
                                    window.scrollTo(0, 0)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                SocialCloud
                            </Typography>

                            <SearchBar></SearchBar>

                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: 'flex' }}>

                                <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={() => {
                                        sender ? navigate(`/chat/${sender}`) : navigate(`/chat/${userInfo?.friends[0]?._id}`)
                                        setNewMessageNumber(0)
                                        setSender(null)
                                    }}
                                >
                                    <Badge badgeContent={newMessageNumber} color="error">
                                        <MailIcon style={{width: '35px', height: '35px'}}/>
                                    </Badge>
                                </IconButton>

                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    {/* user's avatar */}
                                    <Avatar
                                        alt="user-img"
                                        src={userInfo?.picturePath}
                                        style={{height: '30px', width: '30px'}}
                                    />
                                </IconButton>
                            </Box>

                            {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon />
                                </IconButton>
                            </Box> */}

                        </Toolbar>
                    </AppBar>
                    {/* {renderMobileMenu} */}
                    {renderMenu}
                </Box>
            ))}

            {(!userInfo && (
                <Box
                    sx={{ flexGrow: 1 }}
                    style={{
                        position: "fixed",
                        top: "0",
                        width: "100%",
                        zIndex: "2"
                    }}
                >
                    <AppBar position="static" >
                        <Toolbar>
                            <CloudCircleIcon
                                onClick={() => navigate('/posts')}
                                style={{ cursor: "pointer" }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                onClick={() => {
                                    navigate('/posts')
                                    window.scrollTo(0, 0)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                SocialCloud
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {/* {renderMobileMenu} */}
                    {renderMenu}
                </Box >
            ))
            }
        </>
    )
}