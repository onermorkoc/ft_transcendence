import { useEffect, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import { User } from "../../dto/DataObject"

const enable2fa = () => {
    
}

const disable2fa = () => {

}

const active2faView: JSX.Element = <>
    <div className="text2">2 faktörlü kimlik doğrulaması: etkin</div>
    <img className="attachAndUnLinkImg" onClick={disable2fa} src={require("../../ui-design/images/unlink.png")} alt=""/>
</>

const inactive2faView: JSX.Element = <>
    <div className="text2">2 faktörlü kimlik doğrulaması: devredışı</div>
    <img className="attachAndUnLinkImg" onClick={enable2fa} src={require("../../ui-design/images/attach.png")} alt=""/>
</>

const UserInfoCmp = (props: {currentUser: User}) => {

    const [status2fa, setStatus2fa] = useState<JSX.Element | null>(null)

    useEffect(() => {
        if (props.currentUser.twoFactorEnabled)
            setStatus2fa(active2faView)
        else
            setStatus2fa(inactive2faView)
    }, [])

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className="infoRowDiv">
                    <img className="img2" src={require("../../ui-design/images/user.png")} alt=""/>
                    <div className="text2">Ad: {props.currentUser.displayname}</div>
                </div>

                <div className="infoRowDiv">
                    <img className="img2" src={require("../../ui-design/images/nickname.png")} alt=""/>
                    <div className="text2">Kullanıcı adı: {props.currentUser.nickname}</div>
                </div>
            
                <div className="infoRowDiv">
                    <img className="img2" src={require("../../ui-design/images/email.png")} alt=""/>
                    <div className="text2">Email: {props.currentUser.email}</div>
                </div>

                <div className="infoRowDiv">
                    <img className="img2" src={require("../../ui-design/images/google.png")} alt=""/>
                    {status2fa}
                </div>
            </div>
        </>
    )
}

export default UserInfoCmp