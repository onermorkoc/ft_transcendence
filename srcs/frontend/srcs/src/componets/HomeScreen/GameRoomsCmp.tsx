import { GameRooms } from "../../App"
import "../../ui-design/styles/CmpMix.css"

const GameRoomsCmp = (props: {data: Array<GameRooms>}) => {

    function toEnterGameRoom(id: string) {
        const win: Window = window
        win.location = `/matchroom/${id}`
    }

    return (
        <>
            <div className="roomsHeader">Oyun Odaları</div>
            
            <div className="roomsBodyDiv">

                <div style={{display: "flex", flexDirection: "row"}}>
                    <button className="roomsButton">Oda kur</button>
                    <button className="roomsButton">Rastgele eşleş</button>
                </div>
                <hr/>
            
                {
                    props.data.map((value, index) => (
                        <div onClick={() => toEnterGameRoom(value.id)} key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={require("../../ui-design/images/swords.png")} alt="" style={{width: "60px"}}/>
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

export default GameRoomsCmp