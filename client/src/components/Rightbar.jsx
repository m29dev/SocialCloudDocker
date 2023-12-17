import React from "react"
import { useSelector } from "react-redux"
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

const Rightbar = () => {
    const { userInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    return (
        <>
            <div className="rightBar">
                <div
                    style={{
                        position: "fixed",
                        top: "50",
                        width: "350px"
                    }}
                >

                    {/* chat contacts */}
                    {(userInfo?.friends && (
                        <div
                            className='feedItem'
                            style={{ maxHeight: "800px" }}
                        >
                            <List sx={{
                                width: '100%',
                                maxWidth: 360,
                            }}>
                                <ListItem
                                    style={{
                                        padding: "0px"
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                {`CHAT CONTACTS`}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>

                                {
                                    (
                                        userInfo?.friends.map((friend) => (
                                            <ListItem
                                                alignItems="flex-start"
                                                key={friend._id}
                                                onClick={() => navigate(`/chat/${friend._id}`)}
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "0px",
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
                    ))}

                    <div
                        style={{
                            borderBottom: "1px solid",
                            borderBottomColor: "lightgray",
                            marginRight: "16px"
                        }}
                    />
                </div>
            </div >
        </>
    )
}

export default Rightbar