import { UserInfo } from "../../App"
import "../../ui-design/styles/CmpMix.css"

const FriendsRoomsCmp = (props: {data: Array<UserInfo>}) => {
    return (
        <>
            <div className="roomsHeader">Arkadaşlarım</div>
            
            <div className="roomsBodyDiv">
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

export default FriendsRoomsCmp