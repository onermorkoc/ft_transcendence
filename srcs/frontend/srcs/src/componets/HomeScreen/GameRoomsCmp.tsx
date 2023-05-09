import { GameRooms } from "../../pages/HomeScreen"
import "../../ui-design/styles/CmpMix.css"

const GameRoomsCmp = (props: {data: Array<GameRooms>}) => {
    return (
        <>
            <p className="roomsHeader">Oyun Odaları</p>
            <hr/>
            <div className="roomsBodyDiv">
                {
                    props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listView">
                                <img src={require("../../ui-design/images/swords.png")} alt="" className="img3"/>
                                <div className="listViewInfoDiv">
                                    <p className="text3">Oda adı: {value.name}</p>
                                    <p className="text3">Kurucu: {value.founder.name}</p>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default GameRoomsCmp