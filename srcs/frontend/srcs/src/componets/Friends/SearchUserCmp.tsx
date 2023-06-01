import { useEffect, useState } from "react"
import { User } from "../../dto/DataObject"

const allUserArray: Array<User> = []

const SearchUserCmp = () => {

    const [searchText, setSearchText] = useState<string>()
    const [filterArray, setFilterArray] = useState<Array<User>>([])

    useEffect(() => {

        if (searchText != null && searchText.length > 3){
            const userArray: Array<User> = []
            allUserArray.map((value) => {
                if (value.nickname.includes(searchText)){
                    userArray.push(value)
                }
            })
            setFilterArray(userArray)
        }else{
            setFilterArray([])
        }
    }, [searchText])

    return (
        <>
            <div className="searchBarBox">
                <input onChange={event => setSearchText(event.target.value)} className="searchBar" type="text" placeholder="Oda adı"/>
                <img className="searchImg" src={require("../../ui-design/images/search.png")} alt=""/>
            </div>

            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    filterArray?.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={value.photoUrl} alt="" className="friendsAvatarImg"/>
                                <div className="listViewInfoDiv">
                                    <div>Ad: {value.displayname}</div>
                                    <div>Nickname: {value.nickname}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default SearchUserCmp