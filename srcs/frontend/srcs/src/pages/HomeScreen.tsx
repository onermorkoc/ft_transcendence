import { useState } from "react"
import "../ui-design/styles/HomeScreen.css"
import UserInfoCmp from "../componets/HomeScreen/UserInfoCmp"
import UserStatisticsCmp from "../componets/HomeScreen/UserStatisticsCmp"
import GameRoomsCmp from "../componets/HomeScreen/GameRoomsCmp"
import ChatRoomsCmp from "../componets/HomeScreen/ChatRoomsCmp"
import FriendsRoomsCmp from "../componets/HomeScreen/FriendsRoomsCmp"

interface UserGameStatistics {
    totalGame: number,
    totalWin: number,
    totalLose: number,
    winRate: number,
    title: "Çaylak" | "Usta" | "Büyük Usta" | "Efsane" | "Şanlı", // ünvan
    globalRank: number
}

interface UserInfo {
    name: string,
    nickname: string,
    email: string,
    google: "etkin" | "devredışı",
    photoUrl: string,
    status: "çevrimiçi" | "çevrimdışı" | "oyunda"
    statistics: UserGameStatistics
}

interface GameRooms {
    name: string,
    founder: UserInfo, // kurucu
    rival: UserInfo // rakibi
}

interface ChatRooms {
    owner: UserInfo,
    admins: Array<UserInfo>,
    name: string,
    roomStatus: "public" | "private" | "protected",
    banList: Array<UserInfo>
    users: Array<UserInfo>
}

// ################################### => Test Object <= ##############################################

const testUserGameStatistics: UserGameStatistics = {
    totalGame: 10,
    totalWin: 7,
    totalLose: 3,
    winRate: 70,
    title: "Çaylak",
    globalRank: 1
}

const testUser: UserInfo = {
    name: "Öner Morkoç",
    nickname: "omorkoç",
    email: "omorkoc@student.42istanbul.com.tr",
    google: "devredışı",
    photoUrl: "https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg",
    status: "çevrimiçi",
    statistics: testUserGameStatistics
}

const testGameRoomsArray: Array<GameRooms> = [
    {name: "Test-Oyun-Odası-1", founder: testUser, rival: testUser}, 
    {name: "Test-Oyun-Odası-2", founder: testUser, rival: testUser},
    {name: "Test-Oyun-Odası-3", founder: testUser, rival: testUser}
]

const testChatRoomsArray: Array<ChatRooms> = [
    {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-1", roomStatus: "public", banList: [], users: [testUser]},
    {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-2", roomStatus: "private", banList: [], users: [testUser, testUser]},
    {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-3", roomStatus: "protected", banList: [], users: [testUser]},
]

// ####################################################################################################

const HomeScreen = () => {

    const [tab,setTab] = useState<JSX.Element>(<UserInfoCmp data={testUser} />)
    
    return (
        <>
            <div className="flexBox">
                <div className="row1">
                    <div className="row1-1">
                        <img src={testUser.photoUrl} className="avatarImage" alt=""/>
                        <img src={require("../ui-design/images/edit.png")} className="editAvatarButton" alt=""/>
                    </div>
                    <div className="row1-2">
                        <div className="tabsFlexBox">
                            <div onClick={() => setTab(<UserInfoCmp data={testUser}/>)} className="userInfoTabDiv">Profil Bilgilerim</div>
                            <div onClick={() => setTab(<UserStatisticsCmp data={testUser}/>)} className="userStatisticsTabDiv">İstatistiklerim</div>
                        </div>
                        <div>
                            {tab}
                        </div>
                    </div>
                </div>
                <div className="row2">
                    <div className="roomsFlexBox">
                        <div className="gameRooms">{<GameRoomsCmp data={testGameRoomsArray}/>}</div>
                        <div className="chatRooms">{<ChatRoomsCmp data={testChatRoomsArray}/>}</div>
                        <div className="friendsRooms">{<FriendsRoomsCmp/>}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeScreen
export {type UserInfo}
export {type GameRooms}
export {type ChatRooms}