import "../ui-design/styles/AchievementsScreen.css"

export const ProgressBar = (props: {height: number, percent: number}) => {

    let barPercent: number = props.percent

    if (barPercent < 10)
        barPercent = 10
    
    const lowerBar = {
        width: "100%",
        height: `${props.height / 3}px`,
        backgroundColor: "whitesmoke",
        borderRadius: `${props.height / 6}px`
    }

    const topBar = {
        width: `${barPercent}%`,
        color:"white",
        fontSize: "1.3em",
        display: "flex",
        justifyContent: "center",
        height: `${props.height}px`,
        alignItems: "center",
        backgroundColor: "blueviolet",
        marginTop: `-${props.height / 3}px`,
        borderRadius: `${props.height / 2}px`
    }

    return (
        <>
            <div style={lowerBar}>
                <div style={topBar}>{props.percent + "%"}</div>
            </div>
        </>
    )
}

const AchievementsViewList = () => {
    return (
        <>
            <div className="achievementsViewDiv">
                <img style={{width: "150px"}} src={require("../ui-design/images/medal.png")} alt=""/>
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                    <div style={{fontSize: "1.5em"}}><span style={{fontWeight: "bold"}}>Ad:</span> İlk Galibiyet</div>
                    <div style={{marginTop: "4px", fontSize: "1.5em"}}><span style={{fontWeight: "bold"}}>Açıklama:</span> Bir oyunda galip gel.</div>
                    <div style={{marginTop: "4px", fontSize: "1.5em"}}><span style={{fontWeight: "bold"}}>Exp:</span> 1000</div>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <ProgressBar height={35} percent={1}/>
                        <img style={{width: "50px", marginLeft: "10px"}} src={require("../ui-design/images/finish.png")} alt=""/>
                    </div>
                </div>
            </div>
        </>
    )
}

const AchievementsScreen = () => {

    const goHomePage = () => {
        window.location.assign("/home")
    }

    return (
        <>
            <div style={{display: "flex", flexDirection: "row", marginRight: "100px"}}>
                <img className="achievementsImgTabDiv" onClick={goHomePage} src={require("../ui-design/images/back.png")} alt=""/>
                <div className="achievementsTextTabDiv">Başarılarım</div>
            </div>

            <div className="achievementsHeaderDiv">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div className="achievementsHeaderRowDiv">
                        <img style={{width: "30px"}} src={require("../ui-design/images/title.png")} alt=""/>
                        <div style={{marginLeft: "10px", fontSize: "1.4em"}}>Level: 1</div>
                    </div>
                    <div className="achievementsHeaderRowDiv">
                        <img style={{width: "30px"}} src={require("../ui-design/images/rank.png")} alt=""/>
                        <div style={{marginLeft: "10px", fontSize: "1.4em"}}>Global Sıralama: 1</div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <ProgressBar height={50} percent={15}/>
                    <img style={{width: "60px", marginLeft: "10px"}} src={require("../ui-design/images/level-up.png")} alt=""/>
                </div>
            </div>

            <div className="achievementsListDiv">
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
                <AchievementsViewList/>
            </div>
        </>
    )
}

export default AchievementsScreen