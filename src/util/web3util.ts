import web3 from "../lib/web3";

export const getContractByteCode = async () => {
  const contract_address = "0xbe8E309944Ace607AC9D44a7F0584c1206DF8Cf3";
  const contract_bytecode = await web3.eth.getCode(contract_address);
  console.log("contract_bytecode", contract_bytecode);
};
