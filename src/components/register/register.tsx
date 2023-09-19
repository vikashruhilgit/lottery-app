import { FormEvent, FormEventHandler, useRef, useState } from "react"

import web3 from "../../lib/web3"

import lottery from "../../lib/lottery"
import Loader from "../loader/loader"

import classses from "./register.module.scss"

type ErrorCustom = {
  code: number;
  message: string;
}

export default function Register() {

  const inputRef = useRef<HTMLInputElement>(null)
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

  const registerHandler: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current || !inputRef.current.value || parseFloat(inputRef.current?.value) <= .0001) {
      setService((service) => ({
        ...service,
        isError: true,
        error: null,
        result: null
      }))
      return;
    }

    setService((service) => ({
      ...service,
      isError: false,
      isLoading: true,
      error: null,
      result: null
    }))

    const amount = web3.utils.toWei(inputRef.current!.value, "ether");
    try {
      const accounts = await web3.eth.getAccounts();

      const tx = await lottery.methods.register().send({
        from: accounts[0],
        value: amount
      })
      setService((service) => ({
        ...service,
        isError: false,
        isLoading: false,
        result: tx
      }))
    } catch (e) {
      setService((service) => ({
        ...service,
        isError: true,
        isLoading: false,
        error: e as ErrorCustom
      }))
    }
  }

  return (
    <section>
      <form className={classses.Form} onSubmit={registerHandler}>
        <input ref={inputRef} className={classses.Input} type="text" name="value" />
        {service.isLoading ? <Loader /> : <button type="submit">Register</button>}
      </form>
      <p className={service.isError ? classses.Error : ""}>Minimun amount for registration is: .0001 Ether</p>
      {service.error &&
        <p className={classses.Error}>{service.error.message}</p>}
      {(service.result) &&
        <p>You are successfully registerd, your transection Hash is: {service.result.transactionHash}</p>}
    </section>
  )
}
