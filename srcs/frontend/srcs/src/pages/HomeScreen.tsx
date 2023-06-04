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

    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ tab, setTab ] = useState<JSX.Element | null>(null)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/current`).then(response => setCurrentUser(response.data))
    }, [])

    const goEditProfilePage = () => {
        window.location.assign(`/editprofile`)
    }

    const goMatchHistoryPage = () => {
        //window.location.assign("/history")
    }

    const goGlobalRankPage = () => {

    }

    const logout = () => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/logout`).then(() => {
            window.location.assign("/")
        })
    }

    if (currentUser){

        if (!tab)
            setTab(<UserInfoCmp currentUser={currentUser}/>)
            
        return (
            <>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flex: "30vh"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{width: "280px"}}>
                                <div style={{margin: "10px"}}>
                                    <img className="homeAvatarImg" src={currentUser.photoUrl} alt=""/>
                                    <img className="editProfileButton" onClick={goEditProfilePage} src={require("../ui-design/images/edit.png")} alt=""/>
                                </div>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <div className="textTabDiv" onClick={() => setTab(<UserInfoCmp currentUser={currentUser}/>)}>Profil Bilgilerim</div>
                                            <div className="textTabDiv" onClick={() => setTab(<UserStatisticsCmp currentUser={currentUser}/>)}>İstatistiklerim</div>
                                            <img className="imgTabDiv" onClick={goMatchHistoryPage} src={require("../ui-design/images/history.png")} alt=""/>
                                            <img className="imgTabDiv" onClick={goGlobalRankPage} src={require("../ui-design/images/global-rank.png")} alt=""/>
                                            <img className="imgTabDiv" onClick={logout} src={require("../ui-design/images/logout.png")} alt=""/>
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
                            <div className="roomsDiv">{<ChatRoomsCmp/>}</div>
                            <div className="roomsdiv">{<RandomMatchGameCmp/>}</div>
                            <div className="roomsDiv">{<FriendsRoomsCmp/>}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            {/* <div>Test: Sayfa bulunamadı 404</div> */}
        </>
    )
}
export default HomeScreen