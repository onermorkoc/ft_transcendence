import { useState } from "react"
import { UserInfo } from "../App"
import "../ui-design/styles/CmpMix.css"
import MyFriendsRoomCmp from "./MyFriendsRoomCmp"
import SearchUserCmp from "./SearchUserCmp"

const FriendsRoomsCmp = (props: {data: Array<UserInfo>}) => {

    const [friendsTab, setFriendsTab] = useState<JSX.Element>(<MyFriendsRoomCmp data={props.data}/>)

    return (
        <>
            <div className="roomsHeader">Kullanıcılar</div>
            <div className="roomsBodyDiv">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <button onClick={() => setFriendsTab(<MyFriendsRoomCmp data={props.data}/>)} className="roomsButton">Arkadaşlarım</button>
                    <button onClick={() => setFriendsTab(<SearchUserCmp/>)} className="roomsButton">Kullanıcı ara</button>
                </div>
                <hr/>
                {friendsTab}
            </div>
        </>
    )
}

export default FriendsRoomsCmp