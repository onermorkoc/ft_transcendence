import { UserInfo } from "../../App"
import "../../ui-design/styles/CmpMix.css"

const UserInfoCmp = (props: {data: UserInfo}) => {
    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className="infoRowDiv">
                    <img src={require("../../ui-design/images/user.png")} className="img2" alt=""/>
                    <div className="text2">Ad: {props.data.name}</div>
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
                    <div className="text2">2 adımlı doğrulama: {props.data.google}</div>
                </div>
            </div>
        </>
    )
}

export default UserInfoCmp