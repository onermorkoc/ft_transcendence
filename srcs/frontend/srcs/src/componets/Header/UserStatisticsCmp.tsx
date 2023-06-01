import { User } from "../../dto/DataObject"
import "../../ui-design/styles/CmpMix.css"

const UserStatisticsCmp = (props: {data: User}) => {
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/all.png")} className="img2" alt=""/>
                            <div className="text2">Toplam maç: {props.data.totalGame}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/win.png")} className="img2" alt=""/>
                            <div className="text2">Kazanılan: {props.data.totalWin}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/lose.png")} className="img2" alt=""/>
                            <div className="text2">Kaybedilen: {props.data.totalLose}</div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/percent.png")} className="img2" alt=""/>
                            <div className="text2">Kazanma oranı: {props.data.winRate}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/title.png")} className="img2" alt=""/>
                            <div className="text2">Ünvan: {props.data.title}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img src={require("../../ui-design/images/rank.png")} className="img2" alt=""/>
                            <div className="text2">Global sıralama: {props.data.globalRank}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserStatisticsCmp