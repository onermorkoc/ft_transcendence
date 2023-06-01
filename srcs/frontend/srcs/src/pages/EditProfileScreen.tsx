import { User } from "../dto/DataObject"
import "../ui-design/styles/EditProfileScreen.css"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

const avatarImgArray: Array<string> = [
    "avatar-1.png", "avatar-2.png",
    "avatar-3.png", "avatar-4.png",
    "avatar-5.png", "avatar-6.png",
    "avatar-7.png", "avatar-8.png",
    "avatar-9.png", "avatar-10.png",
    "avatar-11.png", "avatar-12.png",
    "avatar-13.png", "avatar-14.png",
    "avatar-15.png", "avatar-16.png",
    "avatar-17.png"
]

const EditProfileScreen = () => {

    const [ currentUserInfo, setCurrentUserInfo ] = useState<User | null>(null)
    const [ previewImg, setPreviewImg ] = useState<string | null>(null)
    const [ warningMessage, setWarnnigMessage ] = useState<string>("")
    const displaynameInputRef = useRef<HTMLInputElement>(null)
    const nicknameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/user/current`).then((response) => {
            setCurrentUserInfo(response.data)
            displaynameInputRef.current!!.value = response.data.displayname
            nicknameInputRef.current!!.value = response.data.nickname
        })
    }, [])

    function updateProfileInfo() {

        const newNickname = nicknameInputRef.current!!.value
        const newDisplayname = displaynameInputRef.current!!.value

        if (newDisplayname !== "" && newNickname !== ""){
            
            const newUserInfo: Partial<User> = {
                id: currentUserInfo?.id,
                displayname: newDisplayname,
                nickname: newNickname
                // photoUrl:    => avatar güncelleme şuanlık yok 
            }
    
            axios.put(`${process.env.REACT_APP_BACKEND_URI}/user/update`, newUserInfo).then((resultCode) => {
                if(resultCode.data === 0){
                    window.location.assign(`/home`)
                }else{
                    setWarnnigMessage("Bu nickname önceden alınmış !")
                }
            }).catch((error) => {
                console.log(error)
            })
        }else {
            setWarnnigMessage("Gerekli bilgiler eksik olamaz !")
        }
    }

    function selectLocalImage() {
        // kullanıcı kendı avatarını yüklüyebilecek.
    }

    if(currentUserInfo){

        if(previewImg == null)
            setPreviewImg(currentUserInfo.photoUrl)

        return (
            <>
                <div className="previewDiv">
                    <img src={previewImg!!} className="previewProfileImg" alt=""/>
                    <img onClick={selectLocalImage} src={require("../ui-design/images/add-image.png")} className="selectImgButton" alt=""/>
                </div>
                <div className="warningMessage">{warningMessage}</div>
            
                <div className="avatarScroolDiv">
                    {
                        avatarImgArray.map((value, index) => (
                            <img onClick={() => setPreviewImg(require("../ui-design/images/avatar/" + value))} key={index} src={require("../ui-design/images/avatar/" + value)} className="avatarImgs" alt=""/>
                        ))
                    }
                </div>
    
                <input ref={displaynameInputRef} type="text" placeholder="Adınız: " className="inputBox"></input>
                <input ref={nicknameInputRef} type="text" placeholder="Kullanıcı adınız: " className="inputBox"></input>
                <button onClick={updateProfileInfo} className="updateProfileInfoButton">Kaydet</button>
            </>
        )
    }
    return(<></>)
}
export default EditProfileScreen