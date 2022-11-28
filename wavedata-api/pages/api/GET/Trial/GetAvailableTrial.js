
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



  let useContract = await import("../../../../contract/useContract.ts");
  let { contract, signerAddress } = await useContract.default();

  let trial_id = await contract.GetOngoingTrial(req.query.userid).call();
  let all_available_trials = [];
  for (let i = 0; i < Number(await contract._TrialIds().call()); i++) {
    let trial_element = await contract._trialMap(i).call();
    var newTrial = {
      id: Number(trial_element.trial_id),
      title: trial_element.title,
      image: trial_element.image,
      description: trial_element.description,
      contributors: Number(trial_element.contributors),
      audience: Number(trial_element.audience),
      budget: Number(trial_element.budget)
    };
    if (trial_id !== "False") {
      if (Number(trial_id) !== newTrial.id)
        all_available_trials.push(newTrial);
    }else{
      all_available_trials.push(newTrial);
    }
  }
    res.status(200).json({ status: 200, value: JSON.stringify(all_available_trials) })
    return;
  
}
