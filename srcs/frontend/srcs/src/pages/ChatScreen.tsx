import { useEffect, useState } from "react"
import { ChatRoom, Point, RoomAuthority, RoomMember, User } from "../dto/DataObject"
import "../ui-design/styles/ChatScreen.css"
import { useParams } from "react-router-dom"
import { Socket, io } from "socket.io-client"
import useCurrentUser from "../services/Auth"
import axios from "axios"

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

const viewForLeader = (member: RoomMember, point: Point): JSX.Element => {
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
                        member.authority === "ADMIN" ?
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

const chatMenu = (currentUserAuthority: RoomAuthority, member: RoomMember, point: Point): JSX.Element => {
    
    //console.log(`x: ${point.x}, y: ${point.y}`)

    if (currentUserAuthority === "LEADER"){
        if (member.authority === "LEADER")
            return (<></>)
        else
            return (viewForLeader(member, point))
    }
    else if (currentUserAuthority === "ADMIN"){
        if (member.authority === "LEADER" || member.authority === "ADMIN")
            return (viewForNormal(point))
        else
            return (viewForAdmin(point))
    }
    else
        return (viewForNormal(point))
}

const chatMemberList = (member: RoomMember) => {

    return (
        <>
            <img style={{width: "50px", height: "50px", borderRadius: "25px", objectFit: "cover"}} src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
            <div style={{display: "flex", flexDirection: "column", marginLeft: "10px", marginTop: "4px"}}>
                <div style={{fontSize: "1.1em"}}>{member.user.displayname}</div>
                <div style={{fontSize: "1.1em"}}>{member.user.status}</div>
            </div>
            {
                member.authority !== "NORMAL" ? 
                <>
                    {
                        member.authority === "LEADER" ?
                            <img style={{width: "37.5px", height: "37.5px", marginRight: "10px", marginLeft: "auto"}} src={require("../ui-design/images/owner.png")} alt=""/>
                        :
                            <img style={{width: "37.5px", height: "37.5px", marginRight: "10px", marginLeft: "auto"}} src={require("../ui-design/images/admins.png")} alt=""/>
                    }
                </>
                :
                    null
            }
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
                    select === "Protected" ?
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

    const currentUser = useCurrentUser()
    const [show, setShow] = useState<boolean>(false)
    const [point, setPoint] = useState<Point | null>(null)
    const [settings, setSettings] = useState<boolean>(false)
    const { roomId } = useParams()
    const [usersInfo, setUsersInfo] = useState<Array<User>>()
    const [adminIds, setAdminIds] = useState<Array<number>>()
    const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null)
    const [mutedIds, setMutedIds] = useState<Array<number>>()
    const [members, setMembers] = useState<Array<RoomMember>>()
    const [currentUserAuthority, setCurrentUserAuthority] = useState<RoomAuthority>()
    const [socket, setSocket] = useState<Socket | null>(null)

    const setupAuthority = () => {
        const membersArray: Array<RoomMember> = []
        usersInfo?.forEach((user) => {
            if (roomInfo!!.ownerId === user.id)
                membersArray.push({user: user, authority: "LEADER"})
            else if (adminIds!!.includes(user.id))
                membersArray.push({user: user, authority: "ADMIN"})
            else
                membersArray.push({user: user, authority: "NORMAL"})
        })
        setMembers(membersArray)
    }

    const setupCurrentUserAuthority = () => {
        if (roomInfo!!.ownerId === currentUser!!.id)
            setCurrentUserAuthority("LEADER")
        else if (adminIds!!.includes(currentUser!!.id))
            setCurrentUserAuthority("ADMIN")
        else
            setCurrentUserAuthority("NORMAL")
    }

    useEffect(() => {

        const eventListener = () => setShow(false)
        window.addEventListener("click", eventListener)

        if (!roomInfo)
            axios.get(`/chat/room/${roomId}`).then(response => setRoomInfo(response.data))

        if (currentUser && roomInfo) {
            if (!socket)
                setSocket(io(`${process.env.REACT_APP_BACKEND_URI}/chat`, {query: {userId: currentUser.id, roomId: roomId}}))
        
            if (socket){
                socket.on("usersInfoInRoom", (data) => setUsersInfo(data))
                socket.on("adminsInRoom", (data) => setAdminIds(data))
                socket.on("mutedUsersInRoom", (data) => setMutedIds(data))
            }
            
            if(usersInfo && adminIds){
                setupAuthority()
                setupCurrentUserAuthority()
            }
        }

        return () => window.removeEventListener("click", eventListener)
        // eslint-disable-next-line
    }, [currentUser, roomInfo, socket, adminIds, usersInfo, mutedIds, members])

    const backButton = () => {
        window.location.assign("/home")
    }
    
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", flex: "10vh", alignItems: "center"}} >
                    <img className="chatScreenBackImg" onClick={backButton} src={require("../ui-design/images/back.png")} alt=""/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{color: "black", fontSize: "1.6em"}} >{roomInfo?.name}</div>
                        <div style={{color: "black", fontSize: "1.1em"}} >{members?.length} üye</div>
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
                                {
                                     members?.map((value, index) => (
                                        <div className="memberListDiv" key={index} onContextMenu={(context) => {
                                            context.preventDefault()
                                            setPoint({x: context.clientX, y: context.clientY})
                                            setShow(true)
                                            }}>
                                            {chatMemberList(value)}
                                            {show && chatMenu(currentUserAuthority!!, value, point!!)}
                                        </div>
                                     ))
                                }
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
                                                /* messages.map((value, index) => (
                                                    MessageUi("right")
                                                )) */
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