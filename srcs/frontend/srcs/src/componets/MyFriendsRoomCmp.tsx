import { UserInfo } from "../App"

const MyFriendsRoomCmp = (props: {data: Array<UserInfo>}) => {
    return(
        <>
            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={value.photoUrl} alt="" className="friendsAvatarImg"/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.name}</div>
                                    <div>Durum: {value.status}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default MyFriendsRoomCmp