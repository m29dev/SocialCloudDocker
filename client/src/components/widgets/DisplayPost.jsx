/* eslint-disable react/prop-types */
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation
} from '../../state/postApiSlice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardActions from '@mui/material/CardActions'
import { Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPost, setPosts } from '../../state/authSlice';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';

const DisplayPost = ({
    postId,
    postUserId,
    postFirstName,
    postLastName,
    postDescription,
    postPicturePath,
    postUserPicturePath,
    postLikes,
    postDate
}) => {
    const newDate = new Date(postDate)
    const formatDate = `${newDate.toLocaleDateString('uk')} at ${newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()}`

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)

    //like post
    const [likePost] = useLikePostMutation()
    const isLiked = Boolean(postLikes[userInfo._id])
    const likeCount = Object.keys(postLikes).length
    const handleLikePost = async () => {
        try {
            const res = await likePost({ id: postId, userId: userInfo._id }).unwrap()
            dispatch(setPost({ post: res }))
        } catch (err) {
            toast.error('connection lost...')
        }
    }

    //update post
    const [displayEdit, setDisplayEdit] = useState(false)
    const [updatePost] = useUpdatePostMutation()
    const [updateDescription, setUpdateDescription] = useState(postDescription)
    const handleEditPostSubmit = async (e) => {
        e.preventDefault()
        handleMenuClose()
        try {
            toast.loading('updating post')

            const res = await updatePost({ id: postId, userId: userInfo._id, description: updateDescription }).unwrap()
            dispatch(setPost({ post: res }))
            setDisplayEdit(false)
            toast.dismiss()
            toast.success('post updated')
        } catch (err) {
            toast.dismiss();
            (err?.data?.message) ? toast.error(err?.data?.message) : toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    //delete post
    const [deletePost] = useDeletePostMutation()
    const handleDeletePost = async () => {
        handleMenuClose()
        try {
            toast.loading('deleting post')
            const res = await deletePost({ id: postId }).unwrap()
            dispatch(setPosts({ posts: res }))
            toast.dismiss()
            toast.success('post deleted')
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    //menu options settings
    const [anchorEl, setAnchorEl] = useState(null)
    const handlePostMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    const isMenuOpen = Boolean(anchorEl)
    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
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
                setDisplayEdit(!displayEdit)
            }}>
                {displayEdit ? 'Cancel Edit' : 'Edit Description'}
            </MenuItem>

            <MenuItem onClick={() => {
                handleMenuClose()
                handleDeletePost()
            }}>
                Delete Post
            </MenuItem>
        </Menu>
    );

    return (
        <>
            {/* display post */}
            {!displayEdit && (
                <Card
                    className='feedItem'
                    style={{ borderRadius: "10px 10px 10px 10px" }}
                >
                    {userInfo._id === postUserId ? (
                        // display cardH with option button for the post's owner
                        <CardHeader
                            style={{ width: "100%" }}
                            avatar={
                                <Avatar
                                    src={postUserPicturePath}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/users/${postUserId}`)}
                                ></Avatar>
                            }
                            action={
                                <IconButton
                                    aria-label="settings"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                        handlePostMenuOpen(e)
                                    }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={
                                <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/users/${postUserId}`)}
                                >
                                    {postFirstName + ' ' + postLastName}
                                </div>
                            }
                            subheader={formatDate}
                        />

                    ) : (

                        // display cardH without option button
                        <CardHeader
                            style={{ width: "100%" }}
                            avatar={
                                <Avatar
                                    src={postUserPicturePath}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/users/${postUserId}`)}
                                >
                                </Avatar>
                            }
                            title={
                                <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/users/${postUserId}`)}
                                >
                                    {postFirstName + ' ' + postLastName}
                                </div>
                            }
                            subheader={formatDate}
                        />
                    )}

                    {/* post description content */}
                    <div
                        className='postDescription'
                    >
                        {postDescription}
                    </div>

                    {postPicturePath ?
                        <CardMedia
                            style={{
                                padding: "16px 0px 0px 0px"
                            }}
                            component="img"
                            image={postPicturePath}
                            alt="post-img"
                        />
                        : ''}

                    <CardActions disableSpacing>
                        <IconButton
                            aria-label="add to favorites"
                            onClick={handleLikePost}
                        >
                            {isLiked ? (
                                < FavoriteIcon
                                    color='primary'
                                />
                            ) : (
                                < FavoriteIcon />
                            )}

                            <a
                                style={{
                                    fontSize: "18px"
                                }}
                            >
                                {likeCount}
                            </a>
                        </IconButton>
                    </CardActions>

                    {renderMenu}
                </Card >
            )}

            {/* update post */}
            {
                displayEdit && (
                    <div
                        className="feedItem"
                        style={{ borderRadius: "10px 10px 10px 10px" }}
                    >
                        <Card
                            className='createPostBar'
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    padding: "16px"
                                }}
                            >
                                <Avatar
                                    src={postUserPicturePath}
                                >
                                </Avatar>

                                {/* input bubble */}
                                <form
                                    className="prettyForm"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        justifyContent: "space-between",
                                        marginLeft: "16px"
                                    }}
                                    onSubmit={handleEditPostSubmit}
                                >
                                    <input
                                        type="text"
                                        style={{
                                            width: "100%",
                                            marginTop: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "25px",
                                            wordWrap: "break-word",
                                        }}
                                        value={updateDescription}
                                        onChange={(e) => {
                                            setUpdateDescription(e.target.value)
                                        }}
                                    >
                                    </input>

                                    <SendIcon
                                        color="primary"
                                        style={{
                                            marginLeft: "2px",
                                            marginRight: "2px",
                                            height: "40px",
                                            cursor: "pointer",
                                            color: "primary"
                                        }}
                                        onClick={handleEditPostSubmit}
                                    />
                                </form>

                                <div
                                    style={{
                                        margin: "-4px -8px -4px 0px"
                                    }}
                                >
                                    <IconButton
                                        aria-label="settings"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={(e) => {
                                            handlePostMenuOpen(e)
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <CardMedia
                                component="img"
                                image={postPicturePath}
                            />
                        </Card>

                        {renderMenu}
                    </div>
                )
            }
        </>
    )
}

export default DisplayPost
