import { useEffect, useRef, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import { User } from "../../dto/DataObject"
import axios from "axios"

const UserInfoCmp = (props: {currentUser: User}) => {

    const [ status2fa, setStatus2fa ] = useState<JSX.Element | null>(null)
    const [ enable2faClick, setEnable2faClick ] = useState<boolean>(false)
    const [ secretKey, setSecretKey ] = useState<string | null>(null)
    const [ qrcode, setQrCode ] = useState<string | null>(null)
    const verifyInputref = useRef<HTMLInputElement>(null)
    
    const disable2fa = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/disable`).then(() => setStatus2fa(inactive2faView))
    }
    
    const active2faView: JSX.Element = <>
        <div className="text2">2 faktörlü kimlik doğrulaması: etkin</div>
        <img className="attachAndUnLinkImg" onClick={disable2fa} src={require("../../ui-design/images/unlink.png")} alt=""/>
    </>
    
    const inactive2faView: JSX.Element = <>
        <div className="text2">2 faktörlü kimlik doğrulaması: devredışı</div>
        <img className="attachAndUnLinkImg" onClick={() => setEnable2faClick(true)} src={require("../../ui-design/images/attach.png")} alt=""/>
    </>

    useEffect(() => {
        
        if (props.currentUser.twoFactorEnabled)
            setStatus2fa(active2faView)
        else
            setStatus2fa(inactive2faView)
        
        if (enable2faClick){
            if (!secretKey)
                axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/generate`).then(response => setSecretKey(response.data))
            if (!qrcode)
                axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/showqr`).then(response => setQrCode(response.data))
        }

    }, [enable2faClick])

    const enable2fa = () => {
        const code = verifyInputref.current?.value

        if (code?.length == 6){
            axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/verify`, {code: code}).then((response) => {
                if (response.data == true){
                    setEnable2faClick(false)
                }
                else {
                    // şifre yanlış
                }
            })
        }
        else{
            // şifre 6 basamaklı olmalı 
        }
    }

    if (enable2faClick){
        return (
            <>
                <div>{secretKey}</div>
                <img src={qrcode!!}></img>
                <input ref={verifyInputref} type="number" placeholder="lütfen doğrulama kodunu giriniz"></input>
                <button onClick={() => setEnable2faClick(false)} >Geri Dön</button>
                <button onClick={enable2fa} >Doğrula</button>
            </>
        )
    }
    else {
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
}

export default UserInfoCmp