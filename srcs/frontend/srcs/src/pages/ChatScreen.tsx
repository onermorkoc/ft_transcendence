import { useEffect, useState } from "react"
import { ChatRoom, User } from "../dto/DataObject"
import "../ui-design/styles/ChatScreen.css"

interface Point {
    x: number, 
    y: number
}

const viewForNormal = (point: Point): JSX.Element => {
    return (
        <>
            <div className="chatMenuDiv" style={{top: `${point.y}px`, left: `${point.x}px`}}>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/block.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Engelle</div>
                </div>
            </div>
        </>
    )
}

const viewForAdmin = (point: Point): JSX.Element => {
    return (
        <>
            <div className="chatMenuDiv" style={{top: `${point.y}px`, left: `${point.x}px`}}>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/block.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Engelle</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/mute.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Sustur</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/kick.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Çıkart</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/ban.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Banla</div>
                </div>
            </div>
        </>
    )
}

const viewForLeader = (userAuthority: string, point: Point): JSX.Element => {
    return (
        <>
            <div className="chatMenuDiv" style={{top: `${point.y}px`, left: `${point.x}px`}}>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/block.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Engelle</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/mute.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Sustur</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/kick.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Çıkart</div>
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/ban.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Banla</div>
                </div>
                <div className="chatMenuListDiv">
                    {
                        userAuthority === "admin" ?
                            <>
                                <img style={{width: "25px"}} src={require("../ui-design/images/admin2.png")} alt=""/>
                                <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Adminlikten çıkart</div>
                            </>
                        :
                            <>
                                <img style={{width: "25px"}} src={require("../ui-design/images/admin.png")} alt=""/>
                                <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Admin yap</div>
                            </>
                    }
                </div>
                <div className="chatMenuListDiv">
                    <img style={{width: "25px"}} src={require("../ui-design/images/leader-change.png")} alt=""/>
                    <div style={{marginLeft: "10px", fontSize: "1.2em"}}>Liderliği aktar</div>
                </div>
            </div>
        </>
    )
}

const chatMenu = (currentUserAuthority: string, userAuthority: string, point: Point): JSX.Element => {
    
    //console.log(`x: ${point.x}, y: ${point.y}`)

    if (currentUserAuthority === "leader"){
        if (userAuthority === "leader")
            return (<></>)
        else
            return (viewForLeader(userAuthority, point))
    }
    else if (currentUserAuthority === "admin"){
        if (userAuthority === "leader" || userAuthority === "admin")
            return (viewForNormal(point))
        else
            return (viewForAdmin(point))
    }
    else
        return (viewForNormal(point))
}

const useChatMemberList = (currentUserAuthority: string, /*userInfo: User, */ userAuthority: string) => {

    const [show, setShow] = useState<boolean>(false)
    const [point, setPoint] = useState<Point | null>(null)

    useEffect(() => {
        const eventListener = () => setShow(false)
        window.addEventListener("click", eventListener)
        return () => window.removeEventListener("click", eventListener)
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="memberListDiv" onContextMenu={(context) => {
                context.preventDefault()
                setPoint({x: context.clientX, y: context.clientY})
                setShow(true)
                }}>

                <img style={{width: "50px", height: "50px", borderRadius: "25px", objectFit: "cover"}} src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
                <div style={{display: "flex", flexDirection: "column", marginLeft: "10px", marginTop: "4px"}}>
                    <div style={{fontSize: "1.1em"}}>Öner Morkoç</div>
                    <div style={{fontSize: "1.1em"}}>çevrimiçi</div>
                </div>
                {
                    userAuthority !== "normal" ? 
                    <>
                        {
                            userAuthority === "leader" ?
                                <img style={{width: "37.5px", height: "37.5px", marginRight: "10px", marginLeft: "auto"}} src={require("../ui-design/images/owner.png")} alt=""/>
                            :
                                <img style={{width: "37.5px", height: "37.5px", marginRight: "10px", marginLeft: "auto"}} src={require("../ui-design/images/admins.png")} alt=""/>
                        }
                    </>
                    :
                    null
                }
                {show && chatMenu(currentUserAuthority, userAuthority, point!!)}
            </div>
        </>
    )
}

const ChatSetting = () => {

   const [select, setSelect] = useState<string>("")

    return (
        <>
            <div className="chatSettingsCenterDiv">
                <img style={{width: "200px", marginLeft: "auto", marginRight: "auto", display: "block"}} src={require("../ui-design/images/shield.png")} alt=""/>
                <select className="chatSettingsSelectDiv" value={select} onChange={event => setSelect(event.target.value)}>
                    <option>Public</option>
                    <option>Private</option>
                    <option>Protected</option>
                </select>
                <input className="chatSettingsInput" type="text" placeholder="Oda Adı" />
                {
                    select === "Private" ?
                        <input className="chatSettingsInput" type="text" placeholder="Parola" />
                    :
                        null
                }
                <img className="chatSettingsNextImg" src={require("../ui-design/images/okey.png")} alt=""/>
            </div>
        </>
    )
}

const MessageUi = (direction: "right" | "left") => {

    if (direction === "right") {
        return (
            <>
                <div style={{display: "flex", justifyContent: "right"}}>
                    <div className="chatScreenMessageDiv" style={{backgroundColor: "steelblue", borderTopRightRadius: "0px"}}>
                        <div style={{wordBreak: "break-all",  fontSize: "1.4em"}}>Selam naber ?</div>
                        <div style={{textAlign: "right",  fontSize: "1.2em", marginTop: "10px"}}>Öner Morkoç - 14:20</div>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div style={{display: "flex", justifyContent: "left"}}>
                    <div className="chatScreenMessageDiv" style={{backgroundColor: "rgb(176, 58, 58)", borderTopLeftRadius: "0px"}}>
                        <div style={{wordBreak: "break-all",  fontSize: "1.4em"}}>Selam naber ?</div>
                        <div style={{textAlign: "right",  fontSize: "1.2em", marginTop: "10px"}}>Öner Morkoç - 14:20</div>
                    </div>
                </div>
            </>
        )
    }
}


const ChatScreen = () => {

    const [settings, setSettings] = useState<boolean>(false)


    const backButton = () => {
        window.location.assign("/home")
    }

    let roomInfo: ChatRoom
    const admins: Array<number> = [0,1, 2]
    const members: Array<number> = [0,1, 2]
    const messages: Array<number> = [0,1]
    let ownerInfo: User
    let userAuthority: "leader" | "admin" | "normal" = "normal"
    let currentUserAuthority: "leader" | "admin" | "normal" = "normal"
    
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", flex: "10vh", alignItems: "center"}} >
                    <img className="chatScreenBackImg" onClick={backButton} src={require("../ui-design/images/back.png")} alt=""/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{color: "black", fontSize: "1.6em"}} >Kurtlar Sofrası</div>
                        <div style={{color: "black", fontSize: "1.1em"}} >18 üye, 5 çevrimiçi</div>
                    </div>
                    <div style={{marginRight: "50px", marginLeft: "auto", display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <img className="chatScreenExitImg" src={require("../ui-design/images/exit.png")} alt=""/>
                        <img className="chatScreenSettingsImg" onClick={() => setSettings(!settings)} src={require("../ui-design/images/settings.png")} alt=""/>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", flex: "90vh"}}>
                    <div style={{display: "flex", flexDirection: "column", flex: "2"}}>
                        
                        <div style={{display: "flex", flexDirection: "column", flex: "1"}}>
                            <div className="membersListBraceDiv">
                                <img style={{width: "50px", height: "50px"}} src={require("../ui-design/images/team.png")} alt=""/>
                                <div style={{color: "black", marginLeft: "10px"}}>Grup Üyeleri</div>
                            </div>
                            <div style={{height: "60vh", overflowX: "auto"}}>
                                {useChatMemberList("leader", "leader")}
                                {useChatMemberList("leader", "admin")}
                                {useChatMemberList("leader", "normal")}
                            </div>
                        </div>
                    </div>

                    <div className="chatMessagesRoot">

                        {
                            settings ?
                                <ChatSetting/>
                            : 
                                <>
                                    <div style={{flex: "9"}}>
                                        <div style={{overflowX: "auto", height: "80vh"}}>
                                            {
                                                messages.map((value, index) => (
                                                    MessageUi("right")
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="chatScreenLowerBar">
                                        <img className="chatScreenSendAndGameImg" src={require("../ui-design/images/game-request.png")} alt=""/>
                                        <input className="chatScreenInput" type="text" placeholder="Mesaj" />
                                        <img className="chatScreenSendAndGameImg" src={require("../ui-design/images/send.png")} alt=""/>
                                    </div>
                                </>
                        }
                    </div>
                </div> 
            </div>
        </>
    )
}

export default ChatScreen