import { useState } from "react"
import "../ui-design/styles/HomeScreen.css"
import UserInfoCmp from "../componets/UserInfoCmp"
import UserStatisticsCmp from "../componets/UserStatisticsCmp"
import GameRoomsCmp from "../componets/GameRoomsCmp"
import ChatRoomsCmp from "../componets/ChatRoomsCmp"
import FriendsRoomsCmp from "../componets/FriendsRoomsCmp"
import { ChatRooms, GameRooms, UserInfo } from "../App"

const HomeScreen = (props: {currentUser: UserInfo, gameRoomsList: Array<GameRooms>, chatRoomList: Array<ChatRooms>, friendsList: Array<UserInfo>}) => {

    const [tab, setTab] = useState<JSX.Element>(<UserInfoCmp data={props.currentUser} />)
    
    function editProfile(){
        const win: Window = window
        win.location = "/editprofile"
    }

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{flex: "30vh"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{width: "280px"}}>
                            <div style={{margin: "10px"}}>
                                <img src={props.currentUser.photoUrl} className="homeAvatarImg" alt=""/>
                                <img onClick={editProfile} src={require("../ui-design/images/edit.png")} className="editProfileButton" alt=""/>
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div onClick={() => setTab(<UserInfoCmp data={props.currentUser}/>)} className="textTabDiv">Profil Bilgilerim</div>
                                        <div onClick={() => setTab(<UserStatisticsCmp data={props.currentUser}/>)} className="textTabDiv">İstatistiklerim</div>
                                        <img src={require("../ui-design/images/global-rank.png")} className="imgTabDiv" alt=""/>
                                        <img src={require("../ui-design/images/setting.png")} className="imgTabDiv" alt=""/>
                                    </div>
                                </div>
                                <div>
                                    {tab}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{flex: "70vh"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="roomsDiv">{<GameRoomsCmp data={props.gameRoomsList}/>}</div>
                        <div className="roomsDiv">{<ChatRoomsCmp data={props.chatRoomList}/>}</div>
                        <div className="roomsDiv">{<FriendsRoomsCmp data={props.friendsList}/>}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeScreen