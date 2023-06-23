import { useEffect, useState } from "react"
import { User } from "../../dto/DataObject"
import axios from "axios"
import Lottie from "lottie-react"

export const EmptyPage = (): JSX.Element => {
    return (
        <Lottie style={{marginLeft: "auto", marginRight: "auto", width: "300px", marginTop: "50px"}} animationData={require("../../ui-design/animation/empty.json")}/>
    )
}

const MyFriendsRoomCmp = () => {

    const [usersInfo, setUsersInfo] = useState<Array<User> | null>(null)

    const unFriend = (value: User) => {
        axios.post(`/friends/unfriend`, {userId: value.id}).then(() => {
            setUsersInfo(usersInfo!!.filter(predicate => predicate !== value))
        })
    }

    const goDirectMessagePage = (userId: number) => {
        window.location.assign(`/directmessage/${userId}`)
    }
    
    useEffect(() => {
        if (!usersInfo)
            axios.get(`/friends/myfriends`).then( response => setUsersInfo(response.data))
    }, [usersInfo])

    return(
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
                                        <div onClick={() => goDirectMessagePage(value.id)} className="listViewInfoDiv">
                                            <div>Ad: {value.displayname}</div>
                                            <div>Durum:
                                                {
                                                    value.status === "ONLINE" ? 
                                                        <span style={{color: "green"}}> {value.status}</span>
                                                    :
                                                        <span style={{color: "red"}}> {value.status}</span>
                                                }
                                            </div>
                                        </div>
                                        <img className="unFriendImg" onClick={() => unFriend(value)} src={require("../../ui-design/images/unfriend.png")} alt=""/>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
            }
        </>
    )
}

export default MyFriendsRoomCmp