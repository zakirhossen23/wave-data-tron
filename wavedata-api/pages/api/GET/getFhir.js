

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
  let fhir_element = await contract._fhirMap(Number(req.query.userid)).call();
  
  var newFhir = {
    id: Number(fhir_element.user_id),
    given_name: fhir_element.given_name,
    identifier: fhir_element.identifier,
    patient_id: fhir_element.patient_id
  };
  if (newFhir.patient_id === ""){
    newFhir = null;
  }

  res.status(200).json({ value: newFhir })
}
