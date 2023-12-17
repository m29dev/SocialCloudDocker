import { useState, useEffect } from "react"
import { TextField } from "@mui/material"
import { useRegisterUserMutation } from "../../state/authApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUserInfo } from "../../state/authSlice"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)
    useEffect(() => {
        window.scrollTo(0, 0)

        if (userInfo) {
            navigate('/posts')
        }
    }, [navigate, userInfo])

    //handle register
    const [register] = useRegisterUserMutation()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [location, setLocation] = useState('')
    const [occupation, setOccupation] = useState('')
    const [file, setFile] = useState('')
    const [src, setSrc] = useState('')
    const handleOnChangeImage = (e) => {
        setFile(e.target.files[0])
        const localImageUrl = URL.createObjectURL(e.target.files[0])
        setSrc(localImageUrl)
    }
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            if (file) formData.append('image', file, file.name)
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('location', location)
            formData.append('occupation', occupation)

            const res = await register(formData).unwrap()
            dispatch(setUserInfo(res))
            navigate('/posts')
            toast.success(`Welcome to SocialCloud ${firstName}`)
        } catch (err) {
            toast.dismiss();
            (err?.data?.message) ? toast.error(err?.data?.message) : toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    return (
        <>
            <Container
                component="main"
                maxWidth="xs"
                style={{
                    marginTop: "100px"
                }}
            >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                        {/* first name */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoFocus
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {/* last name */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {/* email */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* password */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* location */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="location"
                            label="Location"
                            name="location"
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        {/* occupation */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="occupation"
                            label="Occupation"
                            name="occupation"
                            onChange={(e) => setOccupation(e.target.value)}
                        />
                        {/* picture */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <input
                                className='hidden'
                                id='realInput'
                                type='file'
                                name='image'
                                value=''
                                onChange={handleOnChangeImage}
                            >
                            </input>

                            <label
                                htmlFor="realInput"
                                style={{ display: "flex" }}
                            >
                                {/* display sent image */}
                                {((
                                    <Avatar
                                        alt="post-img"
                                        src={src}
                                        style={{
                                            height: "300px",
                                            width: "300px",
                                            cursor: "pointer"
                                        }}
                                    />
                                ))}
                            </label>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate('/login')}
                                    variant="body2">
                                    {"Have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default LoginPage