import { useState } from "react"
import "../../ui-design/styles/CmpMix.css"

const CreateChatRoom = () => {

    const [select, setSelect] = useState<string>()

    const createChatRoom = () => {
        
    }

    return (
        <>
            <img className="createChatImg" src={require("../../ui-design/images/team.png")}/>
            <select value={select} onChange={event => setSelect(event.target.value)} className="createChatSelectMenu">
                <option>Public</option>
                <option>Private</option>
                <option>Protected</option>
            </select>
            <input className="createChatInput" type="text" placeholder="Oda Adı" />
            {
                select == "Private"
                ? <input className="createChatInput" type="text" placeholder="Parola" />
                :  <></>
            }
            <img onClick={createChatRoom} className="createChatNextButton" src={require("../../ui-design/images/okey.png")}/>
        </>
    )
}
export default CreateChatRoom