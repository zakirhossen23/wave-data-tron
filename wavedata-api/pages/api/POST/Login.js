
export default async function handler(req, res) {

  let useContract = await import("../../../contract/useContract.ts");
  let { contract, signerAddress } = await useContract.default();


  const { email, password } = req.body;
  res.status(200).json({ status: 200, value: await contract.Login(email, password).call() })

}
