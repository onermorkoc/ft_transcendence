import "../ui-design/styles/ChatScreen.css"

const ChatScreen = () => {

    const admins: Array<number> = [0,1, 3]

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                
                <div style={{display: "flex", flexDirection: "row", flex: "10vh", backgroundColor: "rgb(30,30,30)", alignItems: "center"}} >
                    <img style={{width: "30px", height: "30px", padding: "20px"}} src={require("../ui-design/images/back.png")} alt=""/>
                    <img style={{width: "55px", height: "55px", margin: "10px"}} src={require("../ui-design/images/team.png")} alt=""/>
                    <div style={{display: "flex", flexDirection: "column", color: "white"}}>
                        <div style={{fontSize: "1.5em"}} >Kurtlar Sofrası</div>
                        <div style={{fontSize: "1.2em"}} >18 üye, 5 çevrimiçi</div>
                    </div>
                </div>
                
                <div style={{display: "flex", flexDirection: "row", flex: "90vh"}}>
                    
                    <div style={{display: "flex", flexDirection: "column", flex: "2", backgroundColor: "rgb(30,30,30)"}}>
                        
                        <div style={{display: "flex", flexDirection: "column", color: "white", flex: "1"}}>
                            
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "rgb(60,60,60)", marginRight: "10px", marginBottom: "10px", marginLeft: "10px", padding: "10px", fontSize: "1.5em"}}>
                                <img style={{width: "50px", height: "50px"}} src={require("../ui-design/images/owner.png")} alt=""/>
                                <div>Lider</div>
                            </div>

                            <div style={{display: "flex", flexDirection: "row", margin: "10px"}}>
                                <img style={{width: "50px", height: "50px", borderRadius: "25px", objectFit: "cover"}} src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
                                <div style={{display: "flex", flexDirection: "column", fontSize: "1.1em", marginLeft: "10px", justifyContent: "center"}}>
                                    <div>Öner Morkoç</div>
                                    <div>çevrimiçi</div>
                                </div>
                            </div>

                        </div>
                        
                        <div style={{display: "flex", flexDirection: "column", color: "white", flex: "2"}}>

                            <div style={{display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "rgb(60,60,60)", margin: "10px", padding: "10px", fontSize: "1.5em"}}>
                                <img style={{width: "50px", height: "50px"}} src={require("../ui-design/images/admins.png")} alt=""/>
                                <div style={{marginLeft: "10px"}}>Yöneticiler</div>
                            </div>
                            
                            {
                                admins.map((value, index) => (
                                    <div style={{display: "flex", flexDirection: "row", margin: "10px"}} key={index}>
                                        <img style={{width: "50px", height: "50px", borderRadius: "25px", objectFit: "cover"}} src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
                                        <div style={{display: "flex", flexDirection: "column", fontSize: "1.1em", marginLeft: "10px", justifyContent: "center"}}>
                                            <div>Öner Morkoç</div>
                                            <div>çevrimiçi</div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>

                        <div style={{display: "flex", flexDirection: "column", color: "white", flex: "2", fontSize: "1.5em"}}>

                            <div style={{display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "rgb(60,60,60)", margin: "10px", padding: "10px"}}>
                                <img style={{width: "50px", height: "50px"}} src={require("../ui-design/images/members.png")} alt=""/>
                                <div style={{marginLeft: "10px"}}>Üyeler</div>
                            </div>
                            <div>Üyelerin Bilgisi</div>

                        </div>
                    </div>

                    <div className="chatMessagesRoot" style={{display: "flex", flexDirection: "column", flex: "10"}}>
                        
                        <div style={{flex: "9"}} > Mesajlar</div>
                        
                        <div style={{display: "flex", flexDirection: "row",  flex: "1", justifyContent: "center", alignItems: "center", marginBottom: "20px"}}>
                            <img style={{width: "60px", height: "60px", marginRight: "20px"}} src={require("../ui-design/images/game-request.png")} alt=""/>
                            <input style={{width: "800px", height: "55px", borderRadius: "30px", paddingLeft: "20px", paddingRight: "20px", fontSize: "1.5em", color: "white", backgroundColor: "rgb(60,60,60)"}} type="text" placeholder="Mesaj" />
                            <img style={{width: "60px", height: "60px", marginLeft: "20px"}} src={require("../ui-design/images/send.png")} alt=""/>
                        </div>

                    </div>

                </div> 
            </div>
        </>
    )
}

export default ChatScreen