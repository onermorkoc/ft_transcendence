import { useEffect, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import { User } from "../../dto/DataObject"
import axios from "axios"
import Enable2faCmp from "./Enable2faCmp"

const enable2fa = () => {
    return (<Enable2faCmp></Enable2faCmp>)
    /* axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/generate`).then((response) => {
        console.log(response.data) // gelen key kullanıcyıya gösterilecek
        // ayrıca bu işlemden sonra /auth/2fa/showqr deki qr code da kullanıcıya gösterilecek
    }) */

    /* axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/verify`, {code: "066487"}).then((response) => {
        console.log(response.data)
    }) */
}

const disable2fa = () => {
    /* axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/disable`).then((response) => {
        // kullanıcı 2fa kapattı   
    }) */
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
        //if (props.currentUser.twoFactorEnabled)
            //setStatus2fa(active2faView)
        //else
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