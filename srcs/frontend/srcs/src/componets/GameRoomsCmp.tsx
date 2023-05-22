import { useState } from "react"
import "../ui-design/styles/CmpMix.css"
import SearchGameRoomCmp from "./SearchGameRoomCmp"
import RandomMatchGameCmp from "./RandomMatchGameCmp"
import CreateGameRoomCmp from "./CreateGameRoomCmp"
import { GameRoom } from "../dto/DataObject"

const GameRoomsCmp = (props: {data: Array<GameRoom>}) => {

    const [gameTab, setGameTab] = useState<JSX.Element>(<SearchGameRoomCmp data={props.data}/>)

    return (
        <>
            <div className="roomsHeader">Oyun Odaları</div>
            
            <div className="roomsBodyDiv">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <button onClick={() => setGameTab(<SearchGameRoomCmp data={props.data}/>)} className="roomsButton">Oda ara</button>
                    <button onClick={() => setGameTab(<RandomMatchGameCmp/>)} className="roomsButton">Rastgele eşleş</button>
                    <button onClick={() => setGameTab(<CreateGameRoomCmp/>)} className="roomsButton">Oda kur</button>
                </div>
                <hr/>
                {gameTab}
            </div>
        </>
    )
}

export default GameRoomsCmp