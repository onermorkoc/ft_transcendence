import { useParams } from "react-router-dom"
import { GameRooms, testGameRoomsList } from "../App"
import "../ui-design/styles/GameScreen.css"

const GameScreen = () => {
    
    const { matchID } = useParams()

    const matchInfoData: GameRooms = testGameRoomsList.find((value: GameRooms): boolean => { return value.id === matchID})!!

    return (
        <>
            <div style={{display: "flex", flexDirection: "row", marginTop: "30px", justifyContent: "center"}}>
                
                <div style={{display: "flex", flexDirection: "row", maxHeight: "100px", marginTop: "25px"}}>
                    
                    <img className="matchAvatarImg" src={matchInfoData.founder.photoUrl} alt=""/>
                    
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">{matchInfoData.founder.name}</div>
                        <div className="matchUserInfo">Ünvan: {matchInfoData.founder.statistics.title}</div>
                    </div>

                    <div className="skoreTable">05</div>
                </div>
                
                <img style={{width: "150px", height: "150px", marginLeft: "30px", marginRight: "30px"}} src={require("../ui-design/images/vs.png")} alt=""/>
                
                <div style={{display: "flex", flexDirection: "row", maxHeight: "100px", marginTop: "25px"}}>
                    
                    <div className="skoreTable">03</div>
                    
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">{matchInfoData.rival.name}</div>
                        <div className="matchUserInfo">Ünvan: {matchInfoData.rival.statistics.title}</div>
                    </div>
                
                    <img className="matchAvatarImg" src={matchInfoData.rival.photoUrl} alt=""/>

                </div>
            </div>

            <img style={{display: "block", height: "700px", width: "800px", marginLeft: "auto", marginRight: "auto"}} src={require("../ui-design/images/test.png")} alt=""/>
        </>
    )
}

export default GameScreen