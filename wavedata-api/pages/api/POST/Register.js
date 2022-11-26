
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  


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
