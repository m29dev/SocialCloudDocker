/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DisplayChat from "../../components/widgets/DisplayChat"
import Leftbar from "../../components/Leftbar"
import Rightbar from "../../components/Rightbar"
import { useGetChatMutation, useSendChatMutation } from "../../state/chatApiSlice"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback } from "react"
import { toast } from 'react-toastify';
import { setIsMobile } from "../../state/authSlice"
import { clearUserInfo } from "../../state/authSlice"

const ChatPage = ({ socket }) => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)

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

    //CHAT CONFIG
    const [currentMessage, setCurrentMessage] = useState('')
    const [newMsgList, setNewMsgList] = useState([])
    const [msgList, setMsgList] = useState([])
    const [chatUser, setChatUser] = useState({})

    //GET CHAT DATA 
    const [getChat] = useGetChatMutation()
    const getChatApi = useCallback(async () => {
        try {
            const id = params.id
            const res = await getChat({ userId: userInfo._id, friendId: id }).unwrap()
            //add res to msg array
            setMsgList(res)
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
    }, [params, userInfo, getChat, dispatch, navigate])

    const [sendChat] = useSendChatMutation()
    const sendChatApi = async () => {
        try {
            await sendChat({
                userId: userInfo._id, friendId: chatUser._id, message: {
                    content: currentMessage,
                    sender: userInfo._id,
                    receiver: chatUser._id
                }
            }).unwrap()
        } catch (err) {
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }
    const handleSendMessage = (e) => {
        e.preventDefault()
        if (currentMessage !== '') {
            //send chat API
            sendChatApi()

            //send real-time message
            socket.emit("sendPrivateMessage", {
                content: currentMessage,
                receiver: chatUser._id
            })
            setMsgList(list => [...list, { content: currentMessage, sender: userInfo._id, receiver: chatUser._id }])
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = params.id
        userInfo.friends.map(friend => {
            if (friend._id === id) {
                setChatUser({
                    _id: friend._id,
                    _socketId: friend._socketId,
                    name: friend.firstName + ' ' + friend.lastName,
                    picturePath: friend.picturePath
                })
            }
        })
        setMsgList([])
        getChatApi()
    }, [params, userInfo, getChatApi, setMsgList])

    useEffect(() => {
        socket.on('receivePrivateMessage', (data) => {
            setNewMsgList(list => [...list, data])
        })
    }, [socket, newMsgList])

    useEffect(() => {
        setMsgList(list => [...list, newMsgList.pop()])
    }, [newMsgList])

    return (
        <>
            {!isMobile && (
                <div className="container">
                    {/* LEFT SIDE BAR */}
                    <Leftbar
                        userProfile={userInfo}
                        homePage={true}
                    ></Leftbar>

                    {/* CHAT */}
                    <DisplayChat
                        socket={socket}
                        chatUser={chatUser}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        handleSendMessage={handleSendMessage}
                        messageList={msgList}
                    />

                    {/* RIGHT SIDE BAR */}
                    <Rightbar />
                </div>
            )}

            {isMobile && (
                <div
                    className="containerMobile"
                >
                    {/* CHAT */}
                    <DisplayChat
                        socket={socket}
                        chatUser={chatUser}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        handleSendMessage={handleSendMessage}
                        messageList={msgList}
                    />
                </div>
            )}
        </>
    )
}

export default ChatPage
