import { useState, useEffect } from 'react';
import TronWeb from 'tronweb';

export default async function useContract() {
	
	let contractInstance = {
		contract: null,
		signerAddress: null
	}

	const fullNode = 'https://api.nileex.io';
	const solidityNode = 'https://api.nileex.io';
	const eventServer = 'https://event.nileex.io';
	const privateKey = '1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03';
	const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
	contractInstance.signerAddress =  tronWeb.address.fromPrivateKey("1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03");
	contractInstance.contract = await tronWeb.contract().at('THYfBNgMyWhX2b7RmRfDKf3SPZgAwvFf5X');

	return contractInstance;
}