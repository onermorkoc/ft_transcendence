import { UserInfo } from "../../pages/HomeScreen"
import "../../ui-design/styles/CmpMix.css"

const UserInfoCmp = (props: {data: UserInfo}) => {
    return (
        <>
            <div>
                <img src={require("../../ui-design/images/user.png")} className="img2" alt=""/>
                <p className="text2">Ad: {props.data.name}</p>
            </div>

            <div>
                <img src={require("../../ui-design/images/nickname.png")} className="img2" alt=""/>
                <p className="text2">Kullanıcı adı: {props.data.nickname}</p>
            </div>
            
            <div>
                <img src={require("../../ui-design/images/email.png")} className="img2" alt=""/>
                <p className="text2">Email: {props.data.email}</p>
            </div>

            <div>
                <img src={require("../../ui-design/images/google.png")} className="img2" alt=""/>
                <p className="text2">2 adımlı doğrulama: {props.data.google}</p>
            </div>
            
        </>
    )
}

export default UserInfoCmp