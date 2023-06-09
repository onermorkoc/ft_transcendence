import { useEffect, useState } from "react"
import "../../ui-design/styles/CmpMix.css"
import axios from "axios"
import OTPInput from "react-otp-input"
import { User } from "../../dto/DataObject"

const UserInfoCmp = () => {

    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ otp, setOtp ] = useState<string>("")
    const [ warningMessage, setWarningMesage ] = useState<string>("")
    const [ status2fa, setStatus2fa ] = useState<JSX.Element | null>(null)
    const [ enable2faClick, setEnable2faClick ] = useState<boolean>(false)
    const [ secretKey, setSecretKey ] = useState<string | null>(null)
    const [ qrcode, setQrCode ] = useState<string | null>(null)
    

    const disable2fa = () => {
        axios.post(`/auth/2fa/disable`).then(() => setStatus2fa(inactive2faView))
    }

    const active2faView: JSX.Element = <>
        <div className="text2">2 faktörlü kimlik doğrulaması: etkin</div>
        <img className="attachAndUnLinkImg" onClick={disable2fa} src={require("../../ui-design/images/unlink.png")} alt=""/>
    </>
    
    const inactive2faView: JSX.Element = <>
        <div className="text2">2 faktörlü kimlik doğrulaması: devredışı</div>
        <img className="attachAndUnLinkImg" onClick={() => setEnable2faClick(true)} src={require("../../ui-design/images/attach.png")} alt=""/>
    </>

    const enable2fa = () => {
        if (otp.length === 6){
            axios.post(`/auth/2fa/verify`, {code: otp}).then((response) => {
                if (response.data === true){
                    setOtp("")
                    setEnable2faClick(false)
                }
                else
                    setWarningMesage("Geçersiz kod")
            })
        }
        else
            setWarningMesage("Lütfen kodu eksiksiz giriniz")
    }

    useEffect(() => {

        axios.get(`/users/current`).then(response => {
            setCurrentUser(response.data)
            response.data.twoFactorEnabled ? setStatus2fa(active2faView) : setStatus2fa(inactive2faView)
        })

        if (enable2faClick){
            if (!secretKey)
                axios.get(`/auth/2fa/generate`).then(response => setSecretKey(response.data))
            if (!qrcode)
                axios.get(`/auth/2fa/showqr`).then(response => setQrCode(response.data))
        }
        // eslint-disable-next-line
    }, [currentUser, enable2faClick])


    if (enable2faClick){
        return (
            <>
                <div style={{display: "flex", flexDirection: "row"}} >
                    <img style={{marginLeft: "30px"}} src={qrcode!!} alt=""/>
                    <div style={{marginLeft: "10px"}}>
                        <div style={{marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img style={{width: "30px", height: "30px"}} src={require("../../ui-design/images/key.png")} alt=""/>
                            <div style={{fontSize: "1.2em", marginLeft: "10px"}}>{secretKey}</div>
                        </div>
                        <div style={{marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img style={{width: "30px", height: "30px"}} src={require("../../ui-design/images/information.png")} alt=""/>
                            <div style={{fontSize: "1.3em", marginLeft: "10px"}}>İki faktörlü kimlik doğrulamayı etkinleştirmek için lütfen doğrulama kodunu giriniz.</div>
                        </div>
                        {
                            warningMessage !== "" ?
                            <div style={{marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <img style={{width: "30px", height: "30px"}} src={require("../../ui-design/images/warning.png")} alt=""/>
                                <div style={{color: "red", fontSize: "1.3em", marginLeft: "10px"}}>{warningMessage}</div>
                            </div>
                            :
                            <></>
                        }
                        <div style={{marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img style={{width: "30px", height: "30px",marginRight: "6px"}} src={require("../../ui-design/images/secure.png")} alt=""/>
                            <OTPInput inputStyle="verifyTwofaInput" inputType="number" numInputs={6} value={otp} onChange={setOtp} renderInput={(props) => <input {...props}/>}/>
                            <img className="verifyTwofaNextImg" onClick={enable2fa} src={require("../../ui-design/images/next.png")} alt=""/>
                        </div>
                    </div>
                    <img className="verifyCloseImg" onClick={() => setEnable2faClick(false)} src={require("../../ui-design/images/close.png")} alt=""/>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div className="infoRowDiv">
                        <img className="img2" src={require("../../ui-design/images/user.png")} alt=""/>
                        <div className="text2">Ad: {currentUser?.displayname}</div>
                    </div>
    
                    <div className="infoRowDiv">
                        <img className="img2" src={require("../../ui-design/images/nickname.png")} alt=""/>
                        <div className="text2">Kullanıcı adı: {currentUser?.nickname}</div>
                    </div>
                
                    <div className="infoRowDiv">
                        <img className="img2" src={require("../../ui-design/images/email.png")} alt=""/>
                        <div className="text2">Email: {currentUser?.email}</div>
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