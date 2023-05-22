import { GameRoom } from "../dto/DataObject"
import "../ui-design/styles/CmpMix.css"

const SearchGameRoomCmp = (props: {data: Array<GameRoom>}) => {

    function toEnterGameRoom(id: number) {
        window.location.assign(`/matchroom/${id}`)
    }

    return (
        <>
            <div className="searchBarBox">
                <input className="searchBar" type="text" placeholder="Oda adı"/>
                <img className="searchImg" src={require("../ui-design/images/search.png")} alt=""/>
            </div> 
        
            <div style={{display: "block", overflowY: "scroll", height: "300px"}}>
                {
                    props.data.map((value, index) => (
                        <div onClick={() => toEnterGameRoom(value.id!!)} key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={require("../ui-design/images/swords.png")} alt="" style={{width: "60px"}}/>
                                <div className="listViewInfoDiv">
                                    <div>Oda adı: {value.name}</div>
                                    <div>Kurucu: {value.founderID}</div>   {/* founderID.displayname */}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div> 
        </>
    )
}

export default SearchGameRoomCmp