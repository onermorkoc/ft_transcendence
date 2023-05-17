import { ChatRooms } from "../App"

const SearchChatRoomCmp = (props: {data: Array<ChatRooms>}) => {
    return (
        <>
            <div className="searchBarBox">
                <input className="searchBar" type="text" placeholder="Oda adı"/>
                <img className="searchImg" src={require("../ui-design/images/search.png")} alt=""/>
            </div> 

            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={require("../ui-design/images/team.png")} alt="" style={{width: "60px"}}/>
                                <div className="listViewInfoDiv">
                                    <div>Oda adı: {value.name}</div>
                                    <div>Durum: {value.roomStatus}</div>
                                    <div>Üye: {value.users.length} kişi</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default SearchChatRoomCmp