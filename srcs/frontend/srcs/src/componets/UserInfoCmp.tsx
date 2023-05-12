import { useEffect, useState } from "react"
import { UserInfo } from "../App"
import "../ui-design/styles/CmpMix.css"

const activeGoogleView: JSX.Element = <>
    <div className="text2">2 faktörlü kimlik doğrulaması: etkin</div>
</>

const inactiveGoogleView: JSX.Element = <>
    <div style={{display: "flex", flexDirection: "row"}}>
        <div className="text2">2 faktörlü kimlik doğrulaması: devredışı</div>
        {/* buraya google hesabı bağlama butonu koyulabilir. */}
    </div>
</>

const UserInfoCmp = (props: {data: UserInfo}) => {

    const [googleAuth, setGoogleAuth] = useState<JSX.Element>(inactiveGoogleView)

    useEffect(() => {
        if (props.data.google){
            setGoogleAuth(activeGoogleView)
        }
    }, [props.data.google])

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className="infoRowDiv">
                    <img src={require("../ui-design/images/user.png")} className="img2" alt=""/>
                    <div className="text2">Ad: {props.data.name}</div>
                </div>

                <div className="infoRowDiv">
                    <img src={require("../ui-design/images/nickname.png")} className="img2" alt=""/>
                    <div className="text2">Kullanıcı adı: {props.data.nickname}</div>
                </div>
            
                <div className="infoRowDiv">
                    <img src={require("../ui-design/images/email.png")} className="img2" alt=""/>
                    <div className="text2">Email: {props.data.email}</div>
                </div>

                <div className="infoRowDiv">
                    <img src={require("../ui-design/images/google.png")} className="img2" alt=""/>
                    {googleAuth}
                </div>
            </div>
        </>
    )
}

export default UserInfoCmp