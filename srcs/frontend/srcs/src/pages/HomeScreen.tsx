import { useEffect, useState } from "react"
import "../ui-design/styles/HomeScreen.css"
import UserInfoCmp from "../componets/Header/UserInfoCmp"
import axios from "axios"
import { User } from "../dto/DataObject"
import RandomMatchGameCmp from "../componets/Game/RandomMatchGameCmp"
import UserStatisticsCmp from "../componets/Header/UserStatisticsCmp"
import ChatRoomsCmp from "../componets/Chat/ChatRoomsCmp"
import FriendsRoomsCmp from "../componets/Friends/FriendsRoomsCmp"

const HomeScreen = () => {

    const [ currentUserInfo, setCurrentUserInfo ] = useState<User | null>(null)
    const [ tab, setTab ] = useState<JSX.Element | null>(null)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/user/current`).then((response) => {
            setCurrentUserInfo(response.data)
        })
    }, [])

    const editProfile = (): void => {
        window.location.assign(`/editprofile`)
    }

    const goMatchHistoryPage = () => {
        //window.location.assign("/history")
    }

    if (currentUserInfo){

        if (tab == null)
            setTab(<UserInfoCmp data={currentUserInfo}/>)
            
        return (
            <>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flex: "30vh"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{width: "280px"}}>
                                <div style={{margin: "10px"}}>
                                    <img src={currentUserInfo.photoUrl} className="homeAvatarImg" alt=""/>
                                    <img onClick={editProfile} src={require("../ui-design/images/edit.png")} className="editProfileButton" alt=""/>
                                </div>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <div onClick={() => setTab(<UserInfoCmp data={currentUserInfo}/>)} className="textTabDiv">Profil Bilgilerim</div>
                                            <div onClick={() => setTab(<UserStatisticsCmp data={currentUserInfo}/>)} className="textTabDiv">İstatistiklerim</div>
                                            <img onClick={goMatchHistoryPage} src={require("../ui-design/images/history.png")} className="imgTabDiv" alt=""/>
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
                            <div className="roomsDiv">{<ChatRoomsCmp data={[]}/>}</div>
                            <div className="roomsdiv">{<RandomMatchGameCmp/>}</div>
                            <div className="roomsDiv">{<FriendsRoomsCmp data={[]}/>}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div>Test: Sayfa bulunamadı 404</div>
        </>
    )
}
export default HomeScreen