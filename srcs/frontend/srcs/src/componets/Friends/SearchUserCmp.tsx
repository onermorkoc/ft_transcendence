import { useEffect, useState } from "react"
import { User } from "../../dto/DataObject"
import axios from "axios"
import useCurrentUser from "../../services/Auth"

const SearchUserCmp = () => {

    const currentUser = useCurrentUser()
    const [allUsers, setAllUsers] = useState<Array<User> | null>()
    const [filterArray, setFilterArray] = useState<Array<User>>([])

    const onChangeText = (searchText: string) => {
        if (allUsers && searchText && searchText.length > 3){
            const userArray: Array<User> = []
            allUsers.forEach((value) => {
                if (value.nickname.includes(searchText)){
                    if(!(currentUser?.friendIds.find(userId => userId === value.id)) && value.id !== currentUser?.id)
                        userArray.push(value)
                }
            })
            setFilterArray(userArray)
        }
        else
            setFilterArray([])
    }

    const sendFriendRequest = async (value: User) => {
        setFilterArray(filterArray.filter(predicate => predicate !== value))
        await axios.post(`/friends/send-request/${value.id}`)
    }

    const goLookProfilePage = (userId: number) => {
        window.location.assign(`/profile/${userId}/home`)
    }

    useEffect(() => {
        if (!allUsers)
            axios.get(`/users/`).then(response => setAllUsers(response.data))
    }, [allUsers, filterArray])

    return (
        <>
            <div className="searchBarBox">
                <input onChange={event =>  onChangeText(event.target.value)} className="searchBar" type="text" placeholder="Kullanıcı adı"/>
                <img className="searchImg" src={require("../../ui-design/images/search.png")} alt=""/>
            </div>

            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    filterArray?.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv">
                                <img onClick={() => goLookProfilePage(value.id)} className="friendsAvatarImg" src={value.photoUrl} alt=""/>
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