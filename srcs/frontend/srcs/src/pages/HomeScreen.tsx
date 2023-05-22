import { useEffect, useState } from "react"
import "../ui-design/styles/HomeScreen.css"
import UserInfoCmp from "../componets/UserInfoCmp"
import UserStatisticsCmp from "../componets/UserStatisticsCmp"
import GameRoomsCmp from "../componets/GameRoomsCmp"
import ChatRoomsCmp from "../componets/ChatRoomsCmp"
import FriendsRoomsCmp from "../componets/FriendsRoomsCmp"
import { useParams } from "react-router-dom"
import axios from "axios"
import { User } from "../dto/DataObject"

const HomeScreen = () => {

    const { nickname } = useParams()
    const [currentUserData, setCurrentUserData] = useState<User | null>(null)

    const getCurrentUserInfo = async (): Promise<User>  => {
        return ((await axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/${nickname}`)).data)
    }

    getCurrentUserInfo().then((response) => {
        setCurrentUserData(response)
    })

    function editProfile(){
        window.location.assign(`/editprofile/${nickname}`)
    }
    const [tab, setTab] = useState<JSX.Element | null>(null)

    const view = (): JSX.Element => {
        if (currentUserData){

            setTab(<UserInfoCmp data={currentUserData}/>)

            return (
                <>
                    <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flex: "30vh"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{width: "280px"}}>
                            <div style={{margin: "10px"}}>
                                <img src={currentUserData.photourl} className="homeAvatarImg" alt=""/>
                                <img onClick={editProfile} src={require("../ui-design/images/edit.png")} className="editProfileButton" alt=""/>
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div onClick={() => setTab(<UserInfoCmp data={currentUserData}/>)} className="textTabDiv">Profil Bilgilerim</div>
                                        <div onClick={() => setTab(<UserStatisticsCmp data={currentUserData}/>)} className="textTabDiv">İstatistiklerim</div>
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
                                <div className="roomsDiv">{<GameRoomsCmp data={[]}/>}</div>
                                <div className="roomsDiv">{<ChatRoomsCmp data={[]}/>}</div>
                                <div className="roomsDiv">{<FriendsRoomsCmp data={[]}/>}</div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        return (
            <>
                <div>Veri Çekiliyor</div>
            </>
        )
    }

    return (
        <>
            {view()}
        </>
    )
}

export default HomeScreen