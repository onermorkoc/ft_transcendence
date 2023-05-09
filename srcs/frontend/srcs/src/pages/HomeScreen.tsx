import { useState } from "react"
import "../ui-design/styles/HomeScreen.css"
import UserInfoCmp from "../componets/HomeScreen/UserInfoCmp"
import UserStatisticsCmp from "../componets/HomeScreen/UserStatisticsCmp"
import GameRoomsCmp from "../componets/HomeScreen/GameRoomsCmp"
import ChatRoomsCmp from "../componets/HomeScreen/ChatRoomsCmp"
import FriendsRoomsCmp from "../componets/HomeScreen/FriendsRoomsCmp"
import { ChatRooms, GameRooms, UserInfo } from "../App"

const HomeScreen = (props: {currentUser: UserInfo, gameRoomsList: Array<GameRooms>, chatRoomList: Array<ChatRooms>, friendsList: Array<UserInfo>}) => {

    const [tab,setTab] = useState<JSX.Element>(<UserInfoCmp data={props.currentUser} />)
    
    function editProfile(){
        const win: Window = window
        win.location = "/editprofile"
    }

    return (
        <>
            <div className="flexBox">
                <div className="row1">
                    <div className="row1-1">
                        <img src={props.currentUser.photoUrl} className="avatarImage" alt=""/>
                        <img onClick={editProfile} src={require("../ui-design/images/edit.png")} className="editProfileButton" alt=""/>
                    </div>
                    <div className="row1-2">
                        <div className="tabsFlexBox">
                            <div onClick={() => setTab(<UserInfoCmp data={props.currentUser}/>)} className="textTabDiv">Profil Bilgilerim</div>
                            <div onClick={() => setTab(<UserStatisticsCmp data={props.currentUser}/>)} className="textTabDiv">İstatistiklerim</div>
                            <img src={require("../ui-design/images/global-rank.png")} className="imgTabDiv"/>
                            <img src={require("../ui-design/images/setting.png")} className="imgTabDiv"/>
                        </div>
                        <div>
                            {tab}
                        </div>
                    </div>
                </div>
                <div className="row2">
                    <div className="roomsFlexBox">
                        <div className="gameRooms">{<GameRoomsCmp data={props.gameRoomsList}/>}</div>
                        <div className="chatRooms">{<ChatRoomsCmp data={props.chatRoomList}/>}</div>
                        <div className="friendsRooms">{<FriendsRoomsCmp data={props.friendsList}/>}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeScreen