import Lottie from "lottie-react"
import "../ui-design/styles/TwoFactorAuthScreen.css"
import OTPInput from "react-otp-input"
import { useState } from "react"
import axios from "axios"

const TwoFactorAuthScreen = () => {

    const [otp, setOtp] = useState<string>("")

    const twofaValidate = () => {
        if (otp.length == 6){
            axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/validate`, {code: otp}).then((response) => {
                if (response.data == true){
                    window.location.assign("/home")
                }
            })
        }
    }

    return (
        <>
            <Lottie className="twofaAnimation" animationData={require("../ui-design/animation/shield.json")}/>
            <div className="two2faOtpDiv">
                <OTPInput inputStyle="twofaInput" inputType="number" value={otp} onChange={setOtp} numInputs={6} renderInput={(props) => <input {...props}/>}/>
            </div>
            <button onClick={twofaValidate} className="verifyButton">Doğrula</button>
        </>
    )
}

export default TwoFactorAuthScreen