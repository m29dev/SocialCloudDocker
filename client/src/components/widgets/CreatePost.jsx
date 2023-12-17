import {
    useState
} from 'react'
import { useDispatch, useSelector } from "react-redux"
import {
    Avatar,
    Card,
    CardMedia
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';
import { useCreatePostMutation } from '../../state/postApiSlice'
import { setPosts } from '../../state/authSlice'
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const [description, setDescription] = useState('')
    const [file, setFile] = useState('')
    const [createPost] = useCreatePostMutation()
    const [src, setSrc] = useState('')

    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)

    const handleOnChangeImage = (e) => {
        setFile(e.target.files[0])
        const localImageUrl = URL.createObjectURL(e.target.files[0])
        setSrc(localImageUrl)
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault()
        try {
            toast.loading('uploading post...')
            if (userInfo) {
                const formData = new FormData()
                if (file) formData.append('image', file, file.name)
                formData.append('userId', userInfo._id)
                formData.append('description', description)

                //create post with data formed above
                const res = await createPost(formData).unwrap()

                //update posts's array
                if (res) dispatch(setPosts({ posts: res }))

                //clear form inputs
                setDescription('')
                setFile('')
                setSrc('')

                toast.dismiss()
                toast.success('post uploaded')
            }
        } catch (err) {
            toast.dismiss();
            (err?.data?.message) ? toast.error(err?.data?.message) : toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    return (
        <>
            <Card
                className='createPostBar'
            >
                <div
                    style={{
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "16px"
                    }}
                >
                    <Avatar
                        src={userInfo.picturePath}
                    >
                    </Avatar>

                    {/* input bubble */}
                    <form
                        className="prettyForm"
                        style={{
                            width: "100%",
                            height: "40px",
                            marginLeft: "16px"
                        }}
                        onSubmit={handlePostSubmit}
                    >
                        <input
                            type="text"
                            placeholder="What's on your mind..."
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                marginBottom: "10px",
                                borderRadius: "25px"
                            }}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        >
                        </input>

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
                            <ImageIcon
                                color="primary"
                                style={{
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                    height: "40px",
                                    cursor: "pointer",
                                    color: "primary"
                                }}
                            />
                        </label>

                        <SendIcon
                            color="primary"
                            style={{
                                marginLeft: "2px",
                                marginRight: "2px",
                                height: "40px",
                                cursor: "pointer",
                                color: "primary"
                            }}
                            onClick={handlePostSubmit}
                        />
                    </form>
                </div>

                {/* display sent image */}
                {(src && (
                    <CardMedia
                        component="img"
                        image={src}
                        alt="post-img"
                    />
                ))}
            </Card>
        </>
    )
}

export default CreatePost