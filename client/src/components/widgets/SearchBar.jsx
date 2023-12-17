import { useState } from "react"
import { useSearchUserMutation } from "../../state/userApiSlice"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

const SearchBar = () => {
    const [input, setInput] = useState('')
    const [results, setResults] = useState([])
    const [displayList, setDisplayList] = useState(false)
    const [searchUser] = useSearchUserMutation()

    const navigate = useNavigate()

    const fetchData = async (value) => {
        try {
            const res = await searchUser({ search: value }).unwrap()
            setResults(res)
        } catch (err) {
            toast.dismiss();
            toast.error('connection lost...', {
                toastId: '1'
            })
        }
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    return (
        <>
            <div
                className="searchContainer"
            >
                <form
                    className="prettyForm"
                    style={{
                        height: "30px"
                    }}
                    onSubmit={(e) => { e.preventDefault() }}
                >
                    <input
                        style={{ width: "100%" }}
                        type="text"
                        placeholder="Search user..."
                        value={input}
                        onChange={(e) => {
                            handleChange(e.target.value)
                        }}
                        onFocus={() => setDisplayList(true)}
                    >
                    </input>
                </form>

                {(input.length > 0) && (
                    <Card
                        style={{
                            borderRadius: "5px 5px 5px 5px",
                            WebkitBoxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)",
                            MozBoxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)",
                            boxShadow: "1px 3px 25px 0px rgba(123, 123, 123, 1)"
                        }}
                        className={displayList ? "searchItem" : "hidden"}
                    >
                        <List
                            className="searchItem"
                        >
                            {results?.map((user) => {
                                return (
                                    <ListItem
                                        key={user._id}
                                        disablePadding
                                        style={{
                                            alignItems: "flex-start",
                                            width: "100%"
                                        }}
                                        onClick={() => {
                                            navigate(`/users/${user._id}`)
                                            setDisplayList(false)
                                        }}
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={"user_img"}
                                                    src={user.picturePath}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primary={user.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}

                            {(results.length <= 0) && (
                                <ListItem
                                    disablePadding
                                    style={{
                                        alignItems: "flex-start",
                                        width: "100%",
                                        marginLeft: "25px"
                                    }}
                                >
                                    <ListItemText
                                        secondary='no results...'
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                )}
            </div >
        </>
    )
}

export default SearchBar