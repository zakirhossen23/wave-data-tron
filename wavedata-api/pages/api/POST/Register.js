
export default async function handler(req, res) {

  let useContract = await import("../../../contract/useContract.ts");
  let { contract, signerAddress } = await useContract.default();

  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Register must have POST request" })
    return;
  }

  const { fullname, email, password } = req.body;
  if (await contract.CheckEmail(email).call() !== "False"){
    res.status(403).json({ status: 403, error: "Account already exists!" })
    return;
  }
  await contract.CreateAccount(fullname, email, password).send({
    feeLimit: 1_000_000_000,
    shouldPollResponse: false
  });
  res.status(200).json({ status: 200, value: "Registered!" })

}
