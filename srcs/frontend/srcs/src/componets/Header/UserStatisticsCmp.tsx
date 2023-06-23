import { useEffect, useState } from "react"
import useCurrentUser from "../../services/Auth"
import "../../ui-design/styles/CmpMix.css"

const UserStatisticsCmp = () => {

    const currentUser = useCurrentUser()
    const [totalLose, setTotalLose] = useState<number | null>(null)
    const [winRate, setWinRate] = useState<number | null>(null)

    useEffect(() => {
        if (currentUser){
            setTotalLose(currentUser!!.totalGame - currentUser!!.totalWin)
            setWinRate((currentUser!!.totalWin / currentUser!!.totalGame) * 100) // 0/0 = NaN
        }
    }, [currentUser])

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/all.png")} alt=""/>
                            <div className="text2">Toplam maç: {currentUser?.totalGame}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/win.png")} alt=""/>
                            <div className="text2">Kazanılan: {currentUser?.totalWin}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/lose.png")} alt=""/>
                            <div className="text2">Kaybedilen: {totalLose}</div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", margin: "30px"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/percent.png")} alt=""/>
                            <div className="text2">Kazanma oranı: {winRate}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/title.png")} alt=""/>
                            <div className="text2">Ünvan: {/* currentUser?.title */}</div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="img2" src={require("../../ui-design/images/rank.png")} alt=""/>
                            <div className="text2">Global sıralama: {/* currentUser?.globalRank */}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserStatisticsCmp