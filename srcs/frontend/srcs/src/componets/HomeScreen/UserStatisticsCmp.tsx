import { UserInfo } from "../../App"
import "../../ui-design/styles/CmpMix.css"

const UserStatisticsCmp = (props: {data: UserInfo}) => {
    return (
        <>
            <div className="gridDiv">
                <div className="grid-row1">
                    <div>
                        <img src={require("../../ui-design/images/all.png")} className="img2" alt=""/>
                        <p className="text2">Toplam maç: {props.data.statistics.totalGame}</p>
                    </div>
                    <div>
                        <img src={require("../../ui-design/images/win.png")} className="img2" alt=""/>
                        <p className="text2">Kazanılan: {props.data.statistics.totalWin}</p>
                    </div>
                </div>
                <div className="grid-row2">
                    <div>
                        <img src={require("../../ui-design/images/lose.png")} className="img2" alt=""/>
                        <p className="text2">Kaybedilen: {props.data.statistics.totalLose}</p>
                    </div>
                    <div>
                        <img src={require("../../ui-design/images/percent.png")} className="img2" alt=""/>
                        <p className="text2">Kazanma oranı: {props.data.statistics.winRate}</p>
                    </div>
                </div>
                <div className="grid-row3">
                    <div>
                        <img src={require("../../ui-design/images/title.png")} className="img2" alt=""/>
                        <p className="text2">Ünvan: {props.data.statistics.title}</p>
                    </div>
                    <div>
                        <img src={require("../../ui-design/images/rank.png")} className="img2" alt=""/>
                        <p className="text2">Global sıralama: {props.data.statistics.globalRank}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserStatisticsCmp