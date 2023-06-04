import { useEffect, useState } from "react"
import { User } from "../../dto/DataObject"
import axios from "axios"

const SearchUserCmp = () => {

    const [ allUsers, setAllUsers ] = useState<Array<User>>()
    const [ searchText, setSearchText ] = useState<string | null>(null)
    const [ filterArray, setFilterArray ] = useState<Array<User>>([])
    const [ currentUser, setCurrentUser ] = useState<User | null>()

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/`).then(response => setAllUsers(response.data))
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/current`).then(response => setCurrentUser(response.data))

        if (searchText != null && searchText.length > 3){
            const userArray: Array<User> = []
            allUsers?.forEach((value) => {
                if (value.nickname.includes(searchText)){
                    if(!(currentUser?.friendIds.find(userId => userId === value.id)) && value.id !== currentUser?.id)
                        userArray.push(value)
                }
            })
            setFilterArray(userArray)
        }else{
            setFilterArray([])
        }
    }, [searchText])

    const sendFriendRequest = (value: User) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/friends/send-request/${value.id}`).then(() => setSearchText(null))
    }

    return (
        <>
            <div className="searchBarBox">
                <input onChange={event => setSearchText(event.target.value)} className="searchBar" type="text" placeholder="Kullanıcı adı"/>
                <img className="searchImg" src={require("../../ui-design/images/search.png")} alt=""/>
            </div>

            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    filterArray?.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv">
                                <img className="friendsAvatarImg" src={value.photoUrl} alt=""/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.displayname}</div>
                                    <div>Nickname: {value.nickname}</div>
                                </div>
                                <img className="addFriendImg" onClick={() => sendFriendRequest(value)} src={require("../../ui-design/images/addfriend.png")} alt=""/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default SearchUserCmp