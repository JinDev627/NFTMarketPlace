
$(window).load(async function () {

	var contractAddress;
	//Select Network
	var blockChainNetwork = localStorage.getItem("blockChainNetwork")
	$("#selectNetwork").val(blockChainNetwork).prop("selected", true);


	if (blockChainNetwork == "MATIC_MUMBAI") {
		contractAddress = contractAddress_MATIC_MUMBAI;
	}

	else if (blockChainNetwork == "KLAY_BAOBAB") {
		contractAddress = contractAddress_KLAY_BAOBAB;
	}

	else if (blockChainNetwork == "ETH_RINKEBY") {
		contractAddress = contractAddress_ETH_RINKEBY;
	}




	if (typeof web3 !== "undefined") {
		console.log("Web3 is activated");

		$("#resultbrowsers").text("Login to Metamask!");

		if (web3.currentProvider.isMetaMask == true) {
			$("#resultbrowsers").text("Metamask is activated");
			try {

				accounts = await ethereum.request({
					method: "eth_requestAccounts"
				});

				$("#showAccount").text(accounts);
				//web3
				window.web3 = new Web3(window.ethereum);

				var mintingEvent = await new window.web3.eth.Contract(
					abiobj,
					contractAddress
				);


			} catch (error) {
				console.log(`error msg: ${error}`);
				$("#resultbrowsers").text("Login to Metamask!");
				return false;
			}
		} else {
			$("#resultbrowsers").text("Metamask Error");
		}
	} else {
		$("#resultbrowsers").text("Web3 is not activated");
	}



	//Check approval status
	const ApprovalState = await mintingEvent.methods.isApprovedForAll(accounts[0], contractAddress).call();
	if (ApprovalState) {
		$("#btn_setApprovalForAll").text("Status: Available");
	} else {
		$("#btn_setApprovalForAll").text("Status: Not Available");
	}
	//console.log(ApprovalState);		

	//ipfs
	const IPFS_URL = "https://ipfs.io/ipfs/";
	const IPFS_API_URL = "ipfs.infura.io";
	const ipfs = window.IpfsApi(IPFS_API_URL, "5001", { protocol: "https" }); // Connect to IPFS

	$("#btn_uploadfile").on("click", function () {
		if ($("#uploadfile").val() == "") {
			alert("Please select sample image");
			$("#uploadfile").focus();
			return;
		}

		var reader = new FileReader();
		reader.onloadend = function () {
			//console.log("reader.result" + reader.result);
			var buf = buffer.Buffer(reader.result); // Convert data into buffer
			ipfs.files.add(buf, (err, result) => {
				// Upload buffer to IPFS
				if (err) {
					console.error(err);
					return;
				}

				var hash_img_url = IPFS_URL + result[0].hash;

				//console.log(`Url --> ${hash_img_url}`);
				$("#ipfs_file_url").text(hash_img_url);
				$("#ipfs_file_url").attr("href", hash_img_url);
				$("#hash_img_url").val(hash_img_url);
			});
		};

		//console.log($('input#uploadfile')[0].files[0]);
		reader.readAsArrayBuffer($("input#uploadfile")[0].files[0]); // Read Provided File
	});

	$("#bnt_mint").on("click", function () {
		//https://docs.opensea.io/docs/metadata-standards
		/*
			  {
			  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
			  "external_url": "https://openseacreatures.io/3", 
			  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
			  "name": "Dave Starbelly",
			  "attributes": [ ... ], 
			  }                
		  */

		if (!localStorage.getItem("blockChainNetwork")) {
			alert("Please select network!");
			return false;
		}

		var name = $("#name").val();
		var hash_img_url = $("#hash_img_url").val();
		var description = $("#description").val();
		var category_val = $("select[name=category] option:selected").text();
		var metaData = {};
		var attributes = [];

		if (name == "") {
			alert("Please input minter");
			$("#name").focus();
			return false;
		}

		if (hash_img_url == "") {
			alert("Please upload sample image");
			$("#uploadfile").focus();
			return false;
		}

		if (category == "Select") {
			alert("Please select category!");
			$("#category").focus();
			return false;
		}

		if (description == "") {
			alert("Please input description");
			$("#description").focus();
			return false;
		}

		attributes.push({ trait_type: "category", value: category_val });

		metaData["name"] = name;
		metaData["attributes"] = attributes;
		metaData["description"] = description;
		metaData["image"] = hash_img_url;

		console.log(JSON.stringify(metaData));

		var buf = buffer.Buffer.from(JSON.stringify(metaData));
		ipfs.files.add(buf, (err, result) => {
			// Upload buffer to IPFS
			if (err) {
				console.error(err);
				return;
			}
			var hash_meta_url = IPFS_URL + result[0].hash;
			console.log(`hash_meta_url --> ${hash_meta_url}`);

			// mint function 
			setMint(hash_meta_url);
		});
	});



	async function setMint(hash_meta_url) {
		if (mintingEvent != null) {
			try {
				var accounts = await web3.eth.getAccounts();
				var receiptObj = await mintingEvent.methods.mintNFT(hash_meta_url).send({ from: accounts[0] });

				console.log(receiptObj);
				$("#resultbox").text("Processing Result \n" + JSON.stringify(receiptObj));

			} catch (error) {
				console.log(error);
				$("#resultbox").text("Processing Result \n" + error);
			}

		}
	}



	//Change the approval status
	$('#btn_setApprovalForAll').click(async function () {
		var receiptObj = await mintingEvent.methods.setApprovalForAll(contractAddress, true).send({ from: accounts[0] });
		console.log(receiptObj);
		location.reload();
	});
});