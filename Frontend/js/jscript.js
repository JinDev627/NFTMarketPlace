$(document).ready(function () {
    $("#page_mynft_detail").on("click", function () {
    window.location.href = "./mynft_detail.html";
  });

  $("#page_mynft").on("click", function () {
    window.location.href = "./mynft.html";
  });

  $("#btn_mynft_delete").on("click", function () {
    alert("delete");
  });

  $("#selectNetwork").change(function () {
    var blockChainNetwork = $("#selectNetwork option:selected").val();
    if (!blockChainNetwork) {
      alert("Please select network!");
    } else {
      localStorage["blockChainNetwork"] = blockChainNetwork;
    }
  });
});

function onlyNumber(){
   if((event.keyCode > 48 && event.keyCode < 57 ) 
      || event.keyCode == 8 
      || event.keyCode == 37 || event.keyCode == 39 
      || event.keyCode == 46 
      || event.keyCode == 39){
   }else{
		event.returnValue=false;
   }
}
