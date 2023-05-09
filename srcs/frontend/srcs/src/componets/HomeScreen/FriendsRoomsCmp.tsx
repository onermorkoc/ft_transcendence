import { UserInfo } from "../../pages/HomeScreen"
import "../../ui-design/styles/CmpMix.css"

const FriendsRoomsCmp = (props: {data: Array<UserInfo>}) => {
    return (
        <>
            <p className="roomsHeader">Arkadaşlarım</p>
            <hr/>
            <div className="roomsBodyDiv">
                {
                    props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listView">
                                <img src={value.photoUrl} alt="" className="img4"/>
                                <div className="listViewInfoDiv">
                                    <p className="text5">Ad: {value.name}</p>
                                    <p className="text5">Durum: {value.status}</p>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default FriendsRoomsCmp