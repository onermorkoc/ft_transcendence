import { User } from "../../dto/DataObject"

const MyFriendsRoomCmp = (props: {data: Array<User>}) => {
    return(
        <>
            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={value.photoUrl} alt="" className="friendsAvatarImg"/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.displayname}</div>
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