import axios from "axios"
import { useEffect, useState } from "react"

const Enable2faCmp = () => {

    const [ secretKey, setSecretKey ] = useState<string | null>(null)
    const [ qrcode, setQrCode ] = useState<string | null>(null)

    useEffect(() => {
        if (!secretKey)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/generate`).then(response => setSecretKey(response.data))
        if (!qrcode)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/2fa/showqr`).then(response => setQrCode(response.data))
    }, [])

    return (
        <>
            <div>{secretKey}</div>
            <img src={qrcode!!}></img>
            <input type="number" placeholder="lütfen doğrulama kodunu giriniz"></input>
            <button>Doğrula</button>
        </>
    )
}

export default Enable2faCmp