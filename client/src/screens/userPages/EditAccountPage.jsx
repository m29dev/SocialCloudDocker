import { useState } from "react"
import { TextField } from "@mui/material"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUserInfo } from "../../state/authSlice"
import { useSelector } from "react-redux"
import { clearUserInfo } from "../../state/authSlice"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDeleteUserMutation, useUpdateUserMutation } from "../../state/userApiSlice"
import { toast } from 'react-toastify';

const EditAccountPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)

    //handle update
    const [update] = useUpdateUserMutation()
    const [isEditActive, setIsEditActive] = useState(true)
    const [isDeleteActive, setIsDeleteActive] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [location, setLocation] = useState('')
    const [occupation, setOccupation] = useState('')
    const [file, setFile] = useState('')
    const [picturePreviewSrc, setPicturePreviewSrc] = useState(userInfo.picturePath)
    const handleOnChangeImage = (e) => {
        setFile(e.target.files[0])
        const localImageUrl = URL.createObjectURL(e.target.files[0])
        setPicturePreviewSrc(localImageUrl)
    }
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            toast.loading('updating account...')

            const formData = new FormData()
            if (file) formData.append('image', file, file.name)
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('location', location)
            formData.append('occupation', occupation)

            const res = await update({ id: userInfo._id, formData: formData }).unwrap()
            if (res) {
                toast.dismiss()
                toast.success('account updated')
                dispatch(setUserInfo(res))
                navigate(`/users/${userInfo._id}`)
            }
        } catch (err) {
            if (err?.data?.message === 'token not found') {
                dispatch(clearUserInfo())
                navigate('/login')
            } else {
                toast.dismiss();
                (err?.data?.message) ? toast.error(err?.data?.message) : toast.error('connection lost...', {
                    toastId: '1'
                })
            }
        }
    }

    //handle delete
    const [deleteUser] = useDeleteUserMutation()
    const handleDelete = async () => {
        try {
            const res = await deleteUser({ id: userInfo._id }).unwrap()
            if (res) dispatch(clearUserInfo())
            toast.success('account has been deleted')
            navigate('/login')
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    return (
        <>
            < Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            setIsEditActive(true)
                            setIsDeleteActive(false)
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: isEditActive ? 'primary.main' : 'gray' }}>
                            <EditIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" style={{ color: isEditActive ? '' : 'gray' }}>
                            Edit Account
                        </Typography>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            setIsDeleteActive(true)
                            setIsEditActive(false)
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: isDeleteActive ? 'rgb(230, 89, 89)' : '' }}>
                            <DeleteIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" style={{ color: isDeleteActive ? '' : 'gray' }}>
                            Delete Account
                        </Typography>
                    </div>
                </Box>

                {/* edit account */}
                {(isEditActive && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 1 }}>
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
                                            src={picturePreviewSrc}
                                            style={{
                                                height: "300px",
                                                width: "300px",
                                                cursor: "pointer"
                                            }}
                                        />
                                    ))}
                                </label>
                            </div>


                            {/* first name */}
                            <TextField
                                margin="normal"
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
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {/* email */}
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* password */}
                            <TextField
                                margin="normal"
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
                                fullWidth
                                id="location"
                                label="Location"
                                name="location"
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            {/* occupation */}
                            <TextField
                                margin="normal"
                                fullWidth
                                id="occupation"
                                label="Occupation"
                                name="occupation"
                                onChange={(e) => setOccupation(e.target.value)}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Edit Account
                            </Button>
                        </Box>
                    </Box>
                ))}

                {/* delete account */}
                {isDeleteActive && (
                    <Box sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: 'rgb(230, 89, 89)' }}
                            onClick={handleDelete}
                        >
                            Delete Account
                        </Button>
                    </Box>
                )}
            </Container >
        </>
    )
}

export default EditAccountPage