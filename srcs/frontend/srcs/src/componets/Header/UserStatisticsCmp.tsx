import { User } from "../../dto/DataObject"
import "../../ui-design/styles/CmpMix.css"

const UserStatisticsCmp = (props: {currentUser: User}) => {
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/all.png")} alt=""/>
                            <div className="text2">Toplam maç: {props.currentUser.totalGame}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/win.png")} alt=""/>
                            <div className="text2">Kazanılan: {props.currentUser.totalWin}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/lose.png")} alt=""/>
                            <div className="text2">Kaybedilen: {props.currentUser.totalLose}</div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/percent.png")} alt=""/>
                            <div className="text2">Kazanma oranı: {props.currentUser.winRate}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/title.png")} alt=""/>
                            <div className="text2">Ünvan: {props.currentUser.title}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/rank.png")} alt=""/>
                            <div className="text2">Global sıralama: {props.currentUser.globalRank}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserStatisticsCmp