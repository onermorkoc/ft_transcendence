import "../ui-design/styles/GlobalRankScreen.css"
import { ProgressBar } from "./AchievementsScreen"

const RankViewList = () => {

    /* const goLookProfilePage = (userId: number) => {
        window.location.assign(`/profile/${userId}/rank`)
    } */

    return (
        <>
            <div className="rankViewDiv">
                <img style={{width: "100px", height: "100px", marginRight: "10px"}} src={require("../ui-design/images/first.png")} alt=""/>
                <img style={{width: "100px", height: "100px", borderRadius: "50px", objectFit: "cover"}} src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
                <div className="rankViewUserInfoDiv">
                    <div style={{display: "flex", flexDirection: "row", flex: 1}}>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1}}>
                            <img style={{width: "30px"}} src={require("../ui-design/images/user.png")} alt=""/>
                            <div style={{marginLeft: "10px", fontSize: "1.3em"}}>: Öner Morkoç</div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1}}>
                            <img style={{width: "30px"}} src={require("../ui-design/images/nickname.png")} alt=""/>
                            <div style={{marginLeft: "10px", fontSize: "1.3em"}}>: omorkoc</div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1}}>
                            <img style={{width: "30px"}} src={require("../ui-design/images/title.png")} alt=""/>
                            <div style={{marginLeft: "10px", fontSize: "1.3em"}}>: 1 Level</div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1}}>
                            <img style={{width: "30px"}} src={require("../ui-design/images/rank.png")} alt=""/>
                            <div style={{marginLeft: "10px", fontSize: "1.4em"}}>: 1</div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 1}}>
                        <ProgressBar height={30} percent={15}/>
                        <img style={{width: "50px", marginLeft: "10px"}} src={require("../ui-design/images/level-up.png")} alt=""/>
                    </div>
                </div>
            </div>
        </>
    )
}

const GlobalRankScreen = () => {

    const goHomePage = () => {
        window.location.assign("/home")
    }

    return (
        <>
            <div style={{display: "flex", flexDirection: "row", marginRight: "100px"}}>
                <img className="rankImgTabDiv" onClick={goHomePage} src={require("../ui-design/images/back.png")} alt=""/>
                <div className="rankTextTabDiv">Global Sıralama</div>
            </div>

            <div className="rankViewListDiv">
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
                <RankViewList/>
            </div>
        </>
    )
}

export default GlobalRankScreen