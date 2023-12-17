/* eslint-disable react/prop-types */
import React from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import {
    Avatar,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useAddRemoveFriendMutation } from "../state/userApiSlice"
import { setUserInfo } from "../state/authSlice"
import { useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast } from "react-toastify"

const Leftbar = ({ userProfile, homePage }) => {
    let user = userProfile
    const [showFriendsList, setShowFriendsList] = useState(false)
    const { userInfo } = useSelector((state) => state.auth)
    //handle screen size
    const { isMobile } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    //handle +/- friend
    const isFriend = userInfo.friends.find((friend) => friend._id === params.id)
    const [addRemoveFriend] = useAddRemoveFriendMutation()
    const handleAddRemoveFriend = async () => {
        const friendId = params.id
        try {
            const res = await addRemoveFriend({ id: userInfo._id, friendId }).unwrap()
            if (res) {
                //update userInfo's friends list
                dispatch(setUserInfo(res))
            }
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    return (
        <>
            {!isMobile && (
                <div className="leftBar">
                    <div style={{
                        position: "fixed",
                        top: "50",
                        width: "350px"
                    }}>

                        {/* user's profile informations (Profile Page) */}
                        {(!homePage && (
                            <div
                                className='leftBarItem'
                            >
                                <Avatar
                                    alt="user-img"
                                    src={user.picturePath}
                                    style={{ width: 150, height: 150, marginTop: "30px" }}
                                />

                                <h1>{user.firstName} {user.lastName}</h1>

                                <CardContent className="userInfo">
                                    <Typography variant="body" color="text.secondary">
                                        Work:
                                    </Typography>
                                    <Typography variant="body" color="text.primary">
                                        {'  ' + user.occupation}
                                    </Typography>

                                    <br />

                                    <Typography variant="body" color="text.secondary">
                                        From:
                                    </Typography>
                                    <Typography variant="body" color="text.primary">
                                        {'  ' + user.location}
                                    </Typography>
                                </CardContent>

                                {/* display add/remove friend option */}
                                {
                                    ((userInfo._id !== params.id) && isFriend && (
                                        <CardActions disableSpacing>
                                            <a>remove friend</a>
                                            <IconButton aria-label="add to friends" onClick={handleAddRemoveFriend}>
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        </CardActions>
                                    ))
                                }

                                {
                                    ((userInfo._id !== params.id) && !isFriend && !homePage && (
                                        <CardActions disableSpacing>
                                            <a>add friend</a>
                                            <IconButton aria-label="add to friends" onClick={handleAddRemoveFriend}>
                                                <PersonAddIcon />
                                            </IconButton>
                                        </CardActions>
                                    ))
                                }
                            </div >
                        ))}

                        {/* user's profile informations (Home Page) */}
                        {homePage && (
                            <>
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => navigate(`/users/${userInfo._id}`)}
                                    style={{
                                        padding: "0px",
                                        marginLeft: "16px",
                                        marginTop: "16px",
                                        marginBottom: "16px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={userInfo.picturePath}
                                        />
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={userInfo.firstName + ' ' + userInfo.lastName}
                                        secondary={
                                            <React.Fragment>
                                                {userInfo.occupation + ', ' + userInfo.location}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </>
                        )}

                        <div
                            style={{
                                borderBottom: "1px solid",
                                borderBottomColor: "lightgray",
                                marginLeft: "16px"
                            }}
                        />

                        {/* user's friend's list*/}
                        {(homePage && user.friends && (
                            <div
                                className='feedItem'
                                style={{
                                    maxHeight: "800px",
                                    marginTop: "0px"
                                }}
                            >
                                <List sx={{
                                    width: '100%'
                                }}>
                                    <ListItem >
                                        <ListItemText
                                            onClick={() => setShowFriendsList(!showFriendsList)}
                                        >
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    justifyContent: "flex-start"
                                                }}
                                            >
                                                <React.Fragment>
                                                    {user._id === userInfo._id ? `YOUR FRIENDS LIST` : `${(user.firstName).toUpperCase()}'s FRIENDS LIST`}
                                                </React.Fragment>
                                                {showFriendsList ? (
                                                    <ExpandMoreIcon></ExpandMoreIcon>
                                                ) : (
                                                    <ExpandLessIcon></ExpandLessIcon>
                                                )}
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                    {
                                        (showFriendsList && (
                                            user.friends.map((friend) => (
                                                <ListItem
                                                    alignItems="flex-start"
                                                    key={friend._id}
                                                    onClick={() => navigate(`/users/${friend._id}`)}
                                                    style={{
                                                        padding: "0px",
                                                        marginLeft: "16px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={friend.picturePath}
                                                        />
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={friend.firstName + ' ' + friend.lastName}
                                                        secondary={
                                                            <React.Fragment>
                                                                {friend.occupation + ', ' + friend.location}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            ))
                                        ))
                                    }

                                    {
                                        (showFriendsList && (
                                            user.friends.length <= 0) && (
                                                <div
                                                    style={{
                                                        padding: "0px",
                                                        marginLeft: "16px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <a
                                                        style={{
                                                            color: "rgb(199, 199, 199)"
                                                        }}
                                                    >
                                                        friends list is empty
                                                    </a>
                                                </div>
                                            ))
                                    }
                                </List>
                            </div>
                        ))}

                        {(!homePage && user.friends && (
                            <div
                                className='feedItem'
                                style={{
                                    maxHeight: "800px",
                                    marginTop: "0px"
                                }}
                            >
                                <List sx={{
                                    width: '100%'
                                }}>
                                    <ListItem >
                                        <ListItemText>
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    justifyContent: "flex-start"
                                                }}
                                            >
                                                <React.Fragment>
                                                    {user._id === userInfo._id ? `YOUR FRIENDS LIST` : `${(user.firstName).toUpperCase()}'S FRIENDS LIST`}
                                                </React.Fragment>
                                            </div>
                                        </ListItemText>
                                    </ListItem>

                                    {
                                        (
                                            user.friends.map((friend) => (
                                                <ListItem
                                                    alignItems="flex-start"
                                                    key={friend._id}
                                                    onClick={() => navigate(`/users/${friend._id}`)}
                                                    style={{
                                                        padding: "0px",
                                                        marginLeft: "16px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={friend.picturePath}
                                                        />
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={friend.firstName + ' ' + friend.lastName}
                                                        secondary={
                                                            <React.Fragment>
                                                                {friend.occupation + ', ' + friend.location}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            ))
                                        )
                                    }

                                    {
                                        (
                                            user.friends.length <= 0) && (
                                            <div
                                                style={{
                                                    padding: "0px",
                                                    marginLeft: "16px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <a
                                                    style={{
                                                        color: "rgb(180, 180, 180)"
                                                    }}
                                                >
                                                    friends list is empty
                                                </a>
                                            </div>
                                        )
                                    }
                                </List>
                            </div>
                        ))}
                    </div>
                </div >
            )}

            {isMobile && (
                <div
                    className="leftBar"
                >
                    <>
                        {/* user's profile informations (Profile Page) */}
                        {(!homePage && (
                            <>
                                <div
                                    className='leftBarItem'
                                >
                                    <Avatar
                                        alt="user-img"
                                        src={user.picturePath}
                                        style={{ width: 150, height: 150, marginTop: "30px" }}
                                    />

                                    <h1>{user.firstName} {user.lastName}</h1>

                                    <CardContent className="userInfo">
                                        <Typography variant="body" color="text.secondary">
                                            Work:
                                        </Typography>
                                        <Typography variant="body" color="text.primary">
                                            {'  ' + user.occupation}
                                        </Typography>

                                        <br />

                                        <Typography variant="body" color="text.secondary">
                                            From:
                                        </Typography>
                                        <Typography variant="body" color="text.primary">
                                            {'  ' + user.location}
                                        </Typography>
                                    </CardContent>

                                    {/* display add/remove friend option */}
                                    {
                                        ((userInfo._id !== params.id) && isFriend && (
                                            <CardActions disableSpacing>
                                                <a>remove friend</a>
                                                <IconButton aria-label="add to friends" onClick={handleAddRemoveFriend}>
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </CardActions>
                                        ))
                                    }

                                    {
                                        ((userInfo._id !== params.id) && !isFriend && !homePage && (
                                            <CardActions disableSpacing>
                                                <a>add friend</a>
                                                <IconButton aria-label="add to friends" onClick={handleAddRemoveFriend}>
                                                    <PersonAddIcon />
                                                </IconButton>
                                            </CardActions>
                                        ))
                                    }
                                </div >
                            </>
                        ))}

                        {/* user's friend's list*/}
                        {(!homePage && user.friends && (
                            <div
                                className='feedItem'
                                style={{
                                    maxHeight: "800px",
                                    marginTop: "0px"
                                }}
                            >
                                <List sx={{
                                    width: '100%'
                                }}>
                                    <ListItem >
                                        <ListItemText
                                            onClick={() => setShowFriendsList(!showFriendsList)}
                                        >
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <React.Fragment>
                                                    {user._id === userInfo._id ? `YOUR FRIENDS LIST` : `${(user.firstName).toUpperCase()}'s FRIENDS LIST`}
                                                </React.Fragment>
                                                {showFriendsList ? (
                                                    <ExpandMoreIcon></ExpandMoreIcon>
                                                ) : (
                                                    <ExpandLessIcon></ExpandLessIcon>
                                                )}
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                    {
                                        (showFriendsList && (
                                            user.friends.map((friend) => (
                                                <ListItem
                                                    alignItems="flex-start"
                                                    key={friend._id}
                                                    onClick={() => navigate(`/users/${friend._id}`)}
                                                    style={{
                                                        padding: "0px",
                                                        marginLeft: "16px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={friend.picturePath}
                                                        />
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={friend.firstName + ' ' + friend.lastName}
                                                        secondary={
                                                            <React.Fragment>
                                                                {friend.occupation + ', ' + friend.location}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            ))
                                        ))
                                    }

                                    {
                                        (showFriendsList && (
                                            user.friends.length <= 0) && (
                                                <div
                                                    style={{
                                                        padding: "0px",
                                                        marginLeft: "16px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <a
                                                        style={{
                                                            color: "rgb(199, 199, 199)"
                                                        }}
                                                    >
                                                        friends list is empty
                                                    </a>
                                                </div>
                                            ))
                                    }
                                </List>
                            </div>
                        ))}
                    </>
                </div >
            )}
        </>
    )
}

export default Leftbar