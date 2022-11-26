
export default async function handler(req, res) {

    let useContract = await import("../../../contract/useContract.ts");
    let { contract, signerAddress } = await useContract.default();
  
    if (req.method !== 'POST') {
      res.status(405).json({ status: 405, error: "Method must have POST request" })
      return;
    }
  
    const { userid, givenname,identifier, patientid } = req.body;
 
    await contract.UpdateFhir(Number(userid), givenname,identifier, patientid ).send({
      feeLimit: 1_000_000_000,
      shouldPollResponse: false
    });
    res.status(200).json({ status: 200, value: "Updated!" })
  
  }
  