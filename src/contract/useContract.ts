import { useState, useEffect } from 'react';

declare let window;
export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
	});
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	 }
	useEffect(() => {
		const fetchData = async () => {
			await(200);
			try {
				const contract = { contract: null, signerAddress: null };

				contract.contract =  await window?.tronWeb?.contract().at('TRNwfptvAN4WR34msRGiGFHpkceX85BuDR');

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