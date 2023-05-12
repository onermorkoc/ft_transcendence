import { GameRooms } from "../App"
import "../ui-design/styles/CmpMix.css"

const SearchGameRoomCmp = (props: {data: Array<GameRooms>}) => {

    function toEnterGameRoom(id: string) {
        const win: Window = window
        win.location = `/matchroom/${id}`
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
                        <div onClick={() => toEnterGameRoom(value.id)} key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={require("../ui-design/images/swords.png")} alt="" style={{width: "60px"}}/>
                                <div className="listViewInfoDiv">
                                    <div>Oda adı: {value.name}</div>
                                    <div>Kurucu: {value.founder.name}</div>
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