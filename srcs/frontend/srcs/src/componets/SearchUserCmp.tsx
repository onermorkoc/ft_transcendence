import { useEffect, useRef, useState } from "react"
import { User } from "../dto/DataObject"

const allUserArray: Array<User> = [{
    id: 0,
    intraID: 0,
    displayname: "Alp Altuğ Yaşar",
    nickname: "alyasar",
    email: "",
    photourl: "https://cdn.intra.42.fr/users/3519bd7260eb9395ef762149957b6f43/alyasar.jpg",
    googleauth: false,
    status: "online",
    statistics: {
        totalGame: 0,
        totalWin: 0,
        totalLose: 0,
        winRate: 0,
        title: "Çaylak",
        globalRank: 0
    },
    chatroomsID: [],
    friendsID: []
    }, {
    id: 0,
    intraID: 0,
    displayname: "Yusuf Aysu",
    nickname: "yaysu",
    email: "",
    photourl: "https://cdn.intra.42.fr/users/49e40735ae192aaa888d96b545698e42/yaysu.jpg",
    googleauth: false,
    status: "online",
    statistics: {
        totalGame: 0,
        totalWin: 0,
        totalLose: 0,
        winRate: 0,
        title: "Çaylak",
        globalRank: 0
    },
    chatroomsID: [],
    friendsID: []
}]

const SearchUserCmp = () => {

    const [searchText, setSearchText] = useState<string>()
    const [filterArray, setFilterArray] = useState<Array<User>>()

    useEffect(() => {

        if (searchText != null && searchText.length > 3){
            allUserArray.map((value, index) => {
                if (value.nickname.includes(searchText)){
                    console.log(value.nickname)
                }
            })
        }        
    }, [searchText])

    return (
        <>
            <div className="searchBarBox">
                <input onChange={event => setSearchText(event.target.value)} className="searchBar" type="text" placeholder="Oda adı"/>
                <img className="searchImg" src={require("../ui-design/images/search.png")} alt=""/>
            </div>

            <div>
                search user
            </div>
        </>
    )
}

export default SearchUserCmp