
import { useCallback, useEffect, useState } from "react"

import web3 from "../../lib/web3"
import lottery from "../../lib/lottery"
import Loader from "../loader/loader"

type WelcomeState = {
  owner: string;
  balance: string;
  players: string[];
  isloading?: boolean
}

export default function Welcome() {

  const [welcomeState, setWelcomeState] = useState<WelcomeState>({
    owner: "",
    balance: "",
    players: [],
  });

  const loadData = useCallback(
    async () => {
      const ownerP: Promise<string> = lottery.methods.owner().call();
      // alternate to get balance:  await web3.eth.getBalance(lottery.options.address);
      const balanceP: Promise<string> = lottery.methods.lotteryBalance().call();
      const playersP: Promise<string[]> = lottery.methods.getPlayers().call();
      const [owner, balance, players] = await Promise.all([ownerP, balanceP, playersP]);
      setWelcomeState({
        owner,
        balance,
        players
      })
    }, []);

  useEffect(() => {
    loadData()
  }, [loadData])

  const refreshValue = async () => {
    setWelcomeState(state => ({
      ...state,
      isloading: true
    }))
    try {
      const balanceP: Promise<string> = lottery.methods.lotteryBalance().call();
      const playersP: Promise<string[]> = lottery.methods.getPlayers().call();
      const [balance, players] = await Promise.all([balanceP, playersP]);
      setWelcomeState(state => ({
        ...state,
        balance,
        players,
        isloading: false
      }))
    } catch (e) {
      setWelcomeState(state => ({
        ...state,
        isloading: false
      }))
    }
  }

  return (
    <section>
      <header>
        <h1>Welcome to the Lottry App</h1>
        <p>Owner Address: {welcomeState.owner}</p>
        <p>Currently there are {welcomeState.players.length} people registred, competing to win the Lottery Amount of: {web3.utils.fromWei(welcomeState.balance, "ether")} Ether</p>
        <p><button onClick={refreshValue}>Refresh Amount and List</button> {welcomeState.isloading && <Loader />}</p>
      </header>
    </section>
  )
}
