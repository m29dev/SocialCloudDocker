import { useState, useEffect } from "react"
import { TextField } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useLoginUserMutation } from "../../state/authApiSlice"
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
        if (userInfo) {
            navigate('/posts')
        }
    }, [navigate, userInfo])

    //handle login
    const [login] = useLoginUserMutation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setUserInfo(res))
            navigate('/posts')
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
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
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
                                    onClick={() => navigate('/register')}
                                    variant="body2">
                                    {"Don't have an account? Sign Up"}
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