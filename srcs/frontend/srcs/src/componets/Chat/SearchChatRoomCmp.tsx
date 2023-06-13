import { ChatRoom } from "../../dto/DataObject"

const allChatRooms: Array<ChatRoom> = []

const SearchChatRoomCmp = () => {
    
    return (
        <>
            <div className="searchBarBox">
                <input className="searchBar" type="text" placeholder="Oda adı"/>
                <img className="searchImg" src={require("../../ui-design/images/search.png")} alt=""/>
            </div> 

            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    allChatRooms.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv">
                                <img style={{width: "60px"}} src={require("../../ui-design/images/team.png")} alt=""/>
                                <div className="listViewInfoDiv">
                                    <div>Oda adı: {value.name}</div>
                                    <div>Durum: {value.roomStatus}</div>
                                    {/* <div>Üye: {value.userIds.length} kişi</div> */}
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