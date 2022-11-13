import { useState, useEffect } from 'react';

declare let window;
export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const contract = { contract: null, signerAddress: null };

				contract.contract =  await window?.tronWeb?.contract().at('TNAfabSEzagKrhsydKtNXEPSAqq5ZCYV5g');

				contract.signerAddress =  window?.tronWeb?.defaultAddress?.base58;
                window.contract = contract.contract;
				setContractInstance(contract);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return contractInstance;
}