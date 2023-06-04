import { useEffect, useState } from "react"
import { User } from "../../dto/DataObject"
import axios from "axios"

const MyFriendsRoomCmp = () => {

    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ usersInfo, setUsersInfo ] = useState<Array<User>>([])

    useEffect(() => {

        if (!currentUser)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/current`).then(response => setCurrentUser(response.data))

        if (currentUser){
            currentUser.friendIds.forEach((value) => {
                axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/${value}`).then(response => setUsersInfo([...usersInfo, response.data]))
            })
        }
    }, [currentUser])

    const unFriend = (id: number) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/users/unfriend`, {id: id}).then(() => {
            // burada arkadaslarım lıste yenılemesı yapılacak
        })
    }

    return(
        <>
            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    usersInfo.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv">
                                <img className="friendsAvatarImg" src={value.photoUrl} alt=""/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.displayname}</div>
                                    <div>Durum: {value.status}</div>
                                </div>
                                <img className="unFriendImg" onClick={() => unFriend(value.id)} src={require("../../ui-design/images/unfriend.png")} alt=""/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default MyFriendsRoomCmp