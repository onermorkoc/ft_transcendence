import { User } from "../dto/DataObject"
import "../ui-design/styles/EditProfileScreen.css"
import React, { useEffect, useRef, useState } from "react"
import axios from "axios"

const pathToFile = async (path: string, filename: string): Promise<File> => {
    const data = await (await fetch(path)).blob()
    return (new File([data], filename, {type: "image/png"}))
}

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

    const [ localImgFile, setLocalImgFile ] = useState<File | null>(null)
    const [ currentUserInfo, setCurrentUserInfo ] = useState<User | null>(null)
    const [ previewImg, setPreviewImg ] = useState<string | null>(null)
    const [ warningMessage, setWarnnigMessage ] = useState<string>("")
    const displaynameInputRef = useRef<HTMLInputElement>(null)
    const nicknameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/current`).then((response) => {
            setCurrentUserInfo(response.data)
            displaynameInputRef.current!!.value = response.data.displayname
            nicknameInputRef.current!!.value = response.data.nickname
        })
    }, [])

    const updateProfileInfo = async() => {

        const newNickname = nicknameInputRef.current!!.value
        const newDisplayname = displaynameInputRef.current!!.value

        if (newDisplayname !== "" && newNickname !== ""){

            const newUserInfo: Partial<User> = {
                id: currentUserInfo?.id,
                displayname: newDisplayname,
                nickname: newNickname
            }
    
            await axios.put(`${process.env.REACT_APP_BACKEND_URI}/users/update`, newUserInfo).then( async (resultCode) => {
                if(resultCode.data === 0){

                    if (localImgFile != null){
                        const form = new FormData()
                        form.append("avatar", localImgFile)
                        await axios.post(`${process.env.REACT_APP_BACKEND_URI}/users/upload/avatar`, form)
                    }
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

    const setImgData = async (event?: React.ChangeEvent<HTMLInputElement> | null, value?: string) => {
        if (event && event.target.files){
            setLocalImgFile(event.target.files[0])
            setPreviewImg(URL.createObjectURL(event.target.files[0]))
        }
        if (value){
            setPreviewImg(require(`../ui-design/images/avatar/${value}`))
            setLocalImgFile(await pathToFile(require(`../ui-design/images/avatar/${value}`), value))
        }
    }

    if(currentUserInfo){

        if(previewImg == null)
            setPreviewImg(currentUserInfo.photoUrl)

        return (
            <>
                <div className="previewDiv">
                    <img src={previewImg!!} className="previewProfileImg" alt=""/>
                    <div className="selectImgButton" >
                        <input onChange={event => setImgData(event)} className="hideInputView" type="file" accept="image/png, image/jpg, image/jpeg, image/webp"/>
                    </div>
                </div>
                <div className="warningMessage">{warningMessage}</div>
            
                <div className="avatarScroolDiv">
                    {
                        avatarImgArray.map((value, index) => (
                            <img onClick={() => setImgData(null, value)} key={index} src={require("../ui-design/images/avatar/" + value)} className="avatarImgs" alt=""/>
                        ))
                    }
                </div>
    
                <input ref={displaynameInputRef} type="text" placeholder="Adınız: " className="inputBox"></input>
                <input ref={nicknameInputRef} type="text" placeholder="Kullanıcı adınız: " className="inputBox"></input>
                <button onClick={updateProfileInfo} className="updateProfileInfoButton">Kaydet</button>
            </>
        )
    }
    return(
        <>
            {/* <div>Test: Sayfa bulunamadı 404</div> */}
        </>
    )
}
export default EditProfileScreen