import "../ui-design/styles/LoginScreen.css"

const LoginScreen = () => {

    const loginIntra = (): void => {
        // intra auth işlemleri
        const win: Window = window
        win.location = "/home"
    }

    return (
        <>
            <img src={require("../ui-design/images/logo.png")} alt="" className="img"/>
            <h1 className="text">Pong Oyuna Hoşgeldin !</h1>
            <button onClick={loginIntra} className="button">İntra Girişi</button>
        </>
    )
}

export default LoginScreen