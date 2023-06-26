import { useParams } from "react-router-dom"
import "../ui-design/styles/LookProfileScreen.css"
import "../ui-design/styles/CmpMix.css"
import { User } from "../dto/DataObject"
import { useEffect, useState } from "react"
import axios from "axios"
import useCurrentUser from "../services/Auth"
import { historyView } from "./GameHistoryScreen"
import { timeSplit } from "./ChatScreen"

const UserStatisticsCmp = (props: {data: User}) => {

    const totalLose = props.data.totalGame - props.data.totalWin
    const winRate = (props.data.totalWin / props.data.totalGame) * 100 // 0/0 = NaN

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/all.png")} alt=""/>
                            <div className="text2">Toplam maç: {props.data.totalGame}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/win.png")} alt=""/>
                            <div className="text2">Kazanılan: {props.data.totalWin}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/lose.png")} alt=""/>
                            <div className="text2">Kaybedilen: {totalLose}</div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/percent.png")} alt=""/>
                            <div className="text2">Kazanma oranı: {winRate}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/title.png")} alt=""/>
                            <div className="text2">Ünvan: {/* currentUser?.title */}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../ui-design/images/rank.png")} alt=""/>
                            <div className="text2">Global sıralama: {/* currentUser?.globalRank  */}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const UserInfoCmp = (props: {data: User}) => {
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className="infoRowDiv">
                    <img className="img2" src={require("../ui-design/images/user.png")} alt=""/>
                    <div className="text2">Ad: {props.data?.displayname}</div>
                </div>

                <div className="infoRowDiv">
                    <img className="img2" src={require("../ui-design/images/nickname.png")} alt=""/>
                    <div className="text2">Kullanıcı adı: {props.data?.nickname}</div>
                </div>

                <div className="infoRowDiv">
                    <img className="img2" src={require("../ui-design/images/calendar.png")} alt=""/>
                    <div className="text2">Şu tarihten beri üye: {timeSplit(new Date(props.data.createdAt))}</div>
                </div>

                <div className="infoRowDiv">
                    <img className="img2" src={require("../ui-design/images/wifi-signal.png")} alt=""/>
                    <div className="text2">Durum: {
                        props.data.status === "ONLINE" ?
                            <span style={{color: "green"}}> {props.data.status}</span>
                        :
                            <span style={{color: "red"}}> {props.data.status}</span>
                    }</div>
                </div>
            </div>
        </>
    )
}

const LookProfileScreen = () => {

    const currentUser = useCurrentUser()
    const { userId, backPage, backPageArg } = useParams()
    const [userInfo, setUserInfo] = useState<User | null>(null)
    const [tab, setTab] = useState<JSX.Element | null>(null)
    const [blockStatus, setBlockStatus] = useState<boolean | null>(null)
    const [friendStatus, setFriendStatus] = useState<"friend" | "noFriend" | "waitRequest" | null>(null)

    const backButton = () => {
        if (backPageArg)
            window.location.assign(`/${backPage}/${backPageArg}`)
        else {
            window.location.assign(`/${backPage}`)
        }
    }

    const addFriend = async () => {
        await axios.post(`/friends/send-request/${userInfo!!.id}`)
        setFriendStatus("waitRequest")
    }

    const unFriend = () => {
        axios.post(`/friends/unfriend`, {userId: userInfo!!.id}).then(() => {
            setFriendStatus("noFriend")
        })
    }

    const unblock = () => {
        axios.post("/users/unblockuser", {blockedUserId: userInfo!!.id}).then((response) => {
            if (response.data)
                setBlockStatus(false)
        })
    }

    const block = () => {
        axios.post("/users/blockuser", {blockedUserId: userInfo!!.id}).then((response) => {
            if (response.data)
                setBlockStatus(true)
        })
    }

    useEffect(() => {

        if (!userInfo)
            axios.get(`/users/getuser/${userId}`).then((response) => setUserInfo(response.data))

        if (userInfo && !tab)
            setTab(<UserInfoCmp data={userInfo}/>)
        
        if (userInfo && currentUser && !blockStatus){
            if (currentUser.blockedUserIds.includes(userInfo.id))
                setBlockStatus(true)
            else
                setBlockStatus(false)
        }

        if (currentUser && userInfo && !friendStatus){
            if (currentUser.friendIds.includes(userInfo.id))
                setFriendStatus("friend")
            else{
                axios.get(`/friends/${currentUser.id}/sent-requests`).then((response) => {
                    if (response.data.includes(userInfo.id))
                        setFriendStatus("waitRequest")
                    else
                        setFriendStatus("noFriend")
                })
            }
        }

    }, [userId, userInfo, tab])

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{flex: "30vh"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img onClick={backButton} className="lookProfileImgTabDiv" src={require("../ui-design/images/back.png")} alt=""/>
                        <img className="lookProfileAvatarImg" src={userInfo?.photoUrl} alt=""/>
                        <div style={{flex: 1}}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div className="lookProfileTextTabDiv" onClick={() => setTab(<UserInfoCmp data={userInfo!!}/>)}>Profil Bilgileri</div>
                                        <div className="lookProfileTextTabDiv" onClick={() => setTab(<UserStatisticsCmp data={userInfo!!}/>)}>İstatistikler</div>
                                        {
                                            friendStatus === "friend" ? 
                                                <img onClick={unFriend} className="lookProfileImgTabDiv" src={require("../ui-design/images/unfriend-black.png")} alt=""/>
                                            :
                                                friendStatus === "noFriend" ?
                                                    <img onClick={addFriend} className="lookProfileImgTabDiv" src={require("../ui-design/images/addfriend-black.png")} alt=""/>
                                                : 
                                                    <img className="lookProfileImgTabDiv" src={require("../ui-design/images/hourglass.png")} alt=""/>
                                        }
                                        {
                                            blockStatus ? 
                                                <img className="lookProfileImgTabDiv" onClick={unblock} src={require("../ui-design/images/unblock.png")} alt=""/>
                                            :
                                                <img className="lookProfileImgTabDiv" onClick={block} src={require("../ui-design/images/block.png")} alt=""/>
                                        }
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
                    
                    <div className="lookProfileHistoryHeader">Son Oynanan Oyunlar</div>
                    
                    <div className="lookProfileHistoryViewList">
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                        {historyView()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LookProfileScreen