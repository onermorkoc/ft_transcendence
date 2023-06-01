import { useEffect, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import { User } from "../../dto/DataObject"

const enable2fa = () => {
    
}

const disable2fa = () => {

}

const activeGoogleView: JSX.Element = <>
    <div className="text2">2 faktörlü kimlik doğrulaması: etkin</div>
    <img onClick={disable2fa} className="attachAndUnLinkImg" src={require("../../ui-design/images/unlink.png")}/>
</>

const inactiveGoogleView: JSX.Element = <>
    <div style={{display: "flex", flexDirection: "row"}}>
        <div className="text2">2 faktörlü kimlik doğrulaması: devredışı</div>
        <img onClick={enable2fa} className="attachAndUnLinkImg" src={require("../../ui-design/images/attach.png")}/>
    </div>
</>

const UserInfoCmp = (props: {data: User}) => {

    const [googleAuth, setGoogleAuth] = useState<JSX.Element>(inactiveGoogleView)

    useEffect(() => {
        if (props.data.twoFactorEnabled){
            setGoogleAuth(activeGoogleView)
        }
    }, [props.data.twoFactorEnabled])

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className="infoRowDiv">
                    <img src={require("../../ui-design/images/user.png")} className="img2" alt=""/>
                    <div className="text2">Ad: {props.data.displayname}</div>
                </div>

                <div className="infoRowDiv">
                    <img src={require("../../ui-design/images/nickname.png")} className="img2" alt=""/>
                    <div className="text2">Kullanıcı adı: {props.data.nickname}</div>
                </div>
            
                <div className="infoRowDiv">
                    <img src={require("../../ui-design/images/email.png")} className="img2" alt=""/>
                    <div className="text2">Email: {props.data.email}</div>
                </div>

                <div className="infoRowDiv">
                    <img src={require("../../ui-design/images/google.png")} className="img2" alt=""/>
                    {googleAuth}
                </div>
            </div>
        </>
    )
}

export default UserInfoCmp