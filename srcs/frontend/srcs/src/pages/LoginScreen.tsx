import { useEffect, useState } from "react"
import "../ui-design/styles/LoginScreen.css"
import axios from "axios"
import Lottie from "lottie-react"
import LoadingJSON from "../ui-design/animation/loading.json"

const LoginScreen = () => {

    const [visible, setVisible] = useState<boolean>(false)

    const login = async () => {
        
        const urlParams = new URLSearchParams(window.location.search)
        const code: string | null = urlParams.get("code")

        if (code != null) {

            setVisible(true)
            localStorage.setItem("USER_BACKEND_SECRET_KEY", code)

            await axios.post(`${process.env.REACT_APP_BACKEND_URI}/users/login`, {data: code}).then((resultCode) => {

                if (resultCode.data){
                    setVisible(false)
                    window.location.assign(`/home/${resultCode.data}`)
                }

            }).catch((error) => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        login()    
    })

    const goIntraLoginPage = (): void => {
        window.location.assign(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_INTRA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_INTRA_REDIRECT_URI}&response_type=code`)
    }

    return (
        <>
            <img src={require("../ui-design/images/logo.png")} alt="" className="logo"/>
            <h1 style={{textAlign: "center", marginTop: "50px", fontSize: "3.5em"}}>Pong Oyuna Hoşgeldin !</h1>
            <button onClick={goIntraLoginPage} className="loginButton">İntra Girişi</button>
            {visible ? <Lottie className="loadingAnimation" animationData={LoadingJSON}/> : null}
        </>
    )
}

export default LoginScreen