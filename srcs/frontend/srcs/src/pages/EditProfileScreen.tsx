import "../ui-design/styles/EditProfileScreen.css"
import { UserInfo } from "../App"
import { useEffect, useRef, useState } from "react"

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

const EditProfileScreen = (props: {data: UserInfo}) => {

    const [previewImg, setPreviewImg] = useState<string>(props.data.photoUrl)

    const nameInputRef = useRef<HTMLInputElement>(null)
    const nicknameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        nameInputRef.current!!.value = props.data.name
        nicknameInputRef.current!!.value = props.data.nickname
    }, [])

    function updateProfileInfo() {
        // backend database tarafında kullanıcının bilgileri güncellenecek.
        // aynı nickname sahip varsa uyarı mesajı gösterilecek
        const win: Window = window
        win.location = "/home"
    }

    return (
        <>
            <div className="box">
                <img src={previewImg} className="currentProfileImage" alt=""/>
                <img src={require("../ui-design/images/add-image.png")} className="selectImageButton"/>
            </div>
        
            <div className="avatarScroolDiv">
                {
                    avatarImgArray.map((value, index) => (
                        <img onClick={() => setPreviewImg(require("../ui-design/images/avatar/" + value))} key={index} src={require("../ui-design/images/avatar/" + value)} className="avatarImgs"/>
                    ))
                }
            </div>

            <input ref={nameInputRef} type="text" placeholder="Adınız: " className="inputBox"></input>
            <input ref={nicknameInputRef} type="text" placeholder="Kullanıcı adınız: " className="inputBox"></input>
            <button onClick={updateProfileInfo} className="updateProfıleInfoButton">Kaydet</button>
        </>
    )
}

export default EditProfileScreen