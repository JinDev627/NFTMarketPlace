//Check approval
const ApprovalState = await mintingEvent.methods.isApprovedForAll(accounts[0], contractAddress).call();
if (ApprovalState) {
	$("#btn_setApprovalForAll").text("Status : Available");
} else {
	$("#btn_setApprovalForAll").text("Status : Not available");
}

const tempnftListArray = await mintingEvent.methods.getNftTokens(accounts[0]).call();

//console.log(tempnftListArray);


for (i = 0; i < tempnftListArray.length; i++) {

_nftTokenId = tempnftListArray[i].nftTokenId;
_nftTokenURI = tempnftListArray[i].nftTokenURI;
_price = tempnftListArray[i].price;
_ipfsinfo = ipfsInfo(_nftTokenURI);
name = _ipfsinfo.name;
image = _ipfsinfo.image;




var html = '';

html += '<tr id="tr_' + _nftTokenId + '">';
html += '<td>' + (i + 1) + '</td>';
html += '<td>' + _nftTokenId + '</td>';

html += '<td>' + name + '</td>';
html += '<td><img src=' + image + ' width=100px/></td>';

html += '<td>' + _price + '</td>';
html += '<td>';
html += '<a href="./mynft_detail.html?tokenId=' + _nftTokenId + '" class="btn btn-secondary btn-flat">Details</a> ';

if (_price == 0) {
	html += '<button type="button" class="btn btn-primary btn_onSale" data-bs-toggle="modal" data-bs-target="#saleModal" data-val="' + _nftTokenId + '">Sell</button> ';
}


html += '<button type="button" class="btn btn-danger btn_burn"" data-val="' + _nftTokenId + '">Remove</button> ';

html += '</td> ';
html += '</tr>';

$("#dynamicTbody").append(html);



}



if (i == 0) {

	var html = '';

	html += '<tr>';
	html += '<td colspan="6" style="text-align:center;">No Data</td> ';
	html += '</tr>';

	$("#dynamicTbody").append(html);

}



function ipfsInfo(_nftTokenURI) {
	$.ajax({
		url: _nftTokenURI,
		type: 'get',
		data: '',
		async: false,
		success: function (data) {
			//console.log(data);
			//console.log(data.name);
			//console.log(data.image);

			name = data.name;
			image = data.image;


		},
		error: function (e) {
			console.log("Can't get Value.");
		}
	});

	return {
		name: name,
		image: image
	};

}




$('.btn_onSale').click(function () {
	var tokenId = $(this).attr("data-val");
	$('.modal-title').html("Register Sale");
	$('#saleModal').modal('show');

	//Sell
	$('.btn_onSaleSubmit').click(async function () {
		var price = $("#price").val();
		//console.log(tokenId, price, ApprovalState);


		var ownerAddress = await mintingEvent.methods.ownerOf(tokenId).call();
		console.log(ownerAddress.toLowerCase(), accounts[0]);

		if (ownerAddress.toLowerCase() != accounts[0]) {
			alert("only owner can register.");
			return false;
		}


		if (!ApprovalState) {
			alert("Change the approval status of sale");
			return false;
		}




		var receiptObj = await mintingEvent.methods.setSaleNftToken(tokenId, price).send({ from: accounts[0], gas: 3000000 });
		console.log(receiptObj);

		location.reload();
	});



});




$('.btn_burn').click(async function () {
	if (confirm('Are you sure?')) {
		var tokenId = $(this).attr("data-val");
		var receiptObj = await mintingEvent.methods.burn(tokenId).send({ from: accounts[0] });
		console.log(receiptObj);

		$('#tr_' + tokenId + '').remove();

		return false;
	}
});




//Change approval
$('#btn_setApprovalForAll').click(async function () {
	var receiptObj = await mintingEvent.methods.setApprovalForAll(contractAddress, true).send({ from: accounts[0] });
	console.log(receiptObj);
	location.reload();
});

