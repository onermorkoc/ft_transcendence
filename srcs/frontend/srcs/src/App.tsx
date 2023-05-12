import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import GameScreen from './pages/GameScreen';
import { v4 as uuidv4 } from 'uuid';

function calculateWinRate(totalWin: number, totalGame: number): number {
  return ((100 * totalWin) / totalGame)
}

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
  google: boolean,
  photoUrl: string,
  status: "çevrimiçi" | "çevrimdışı" | "oyunda"
  statistics: UserGameStatistics
  chatRooms: Array<ChatRooms>
  friends: Array<UserInfo>
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

const user1Statistics: UserGameStatistics =  {
  totalGame: 10,
  totalWin: 4,
  totalLose: 6,
  winRate: calculateWinRate(4, 10),
  title: 'Çaylak',
  globalRank: 4
}

const user2Statistics: UserGameStatistics =  {
  totalGame: 17,
  totalWin: 11,
  totalLose: 6,
  winRate: calculateWinRate(11, 17),
  title: 'Çaylak',
  globalRank: 3
}

const user3Statistics: UserGameStatistics =  {
  totalGame: 65,
  totalWin: 33,
  totalLose: 32,
  winRate: calculateWinRate(33, 65),
  title: 'Usta',
  globalRank: 2
}

const user4Statistics: UserGameStatistics =  {
  totalGame: 234,
  totalWin: 201,
  totalLose: 33,
  winRate: calculateWinRate(201, 234),
  title: 'Efsane',
  globalRank: 1
}

const currentUser: UserInfo = {
  name: 'Öner Morkoç',
  nickname: 'omorkoc',
  email: 'omorkoc@student.42istanbul.com.tr',
  google: false,
  photoUrl: 'https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg',
  status: 'çevrimiçi',
  statistics: user1Statistics,
  chatRooms: [],
  friends: []
}

const user2: UserInfo = {
  name: 'Ermand Haruni',
  nickname: 'eharuni',
  email: 'eharuni@student.42istanbul.com.tr',
  google: false,
  photoUrl: 'https://cdn.intra.42.fr/users/51a12ee29d82643fffbba247a3c90a5a/eharuni.jpg',
  status: 'çevrimdışı',
  statistics: user2Statistics,
  chatRooms: [],
  friends: []
}

const user3: UserInfo = {
  name: 'Altuğ Alpcan Yaşar',
  nickname: 'alyasar',
  email: 'alyasar@student.42istanbul.com.tr',
  google: false,
  photoUrl: 'https://cdn.intra.42.fr/users/3519bd7260eb9395ef762149957b6f43/alyasar.jpg',
  status: 'oyunda',
  statistics: user3Statistics,
  chatRooms: [],
  friends: []
}

const user4: UserInfo = {
  name: 'Yusuf Aysu',
  nickname: 'yaysu',
  email: 'yaysu@student.42istanbul.com.tr',
  google: false,
  photoUrl: 'https://cdn.intra.42.fr/users/49e40735ae192aaa888d96b545698e42/yaysu.jpg',
  status: 'çevrimdışı',
  statistics: user4Statistics,
  chatRooms: [],
  friends: []
}

const allUserList: Array<UserInfo> = [currentUser, user2, user3, user4]

const allChatRoomList: Array<ChatRooms> = []

export const allGameRoomList: Array<GameRooms> = []

// ####################################################################################################


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen/>}/>
          <Route path='/home' element={<HomeScreen currentUser={user2} gameRoomList={allGameRoomList} chatRoomList={allChatRoomList} userList={allUserList}/>}/>
          <Route path='/editprofile' element={<EditProfileScreen data={currentUser}/>}/>
          <Route path='/matchroom/:matchID' element={<GameScreen/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;