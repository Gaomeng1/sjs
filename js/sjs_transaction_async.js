var $purchase_price_buy = null;
var $purchase_price_sell = null;
var $purchase_ipt = null;
var $purchase_sell = null;
var $availableflag = 0;
var $quotation = '';
var aa = null;
var bb = null;
var availableTags = [];
if ($availableflag == 0) {
	$.ajax({
		url: allurl1 + 'uusjs/autoComplete.do',
		dataType: 'json',
		type: "POST",
		data: {
			investorsCode: $quotation
		},
		success: function(data) {
			console.log(data)
			$.each(data.LIST, function(index, el) {
				availableTags.push(el.investorsName + ' ' + el.investorsCode);
			});

		}
	});


	$availableflag = 1;
}

// 判断买入和搜索发行人
$('#code_ipt').autocomplete({
	source: availableTags,
	focus: function(event, ui) {
		$purchase_price_buy = ui.item.label.split(' ')[1];
		$purchase_ipt = ui.item.label;
	},
	select: function(event) {
		get_buy_disc_sell($purchase_price_buy);

		$('.transaction_content_center span').html($purchase_ipt);

		$('#price_number').focus();


	}
}).focus(function(event) {
	$(this).val('');

	$purchase_ipt = null;

	$('.reset').click();

}).focusout(function(event) {
	if ($purchase_ipt != '' && $purchase_ipt != null) {
		if ($purchase_ipt.indexOf(' ') > 0) {
			$(this).val($purchase_ipt);

			aa = $purchase_ipt.split(' ')[1];
		}

		ajax_func(aa, '1', $('#buy_rise'));


	} else {
		var ipt = $('#code_ipt').val();
		// console.log(ipt);
		if (ipt == '') {

		} else {
			if (!(/[^\d.\u4e00-\u9fa5]/g.test(ipt))) {
				aa = ipt;

				for (var i = 0; i < availableTags.length; i++) {
					if (availableTags[i].indexOf(aa) >= 0) {
						$('#code_ipt').val(availableTags[i]);

						aa = availableTags[i].split(' ')[1];

						$purchase_price_buy = aa;

						ajax_func(aa, '1', $('#buy_rise'));

						break;

					} else {
						$('#code_ipt').val('');
					}
				}
			} else {
				$('#code_ipt').val('');
			}
		}
	}
});


//卖出
$('#sell_out_ipt').autocomplete({
	source: availableTags,
	focus: function(event, ui) {
		$purchase_price_sell = ui.item.label.split(' ')[1];
		$purchase_sell = ui.item.label;
	},
	select: function(event) {
		// console.log($purchase_price_sell);
		get_buy_disc_sell($purchase_price_sell);

		$('.transaction_content_center span').html($purchase_sell);

		$('#purchase_sell_number').focus();
	}
}).focus(function(event) {
	$(this).val('');

	$purchase_sell = null;

	$('.reset').click();

}).focusout(function(event) {
	if ($purchase_sell != '' && $purchase_sell != null) {
		if ($purchase_sell.indexOf(' ') > 0) {
			$(this).val($purchase_sell);

			bb = $purchase_sell.split(' ')[1];
		}

		ajax_func(bb, '2', $('#sell_rise'));

	} else {
		var code_ipt = $('#sell_out_ipt').val();
		if (code_ipt == '') {

		} else {
			if (!(/[^\d.\u4e00-\u9fa5]/g.test(code_ipt))) {
				bb = code_ipt;

				for (var i = 0; i < availableTags.length; i++) {
					if (availableTags[i].indexOf(bb) >= 0) {
						$('#sell_out_ipt').val(availableTags[i]);

						bb = availableTags[i].split(' ')[1];

						$purchase_price_sell = bb;

						ajax_func(bb, '2', $('#sell_rise'));

						break;

					} else {
						$('#sell_out_ipt').val('');
					}
				}
			} else {
				$('#sell_out_ipt').val('');
			}
		}
	}
});