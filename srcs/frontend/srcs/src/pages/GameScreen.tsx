import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFoundCmp from "../componets/PageNotFoundCmp";

const GameScreen = () => {

  const [connectControl, setConnectControl] = useState<boolean>(false)
  const { gameId } = useParams()

  useEffect(() => {
    axios.get(`/game/join/${gameId}`).then((response) => {setConnectControl(response.data)})
  }, [])


  if (connectControl) {
    return (
      <div className='gameRoot'>
      </div>
    );
  }
  else {
    return (<PageNotFoundCmp/>)
  }
}

export default GameScreen;
