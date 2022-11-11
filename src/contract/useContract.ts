declare let window: any;

export default async function callContract() {
    const contract = { contract: null, signerAddress: null };
    try {
        if (window?.tronWeb?.defaultAddress?.base58 != false && window?.tronWeb?.defaultAddress?.base58 != undefined && window?.tronLink?.tronWeb !== false){
            contract.contract =  await window?.tronWeb.contract().at('TP5egwjizMi9DdGEkpYR8CfBaHv3mxenPn');
            contract.signerAddress =  window?.tronWeb.defaultAddress.base58;
        }


    } catch (error) {
        console.error(error);
    }
    return contract;
} 

