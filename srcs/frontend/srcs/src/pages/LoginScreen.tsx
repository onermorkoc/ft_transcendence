import "../ui-design/styles/LoginScreen.css"

const LoginScreen = () => {

    const loginIntra = (): void => {
        // intra auth işlemleri
        const win: Window = window
        win.location = "/home"
    }

    return (
        <>
            <img src={require("../ui-design/images/logo.png")} alt="" className="logo"/>
            <h1 style={{textAlign: "center", marginTop: "50px", fontSize: "3.5em"}}>Pong Oyuna Hoşgeldin !</h1>
            <button onClick={loginIntra} className="loginButton">İntra Girişi</button>
        </>
    )
}

export default LoginScreen