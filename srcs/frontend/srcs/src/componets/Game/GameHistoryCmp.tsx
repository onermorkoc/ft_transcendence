import "../../ui-design/styles/CmpMix.css"

const historyView = () => {
    return (
        <>

            <div className="historyDiv" >
                <div style={{flex: "1"}}>
                    <div className="historyHeaderDiv">Ev Sahibi</div>
                    <div style={{display: "flex", flexDirection: "row", marginTop: "15px", alignItems: "center"}}>
                        <img className="historyRivalImg" src={""}/>
                        <div style={{fontSize: "1.5em", marginLeft: "10px"}}>
                            <div style={{marginBottom: "8px"}}>Ad: Alp Altuğ Yaşar</div>
                            <div style={{marginTop: "8px"}}>Ünvan: Çaylak</div>
                        </div>
                    </div>
                </div>

                <div style={{margin: "10px"}}>
                    <img className="historyResultImg" src={require("../../ui-design/images/historyWin.png")}/>
                    <div className="historySkoreBoardDiv">
                        <div className="skoreBox">10</div>
                        <div className="skoreBox">7</div>
                    </div>
                </div>


                <div style={{flex: "1"}}>
                    <div className="historyHeaderDiv">Rakip Oyuncu</div>
                    <div style={{display: "flex", flexDirection: "row", marginTop: "15px", justifyContent: "right", alignItems: "center"}}>    
                        <div style={{fontSize: "1.5em", marginRight: "15px"}}>
                            <div style={{marginBottom: "8px"}}>Ad: Alp Altuğ Yaşar</div>
                            <div style={{marginTop: "8px"}}>Ünvan: Çaylak</div>
                        </div>
                        <img className="historyRivalImg" src={""}/>
                    </div>
                </div>
            </div>
        </>
    )
}

const GameHistoryCmp = () => {
    
    let array: Array<number> = [0,1,2,3,4,5,6,7,8,9]

    return (
        <>
            <div className="gameHistoryHeader"> Öner Morkoç Maç Geçmişi</div>
            {
                array.map(() => (
                    <div className="historyView">{historyView()}</div>
                ))
            }
        </>
    )
}

export default GameHistoryCmp