import Lottie, { LottieRefCurrentProps }  from "lottie-react"
import { useEffect, useRef, useState} from "react"
import { Socket, io } from "socket.io-client"
import { User } from "../../dto/DataObject"
import axios from "axios"

function secondToTime(second: number): string {
    let minute = Math.floor(second / 60)
    let second2 = second % 60
    let strMinute: string = `${minute}`
    let strSecond2: string = `${second2}`
    if (minute < 10)
        strMinute = `0${minute}`
    if (second2 < 10)
        strSecond2 = `0${second2}`
    return (strMinute + ":" + strSecond2)
}

const RandomMatchGameCmp = () => {
    
    const animationRef = useRef<LottieRefCurrentProps>(null)
    const [second, setSecond] = useState<number>(0)
    const [searchStatus, setSearchStatus] = useState<boolean>(false)
    let intervalID: NodeJS.Timer

    const [socket, setSocket] = useState<Socket | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    axios.get(`/users/current`).then((response) => {setCurrentUser(response.data)})
    const [matchLink, setMatchLink] = useState<string>('')

    const randomMatch = async () => {
        if (!currentUser) {return;}
        const currentGameId: string = (await axios.get(`users/currentgameid/${currentUser.id}`)).data;
        if (currentGameId !== '') {
            console.log(currentGameId);
            window.location.assign(`/game/${currentGameId}`);
        }
        //window.location.assign("/game")
        if(!searchStatus){
            animationRef.current!!.play()
            setSecond(0)
            setSearchStatus(true)
            // rastgele birinn eşleşmesini bekler
        }
    }

    const cancelRandomMatch = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        animationRef.current!!.stop()
        setSearchStatus(false)
        // rastgele eşleşme istegi iptal         
    }

    useEffect(() => {
        if (searchStatus){
            // eslint-disable-next-line
            intervalID = setInterval(() => {
                setSecond(second => second + 1)
            }, 1000)
        }
        return () => clearInterval(intervalID)
    }, [searchStatus])

    useEffect(() => {
        if (matchLink !== '') {
            window.location.assign(matchLink)
        }
    }, [matchLink])

    useEffect(() => {
        if (searchStatus) {
            if (currentUser && !socket) {
                setSocket(io(`${process.env.REACT_APP_BACKEND_URI}/queue`, {query: {userId: currentUser.id}}))
            }
            if (socket) {
                socket.on("matchFound", (data: string) => setMatchLink(data))
            }
        }
    }, [currentUser, searchStatus, socket])

    return (
        <>
            <div style={{margin: "50px"}}>
                <Lottie className="gameAnimation" autoplay={false} lottieRef={animationRef} onClick={randomMatch} animationData={require("../../ui-design/animation/game.json")}/>
                {
                    searchStatus ? 
                        <div>
                            <div style={{textAlign: "center", fontSize: "1.7em", marginTop: "20px"}}>Rakip aranıyor...</div>
                            <div style={{textAlign: "center", fontSize: "1.7em", marginTop: "10px"}}>{secondToTime(second)}</div>
                            <img className="cancelButton" onClick={cancelRandomMatch} src={require("../../ui-design/images/cancel.png")} alt=""/>
                        </div>
                    : 
                        null
                }
            </div>
        </>
    )
}

export default RandomMatchGameCmp