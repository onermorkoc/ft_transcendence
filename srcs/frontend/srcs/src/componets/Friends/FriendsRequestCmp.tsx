import axios from "axios"
import { useEffect, useState } from "react"
import { RequestData, User } from "../../dto/DataObject"

const FriendsRequestCmp = () => {

    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ friendRequests, setFriendRequests ] = useState<Array<RequestData> | null>(null)
    const [ usersInfo, setUsersInfo ] = useState<Array<User>>([])

    useEffect(() => {

        if (!currentUser)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/current`).then(response => setCurrentUser(response.data))
        
        if (currentUser && !friendRequests)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/friends/${currentUser.id}/received-requests`).then(response => setFriendRequests(response.data))

        if (friendRequests){
            friendRequests.forEach((value) => {
                axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/${value.senderId}`).then(response => setUsersInfo([...usersInfo, response.data]))
            })
        }

    }, [currentUser, friendRequests])

    const acceptRequest = (senderId: number) => {
        const postData: RequestData = {
            senderId: senderId,
            receiverId: currentUser!!.id
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/friends/accept`, postData).then(() => {
            setFriendRequests(null)
            setUsersInfo([])
        })
    }

    const rejectRequest = (senderId: number) => {
        const postData: RequestData = {
            senderId: senderId,
            receiverId: currentUser!!.id
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/friends/reject`, postData).then(() => {
            setFriendRequests(null)
            setUsersInfo([])
        })
    }

    return (
        <>
            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    usersInfo?.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv">
                                <img className="friendsAvatarImg" src={value.photoUrl} alt=""/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.displayname}</div>
                                    <div>Nickname: {value.nickname}</div>
                                </div>
                                <img className="rejectImg" onClick={() => rejectRequest(value.id)} src={require("../../ui-design/images/reject.png")} alt=""/>
                                <img className="acceptImg" onClick={() => acceptRequest(value.id)} src={require("../../ui-design/images/accept.png")} alt=""/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default FriendsRequestCmp