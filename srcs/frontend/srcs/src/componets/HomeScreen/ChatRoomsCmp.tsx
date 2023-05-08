import { ChatRooms } from "../../pages/HomeScreen"
import "../../ui-design/styles/CmpMix.css"

const ChatRoomsCmp = (props: {data: Array<ChatRooms>}) => {
    return (
        <>
            <p className="roomsHeader">Sohbet Odaları</p>
            <hr/>
            {
                props.data.map((value, index) => (
                    <div key={index}>
                        <div className="listView">
                            <img src={require("../../ui-design/images/team.png")} alt="" className="img3"/>
                            <div className="listViewInfoDiv">
                                <p className="text4">Oda adı: {value.name}</p>
                                <p className="text4">Durum: {value.roomStatus}</p>
                                <p className="text4">Üye: {value.users.length} kişi</p>
                            </div>
                            <hr/>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default ChatRoomsCmp