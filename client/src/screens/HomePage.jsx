import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react";
import { useGetPostsMutation } from "../state/postApiSlice";
import { clearUserInfo, setPosts } from "../state/authSlice";
import CreatePost from "../components/widgets/CreatePost";
import DisplayPost from "../components/widgets/DisplayPost";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { setIsMobile } from "../state/authSlice";

const HomePage = () => {
    const { posts } = useSelector((state) => state.auth)
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [getPosts] = useGetPostsMutation()

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

    const getPostsApi = useCallback(async () => {
        try {
            const res = await getPosts({ id: userInfo._id }).unwrap()
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
    }, [getPosts, dispatch, userInfo, navigate])

    useEffect(() => {
        window.scrollTo(0, 0)
        getPostsApi()
    }, [getPostsApi])

    return (
        <>
            {!isMobile && (
                <div className="container">
                    {/* LEFT SIDE BAR */}
                    <Leftbar
                        userProfile={userInfo}
                        homePage={true}
                    ></Leftbar>

                    {/* CENTER POST'S FEED */}
                    <div className="feed">
                        <CreatePost></CreatePost>

                        {/* no posts */}
                        {(posts.length <= 0) && (
                            <div
                                style={{
                                    marginTop: "30px"
                                }}
                            >
                                <a
                                    style={{
                                        color: "rgb(180, 180, 180)"
                                    }}
                                >
                                    add friends to see their posts
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

            {isMobile && (
                <div
                    className="containerMobile"
                >
                    {/* CENTER POST'S FEED */}
                    <div className="feed">
                        <CreatePost></CreatePost>
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
        </>
    )
}

export default HomePage