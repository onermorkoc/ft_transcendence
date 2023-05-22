import { useParams } from "react-router-dom"
import "../ui-design/styles/GameScreen.css"
import { GameRoom, allGameRoomList } from "../dto/DataObject"

const GameScreen = () => {
    
    const { matchID } = useParams()

    const matchInfoData: GameRoom = allGameRoomList.find((value: GameRoom): boolean => { return value.id === matchID})!!

    return (
        <>
            {/* <div className="gameScreenRootDiv">
                <div className="gameScreenUsersInfoDiv">
                    <img className="matchAvatarImg" src={matchInfoData.founder.photoUrl} alt=""/>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">{matchInfoData.founder.name}</div>
                        <div className="matchUserInfo">Ünvan: {matchInfoData.founder.statistics.title}</div>
                    </div>
                    <div className="skoreTable">05</div>
                </div>
                <img className="vsImg" src={require("../ui-design/images/vs.png")} alt=""/>
                <div className="gameScreenUsersInfoDiv">
                    <div className="skoreTable">03</div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">{matchInfoData.rival.name}</div>
                        <div className="matchUserInfo">Ünvan: {matchInfoData.rival.statistics.title}</div>
                    </div>
                    <img className="matchAvatarImg" src={matchInfoData.rival.photoUrl} alt=""/>
                </div>
            </div>
            <img className="testGameField" src={require("../ui-design/images/test.png")} alt=""/> */}
        </>
    )
}

export default GameScreen