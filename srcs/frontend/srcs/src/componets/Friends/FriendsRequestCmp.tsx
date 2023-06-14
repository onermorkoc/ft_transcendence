import axios from "axios"
import { useEffect, useState } from "react"
import { RequestData, User } from "../../dto/DataObject"
import useCurrentUser from "../../services/Auth"
import { EmptyPage } from "./MyFriendsRoomCmp"

const FriendsRequestCmp = () => {

    const currentUser = useCurrentUser()
    const [usersInfo, setUsersInfo] = useState<Array<User> | null>()

    useEffect(() => {
        if (currentUser && !usersInfo)
            axios.get(`/friends/${currentUser.id}/received-requests`).then(response => setUsersInfo(response.data))
    }, [currentUser, usersInfo])

    const acceptRequest = (value: User) => {
        const postData: RequestData = {
            senderId: value.id,
            receiverId: currentUser!!.id
        }
        axios.post(`/friends/accept`, postData).then(() => {
            setUsersInfo(usersInfo!!.filter(predicate => predicate !== value))
        })
    }

    const rejectRequest = (value: User) => {
        const postData: RequestData = {
            senderId: value.id,
            receiverId: currentUser!!.id
        }
        axios.post(`/friends/reject`, postData).then(() => {
            setUsersInfo(usersInfo!!.filter(predicate => predicate !== value))
        })
    }

    return (
        <>
            {
                !usersInfo || usersInfo?.length === 0 ? <EmptyPage/>
                :
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
                                <img className="rejectImg" onClick={() => rejectRequest(value)} src={require("../../ui-design/images/reject.png")} alt=""/>
                                <img className="acceptImg" onClick={() => acceptRequest(value)} src={require("../../ui-design/images/accept.png")} alt=""/>
                            </div>
                        </div>
                    ))
                }
            </div>
            }
        </>
    )
}

export default FriendsRequestCmp