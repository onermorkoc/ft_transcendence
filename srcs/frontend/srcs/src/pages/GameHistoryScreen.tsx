import "../ui-design/styles/GameHistoryScreen.css"

export const historyView = () => {
    return (
        <>
            <div className="historyDiv" >
                <div style={{flex: "1"}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <img className="historyRivalImg" src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg"/>
                        <div style={{fontSize: "1.5em", marginLeft: "10px"}}>
                            <div style={{marginBottom: "8px"}}>Ad: Öner Morkoç</div>
                            <div style={{marginTop: "8px"}}>Ünvan: Çaylak</div>
                        </div>
                    </div>
                </div>

                <div style={{margin: "10px"}}>
                    <img style={{width: "100px"}} src={require("../ui-design/images/historyWin.png")}/>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="skoreBox">10</div>
                        <div className="skoreBox">7</div>
                    </div>
                </div>

                <div style={{flex: "1"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "right", alignItems: "center"}}>    
                        <div style={{fontSize: "1.5em", marginRight: "15px"}}>
                            <div style={{marginBottom: "8px"}}>Ad: Alp Altuğ Yaşar</div>
                            <div style={{marginTop: "8px"}}>Ünvan: Çaylak</div>
                        </div>
                        <img className="historyRivalImg" src="https://cdn.intra.42.fr/users/3519bd7260eb9395ef762149957b6f43/alyasar.jpg"/>
                    </div>
                </div>
            </div>
        </>
    )
}

const GameHistoryCmp = () => {

    const goHomePage = () => {
        window.location.assign("/home")
    }

    return (
        <>
            <div className="gameHistoryTabsDiv">
                <img className="gameHistoryImgTabDiv" onClick={goHomePage} src={require("../ui-design/images/back.png")} alt=""/>
                <div className="gameHistoryTextTabDiv">Maç Geçmişim</div>
            </div>
            
            <div className="historyViewList">
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
                {historyView()}
            </div>
        </>
    )
}

export default GameHistoryCmp