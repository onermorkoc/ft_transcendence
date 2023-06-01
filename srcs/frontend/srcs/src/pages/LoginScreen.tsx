import "../ui-design/styles/LoginScreen.css"

const LoginScreen = () => {

    const goBackendLogin = async () => {
        window.location.assign(`${process.env.REACT_APP_BACKEND_URI}/auth/login`)
    }

    return (
        <>
            <img src={require("../ui-design/images/logo.png")} alt="" className="logo"/>
            <h1 style={{textAlign: "center", marginTop: "50px", fontSize: "3.5em"}}>Pong Oyuna Hoşgeldin !</h1>
            <button onClick={goBackendLogin} className="loginButton">İntra Girişi</button>
        </>
    )
}

export default LoginScreen