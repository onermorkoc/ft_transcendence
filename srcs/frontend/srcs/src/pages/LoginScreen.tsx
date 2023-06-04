import "../ui-design/styles/LoginScreen.css"

const LoginScreen = () => {

    const login = async () => {
        window.location.assign(`${process.env.REACT_APP_BACKEND_URI}/auth/login`)
    }

    return (
        <>
            <img className="loginLogo" src={require("../ui-design/images/logo.png")} alt=""/>
            <h1 style={{textAlign: "center", marginTop: "50px", fontSize: "3.5em"}}>Pong Oyuna Hoşgeldin !</h1>
            <button className="loginButton" onClick={login} >İntra Girişi</button>
        </>
    )
}

export default LoginScreen