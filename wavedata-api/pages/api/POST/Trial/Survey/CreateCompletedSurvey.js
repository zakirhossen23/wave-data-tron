
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

  const { surveyid, userid, date, trialid } = req.body;

  let survey_element = await contract._surveyMap(surveyid).call();

  let details_element = await contract.getUserDetails(Number(userid)).call();


  await contract.CreateCompletedSurveys(Number(surveyid), Number(userid), date, Number(trialid)).send({
    feeLimit: 1_000_000_000,
    shouldPollResponse: false
  });

  let credits = Number(details_element[1]) + Number(survey_element.reward)

  await contract.UpdateUser(Number(userid), details_element[0], Number(credits)) .send({
    feeLimit: 1_000_000_000,
    shouldPollResponse: false
  });

  res.status(200).json({ status: 200, value: "Created" })

}
