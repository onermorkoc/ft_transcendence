import { useEffect, useState } from "react"
import "../ui-design/styles/LoginScreen.css"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { IntraUserInfo } from "../dto/DataObject"
import Lottie from "lottie-react"
import LoadingJSON from "../ui-design/animation/loading.json"

const LoginScreen = () => {

    const [loadingAnimation, setLoadingAimation] = useState<boolean>(false)

    const loadingAnimationStatus = (): JSX.Element | null => {
        if (loadingAnimation)
            return (<Lottie animationData={LoadingJSON}/>)
        return (null)
    }

    const sendBackendInraData = async (response: AxiosResponse<any>) => {
        const intraUserInfo: IntraUserInfo = {
            id: response.data.id,
            displayname: response.data.displayname,
            nickname: response.data.login,
            email: response.data.email,
            photoUrl: response.data.image.link
        }

        await axios.post(`${process.env.REACT_APP_BACKEND_URI}/users/login`, intraUserInfo).then((resultCode) => {
            if (resultCode){
                setLoadingAimation(false)
                window.location.assign("/home")
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const getIntraData = async () => {
        
        const urlParams = new URLSearchParams(window.location.search)
        const code: string | null = urlParams.get("code")
        
        if (code != null){

            setLoadingAimation(true)

            const requestConfig: AxiosRequestConfig = {
                url: "/oauth/token",
                baseURL: "https://api.intra.42.fr",
                method: "post",
                auth: {
                    username: `${process.env.REACT_APP_INTRA_CLIENT_ID}`,
                    password: `${process.env.REACT_APP_INTRA_SECRET}`
                },
                data: {
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: `${process.env.REACT_APP_INTRA_REDIRECT_URI}`
                }
            }
            
            await axios.request(requestConfig).then( async (response) => {
                await axios.get(`https://api.intra.42.fr/v2/me?access_token=${response.data.access_token}&token_type=${response.data.token_type}`).then((userInfoData) => {
                    sendBackendInraData(userInfoData)
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        getIntraData()    
    })

    const goIntraLoginPage = (): void => {
        window.location.assign(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_INTRA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_INTRA_REDIRECT_URI}&response_type=code`)
    }

    return (
        <>
            <img src={require("../ui-design/images/logo.png")} alt="" className="logo"/>
            <h1 style={{textAlign: "center", marginTop: "50px", fontSize: "3.5em"}}>Pong Oyuna Hoşgeldin !</h1>
            <button onClick={goIntraLoginPage} className="loginButton">İntra Girişi</button>
            <div className="loadingAnimation">{loadingAnimationStatus()}</div>
        </>
    )
}

export default LoginScreen