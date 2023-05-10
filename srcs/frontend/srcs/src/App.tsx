import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import GameScreen from './pages/GameScreen';
import { v4 as uuidv4 } from 'uuid';

export interface UserGameStatistics {
  totalGame: number,
  totalWin: number,
  totalLose: number,
  winRate: number,
  title: "Çaylak" | "Usta" | "Büyük Usta" | "Efsane" | "Şanlı", // ünvan
  globalRank: number
}

export interface UserInfo {
  name: string,
  nickname: string,
  email: string,
  google: "etkin" | "devredışı",
  photoUrl: string,
  status: "çevrimiçi" | "çevrimdışı" | "oyunda"
  statistics: UserGameStatistics
}

export interface GameRooms {
  name: string,
  founder: UserInfo, // kurucu
  rival: UserInfo, // rakibi
  id: string
}

export interface ChatRooms {
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

// uuidv4()

export const testGameRoomsList: Array<GameRooms> = [
  {name: "Test-Oyun-Odası-1", founder: testUser, rival: testUser, id: "3d0327b9-16e7-4811-8782-adfe02f0395e"}, 
  {name: "Test-Oyun-Odası-2", founder: testUser, rival: testUser, id: "52662cc5-ed54-46a1-8b40-2fb171a4b62c"},
  {name: "Test-Oyun-Odası-3", founder: testUser, rival: testUser, id: "09671086-d811-4e10-ad51-97768c86b864"}
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
          <Route path='/matchroom/:matchID' element={<GameScreen/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;