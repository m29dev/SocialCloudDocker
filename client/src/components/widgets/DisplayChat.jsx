/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Card } from "@mui/material";
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    List,
} from "@mui/material"
import PeopleIcon from '@mui/icons-material/People';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DisplayChat = ({ chatUser, currentMessage, setCurrentMessage, handleSendMessage, messageList }) => {
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)

    //handle screen size
    const { isMobile } = useSelector((state) => state.auth)

    //handle display chat contacts on mobile screens
    const [showChatContacts, setShowChatContacts] = useState(false)

    return (
        <>
            {/* Main container */}
            <Card
                className="chatItemContainer"
                style={{
                    maxWidth: isMobile ? "100%" : "90%"
                }}
            >

                {/* display chat contacts on mobile screens */}
                {isMobile && showChatContacts && userInfo?.friends && (
                    <div
                        style={{
                            borderRadius: "5px 5px 5px 5px",
                            WebkitBoxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)",
                            MozBoxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)",
                            boxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)",
                            alignSelf: "flex-end",
                            marginTop: "70px"
                        }}
                        className="searchItem"
                    >
                        <List
                            sx={{
                                width: '100%',
                                maxWidth: 360,
                            }}
                            className="searchItem"
                        >
                            {
                                (
                                    userInfo?.friends.map((friend) => (
                                        <ListItem
                                            alignItems="flex-start"
                                            key={friend._id}
                                            onClick={() => {
                                                navigate(`/chat/${friend._id}`)
                                                setShowChatContacts(false)
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                padding: "0px 16px",
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={friend.picturePath}
                                                />
                                            </ListItemAvatar>

                                            <h1
                                                style={{
                                                    fontSize: "20px",
                                                    color: "rgb(70, 70, 70)"
                                                }}
                                            >
                                                {friend.firstName + ' ' + friend.lastName}
                                            </h1>
                                        </ListItem>
                                    ))
                                )
                            }

                            {
                                (userInfo.friends.length <= 0) && (
                                    <div
                                        style={{
                                            padding: "0px",
                                            marginRight: "16px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <a
                                            style={{
                                                color: "rgb(180, 180, 180)"
                                            }}
                                        >
                                            add friends to see chat contacts
                                        </a>
                                    </div>
                                )
                            }
                        </List>
                    </div>
                )}

                <ListItem
                    style={{
                        padding: "16px",
                        marginLeft: "8px",
                        display: "flex",
                        flexDirection: "row",
                        alignItem: "center"
                    }}
                >
                    <ListItemAvatar>
                        <Avatar
                            src={chatUser.picturePath}
                        />
                    </ListItemAvatar>

                    <h1
                        style={{
                            fontSize: "20px",
                            color: "rgb(70, 70, 70)"
                        }}
                    >
                        {chatUser.name}
                    </h1>

                    <div
                        style={{
                            flexGrow: "1"
                        }}
                    />

                    {/* display onClick droplist of contacts on mobile screens */}
                    {isMobile && (
                        <PeopleIcon
                            style={{
                                marginRight: "16px",
                                cursor: "pointer"
                            }}
                            onClick={() => setShowChatContacts(!showChatContacts)}
                        />
                    )}
                </ListItem>

                <div
                    style={{
                        borderBottom: "1px solid",
                        borderBottomColor: "lightgray",
                        marginLeft: "23px",
                        marginRight: "23px",
                        marginBottom: "16px"
                    }}
                />

                <ScrollToBottom
                    className={isMobile ? "chatMobile" : "chat"}
                >
                    {messageList?.map(msg =>
                        (msg?.sender === chatUser?._id) ? (
                            <div key={Math.random()} className="yours messages">
                                <div className="message">
                                    {msg?.content}
                                </div>
                            </div>
                        ) : ((msg?.sender === userInfo?._id) ? (
                            <div key={Math.random()} className="mine messages">
                                <div className="message">
                                    {msg?.content}
                                </div>
                            </div>
                        ) : (''))
                    )}
                </ScrollToBottom>

                <form
                    className="prettyForm"
                    onSubmit={handleSendMessage}
                    style={{
                        height: "40px",
                        marginLeft: "16px",
                        marginRight: "16px",
                        marginTop: "16px",
                        marginBottom: "16px"
                    }}
                >
                    <input
                        onChange={(e) => { setCurrentMessage(e.target.value) }}
                        value={currentMessage}
                        placeholder="write a message..."
                    >
                    </input>
                    <SendIcon
                        color="primary"
                        style={{
                            height: "40px",
                            cursor: "pointer",
                            color: "primary"
                        }}
                        onClick={handleSendMessage}
                    />
                    <button className="hidden" />
                </form>
            </Card >
        </>
    )
}

export default DisplayChat