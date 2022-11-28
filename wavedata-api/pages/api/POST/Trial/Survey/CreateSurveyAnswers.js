
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )



  let useContract = await import("../../../../../contract/useContract.ts");
  let { contract, signerAddress } = await useContract.default();

  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Method must have POST request" })
    return;
  }

  const { trialid,userid,surveyid, sectionid,questionid ,answer  } = req.body;

  await contract.CreateQuestionAnswer(Number(trialid),Number(userid),Number(surveyid),Number(sectionid),Number(questionid) ,answer).send({
    feeLimit: 1_000_000_000,
    shouldPollResponse: false
  });
  res.status(200).json({ status: 200, value: "Created" })

}
