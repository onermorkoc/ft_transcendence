import { ChatRooms } from "../../App"
import "../../ui-design/styles/CmpMix.css"

const ChatRoomsCmp = (props: {data: Array<ChatRooms>}) => {
    return (
        <>
            <div className="roomsHeader">Sohbet Odaları</div>
            
            <div className="roomsBodyDiv">
                
                <div style={{display: "flex", flexDirection: "row"}}>
                    <button className="roomsButton">Oda Kur</button>
                    <button className="roomsButton">Odalarım</button>
                    <button className="roomsButton">Oda ara</button>
                </div>
                <hr/>
                
                {
                     props.data.map((value, index) => (
                        <div key={index}>
                            <div className="listViewDiv" style={{display: "flex", flexDirection: "row"}}>
                                <img src={require("../../ui-design/images/team.png")} alt="" style={{width: "60px"}}/>
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

export default ChatRoomsCmp