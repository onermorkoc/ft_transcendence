import { useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import CreateChatRoom from "./CreateChatRoom"
import MyChatRoomsCmp from "./MyChatRoomsCmp"
import SearchChatRoomCmp from "./SearchChatRoomCmp"
import { ChatRoom } from "../../dto/DataObject"

const ChatRoomsCmp = (props: {data: Array<ChatRoom>}) => {

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