
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
  if (trial_id !== "False") {
    let trial_element = await contract._trialMap(Number(trial_id)).call();
    var newTrial = {
      id: Number(trial_element.trial_id),
      title: trial_element.title,
      image: trial_element.image,
      description: trial_element.description,
      contributors: Number(trial_element.contributors),
      audience: Number(trial_element.audience),
      budget: Number(trial_element.budget)
    };
    let all_surveys = await contract.getAllSurveysIDByTrial(Number(trial_id)).call();
    let all_trail_surveys = [];
    for (let i = 0; i < all_surveys.length; i++) {
      let survey_element = await contract._surveyMap(all_surveys[i]).call();

      var new_survey = {
        id: Number(survey_element.survey_id),
        trial_id: Number(survey_element.trial_id),
        user_id: Number(survey_element.user_id),
        name: survey_element.name,
        description: survey_element.description,
        date: survey_element.date,
        image: survey_element.image,
        reward: Number(survey_element.reward),
        submission: Number(survey_element?.submission)
      };
      all_trail_surveys.push(new_survey);
    }

    let all_completed_surveys = await contract.getAllCompletedSurveysIDByUser(Number(req.query.userid)).call();
    let all_trail_completed_surveys = [];

    for (let i = 0; i < all_completed_surveys.length; i++) {
      let completed_survey_element = await contract._completedsurveyMap(all_completed_surveys[i]).call();

      var new_completed_survey = {
        id: Number(completed_survey_element.completed_survey_id),
        trial_id: Number(completed_survey_element.trial_id),
        user_id: Number(completed_survey_element.user_id),
        survey_id: Number(completed_survey_element.survey_id),
        date: completed_survey_element.date,
      };
      if (new_completed_survey.trial_id === Number(trial_id)){
        all_trail_completed_surveys.push(new_completed_survey);
      }
    } 

    let finalObject={
      Trial:newTrial,
      Survey: all_trail_surveys,
      Completed: all_trail_completed_surveys
    }

    res.status(200).json({ status:200,value: JSON.stringify(finalObject) })
    return;
  }
  
  res.status(400).json({ status:400, value: "None" })

}
