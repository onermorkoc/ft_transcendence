import { useState } from "react"
import "../../ui-design/styles/CmpMix.css"

const CreateChatRoomCmp = () => {

    const [select, setSelect] = useState<string>("")

    const createChatRoom = () => {
        
    }

    return (
        <>
            <img className="createChatImg" src={require("../../ui-design/images/team.png")} alt=""/>
            <select className="createChatSelectMenu" value={select} onChange={event => setSelect(event.target.value)}>
                <option>Public</option>
                <option>Private</option>
                <option>Protected</option>
            </select>
            <input className="createChatInput" type="text" placeholder="Oda Adı" />
            {
                select === "Private"
                ? <input className="createChatInput" type="text" placeholder="Parola" />
                :  <></>
            }
            <img className="createChatNextButton" onClick={createChatRoom} src={require("../../ui-design/images/okey.png")} alt=""/>
        </>
    )
}
export default CreateChatRoomCmp