import { useRef, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import { RoomStatus } from "../../dto/DataObject"
import axios from "axios"

const CreateChatRoomCmp = () => {

    const roomNameRef = useRef<HTMLInputElement>(null)
    const roomPassRef = useRef<HTMLInputElement>(null)
    const [roomStatus, setRoomStatus] = useState<RoomStatus>("PUBLIC")

    const createChatRoom = () => {

        const roomName = roomNameRef.current?.value
        const roomPass = roomPassRef.current?.value

        if ((roomName === "") || (roomStatus === "PROTECTED" && roomPass === ""))
            return

        const postData = { roomName: roomName, roomStatus: roomStatus, password: roomPass }
        axios.post("/chat/room/create", postData).then((response) => {
            window.location.assign(`/chat/${response.data.id}`)
        })
    }

    const selectListener = (value: string) => {
        if (value === "Public")
            setRoomStatus("PUBLIC")
        else if (value === "Private")
            setRoomStatus("PRIVATE")
        else
            setRoomStatus("PROTECTED")
    }

    return (
        <>
            <img className="createChatImg" src={require("../../ui-design/images/team.png")} alt=""/>
            <select className="createChatSelectMenu" onChange={event => selectListener(event.target.value)}>
                <option>Public</option>
                <option>Private</option>
                <option>Protected</option>
            </select>
            <input className="createChatInput" ref={roomNameRef} type="text" placeholder="Oda Adı" />
            {
                roomStatus === "PROTECTED"
                ? <input className="createChatInput" ref={roomPassRef} type="text" placeholder="Parola" />
                :  <></>
            }
            <img className="createChatNextButton" onClick={createChatRoom} src={require("../../ui-design/images/okey.png")} alt=""/>
        </>
    )
}
export default CreateChatRoomCmp