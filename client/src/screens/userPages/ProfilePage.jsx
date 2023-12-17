import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from "react";
import { useGetUserProfilePostsMutation } from "../../state/postApiSlice";
import { useGetUserProfileMutation } from "../../state/userApiSlice";
import { clearUserInfo, setPosts } from "../../state/authSlice";
import DisplayPost from "../../components/widgets/DisplayPost";
import Leftbar from "../../components/Leftbar";
import Rightbar from "../../components/Rightbar";
import { toast } from 'react-toastify';
import { setIsMobile } from "../../state/authSlice";

const ProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    //handle screen size
    const { isMobile } = useSelector((state) => state.auth)
    const handleResize = useCallback(() => {
        if (window.innerWidth < 1500) {
            dispatch(setIsMobile(true))
        } else {
            dispatch(setIsMobile(false))
        }
    }, [dispatch])
    //init resize
    useEffect(() => {
        handleResize()
    }, [handleResize])
    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })

    //handle user
    const [user, setUser] = useState({})
    const [isUserAcc, setIsUserAcc] = useState(true)
    const [getUser] = useGetUserProfileMutation()
    const getUserApi = useCallback(async () => {
        try {
            const userId = params
            const res = await getUser(userId).unwrap()
            setUser(res)
        } catch (err) {
            toast.error('connection lost...', {
                toastId: '1'
            })
            setIsUserAcc(false)
        }
    }, [params, getUser, setUser])

    //handle posts
    const { posts } = useSelector((state) => state.auth)
    const [getPosts] = useGetUserProfilePostsMutation()
    const getPostsApi = useCallback(async () => {
        try {
            const userId = params
            const res = await getPosts(userId).unwrap()
            dispatch(setPosts({ posts: res }))
        } catch (err) {
            if (err?.data?.message === 'token not found') {
                dispatch(clearUserInfo())
                navigate('/login')
            } else {
                toast.error('connection lost...', {
                    toastId: '1'
                })
            }
        }
    }, [params, getPosts, dispatch, navigate])

    useEffect(() => {
        window.scrollTo(0, 0)
        getUserApi()
        getPostsApi()
    }, [getUserApi, getPostsApi])

    return (
        <>
            {!isMobile && isUserAcc && (
                <div className="container">
                    {/* LEFT SIDE BAR */}
                    <Leftbar
                        userProfile={user}
                        homePage={false}
                    ></Leftbar>

                    {/* CENTER POST'S FEED */}
                    <div className="feed">

                        {/* no posts */}
                        {(posts.length <= 0) && (
                            <div
                                style={{
                                    marginTop: "30px",
                                    minWidth: "100px"
                                }}
                            >
                                <a
                                    style={{
                                        color: "rgb(180, 180, 180)"
                                    }}
                                >
                                    no posts
                                </a>
                            </div>
                        )}

                        {
                            posts.map((
                                {
                                    _id,
                                    userId,
                                    firstName,
                                    lastName,
                                    description,
                                    likes,
                                    picturePath,
                                    userPicturePath,
                                    createdAt
                                }) => (

                                <DisplayPost
                                    key={_id}
                                    postId={_id}
                                    postUserId={userId}
                                    postFirstName={firstName}
                                    postLastName={lastName}
                                    postDescription={description}
                                    postLikes={likes}
                                    postPicturePath={picturePath}
                                    postUserPicturePath={userPicturePath}
                                    postDate={createdAt}
                                >
                                </DisplayPost>
                            ))
                        }
                    </div>

                    {/* RIGHT SIDE BAR */}
                    <Rightbar></Rightbar>
                </div >
            )}

            {isMobile && isUserAcc && (
                <div
                    className="containerMobile"
                >
                    {/* USER'S INFO */}
                    <Leftbar
                        userProfile={user}
                        homePage={false}
                    />

                    <div
                        style={{
                            borderBottom: "1px solid",
                            borderBottomColor: "lightgray"
                        }}
                    />

                    {/* CENTER POST'S FEED */}
                    <div
                        className="feed"
                    >
                        {/* if no posts */}
                        {(posts.length <= 0) && (
                            <div
                                style={{
                                    marginTop: "30px",
                                    minWidth: "100px"
                                }}
                            >
                                <a
                                    style={{
                                        color: "rgb(180, 180, 180)"
                                    }}
                                >
                                    no posts
                                </a>
                            </div>
                        )}

                        {
                            posts.map((
                                {
                                    _id,
                                    userId,
                                    firstName,
                                    lastName,
                                    description,
                                    likes,
                                    picturePath,
                                    userPicturePath,
                                    createdAt
                                }) => (

                                <DisplayPost
                                    key={_id}
                                    postId={_id}
                                    postUserId={userId}
                                    postFirstName={firstName}
                                    postLastName={lastName}
                                    postDescription={description}
                                    postLikes={likes}
                                    postPicturePath={picturePath}
                                    postUserPicturePath={userPicturePath}
                                    postDate={createdAt}
                                >
                                </DisplayPost>
                            ))
                        }
                    </div>
                </div >
            )}

            {
                (!isUserAcc && (
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <h1>user does not exist</h1>
                    </div>
                ))
            }

        </>
    )
}

export default ProfilePage