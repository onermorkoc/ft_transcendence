import { useState } from "react"
import { ChatRooms } from "../App"
import "../ui-design/styles/CmpMix.css"
import MyChatRoomsCmp from "./MyChatRoomsCmp"
import CreateChatRoom from "./CreateChatRoom"
import SearchChatRoomCmp from "./SearchChatRoomCmp"

const ChatRoomsCmp = (props: {data: Array<ChatRooms>}) => {

    const [chatTab, setChatTab] = useState<JSX.Element>(<MyChatRoomsCmp/>)

    return (
        <>
            <div className="roomsHeader">Sohbet Odaları</div>
            
            <div className="roomsBodyDiv">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <button onClick={() => setChatTab(<MyChatRoomsCmp/>)} className="roomsButton">Odalarım</button>
                    <button onClick={() => setChatTab(<SearchChatRoomCmp data={props.data}/>)} className="roomsButton">Oda ara</button>
                    <button onClick={() => setChatTab(<CreateChatRoom/>)} className="roomsButton">Oda Kur</button>
                </div>
                <hr/>
                {chatTab}
            </div>
        </>
    )
}

export default ChatRoomsCmp