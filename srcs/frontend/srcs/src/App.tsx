import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';

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

const testGameRoomsList: Array<GameRooms> = [
  {name: "Test-Oyun-Odası-1", founder: testUser, rival: testUser}, 
  {name: "Test-Oyun-Odası-2", founder: testUser, rival: testUser},
  {name: "Test-Oyun-Odası-3", founder: testUser, rival: testUser}
]

const testChatRoomsList: Array<ChatRooms> = [
  {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-1", roomStatus: "public", banList: [], users: [testUser]},
  {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-2", roomStatus: "private", banList: [], users: [testUser, testUser]},
  {owner: testUser, admins: [testUser], name: "Test-Sohbet-Odası-3", roomStatus: "protected", banList: [], users: [testUser]},
]

const testFriendsList: Array<UserInfo> = [
  testUser, testUser, testUser
]

// ####################################################################################################


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen/>}/>
          <Route path='/home' element={<HomeScreen currentUser={testUser} gameRoomsList={testGameRoomsList} chatRoomList={testChatRoomsList} friendsList={testFriendsList}/>}/>
          <Route path='/editprofile' element={<EditProfileScreen data={testUser}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
export {type UserInfo}
export {type GameRooms}
export {type ChatRooms}