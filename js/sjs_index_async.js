function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var Request = new Object();
Request = GetRequest();


// 左上  搜索框
var $purchase_price_buy = null;
var $purchase_price_sell = null;
var $availableTags = null;
var $availableflag = 0;
var $quotation = '';
$(function() {
	var availableTags = [];
	if ($availableflag == 0) {
		$.ajax({
			url: allurl1 + 'uusjs/autoComplete.do',
			type: "POST",
			data: {
				investorsCode: $quotation
			},
			success: function(data) {
				$.each($.parseJSON(data).LIST, function(index, el) {
					availableTags.push(el.investorsCode + '  ' + el.investorsName);
				});
			}
		});



		$availableflag = 1;
	}

	$('#nope').autocomplete({
		source: availableTags,
		focus: function(event, ui) {
			$purchase_price_buy = ui.item.label.split(' ')[0];
		},
		select: function(event) {
			$.ajax({
				url: allurl1 + 'uusjs/autoComplete.do',
				type: "POST",
				dataType: 'json',
				data: {
					investorsCode: $purchase_price_buy
				},
				success: function(data) {
					console.log(data);
					var get_routes_container = document.getElementById('content_whole_inner');

					$('#content_whole_inner').empty();
					var create_one_route = new query_product(data.OBJECT, get_routes_container);
					create_one_route.getclick();


					get_buy_disc_sell($purchase_price_buy);


					$('.main_data').first().addClass('active');

				}
			});
		}
	})
})