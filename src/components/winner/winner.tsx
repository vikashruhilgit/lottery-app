import { useState } from "react"

import web3 from "../../lib/web3"

import lottery from "../../lib/lottery"
import Loader from "../loader/loader"

import classses from "./winner.module.scss"

type ErrorCustom = {
  code: number;
  message: string;
}

export default function Winner() {
  const [service, setService] = useState<{
    isError?: boolean;
    error?: ErrorCustom | null;
    isLoading?: boolean;
    result?: {
      blockHash: string;
      blockNumber: number;
      transactionHash: string;
      gasUsed: number;
    } | null;
  }>({});

  const pickWinner = async () => {
    setService((service) => ({
      ...service,
      isError: false,
      isLoading: true,
      error: null,
      result: null
    }))

    try {
      const accounts = await web3.eth.getAccounts();
      const ownerP = await lottery.methods.owner().call();

      if (ownerP === accounts[0]) {
        const tx = await lottery.methods.winner().send({
          from: accounts[0],
        })
        setService((service) => ({
          ...service,
          isError: false,
          isLoading: false,
          result: tx
        }))
      }
    } catch (e) {
      setService((service) => ({
        ...service,
        isError: true,
        isLoading: false,
        error: e as ErrorCustom
      }))
    }
  }

  console.log(service);

  return (
    <section>
      <p><button onClick={pickWinner}>Pick Winner</button> {service.isLoading && <Loader />}</p>
      {service.error &&
        <p className={classses.Error}>{service.error.message}</p>}
      {(service.result) &&
        <p>Transection successfully, your transection Hash is: {service.result.transactionHash}</p>}
    </section>
  )
}
