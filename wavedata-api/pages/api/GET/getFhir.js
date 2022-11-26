

export default async function handler(req, res) {

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
