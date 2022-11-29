

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
  let details_element = await contract.getUserDetails(Number(req.query.userid)).call();
  
  var newUser = {
    id: Number(req.query.userid),
    image: details_element[0],
    credits: Number(details_element[1]),
  };

  res.status(200).json({ value: newUser })
}
