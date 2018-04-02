jQuery(document).ready(function($) {
	purchase_func();


});


// 左上  搜索框
var $purchase_price_buy = null;
var $purchase_price_sell = null;
var $purchase_code = null;
var $availableflag = 0;
var $quotation = '';
var $investorsCode = [];
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
				// console.log(data)
				$.each($.parseJSON(data).LIST, function(index, el) {
					availableTags.push(el.investorsName + '  ' + el.investorsCode);

					$investorsCode.push(el.investorsCode);

				});

				get_purchase_modal_event($investorsCode);

			}
		});



		$availableflag = 1;
	}

	$('#nope').autocomplete({
		source: availableTags,
		focus: function(event, ui) {
			$purchase_price_buy = ui.item.label.split(' ')[0];

			$purchase_code = ui.item.value;

		},
		select: function(event) {
			console.log($purchase_price_buy);
			$.ajax({
				url: allurl1 + 'uusjs/autoComplete.do',
				type: "POST",
				data: {
					investorsCode: $purchase_price_buy
				},
				success: function(data) {
					alert(2)
					window.location = 'sjs_index_load.html?code=' + $purchase_code;
				}
			});
		}
	})

	$('#code_ipt').autocomplete({
		source: availableTags,
		focus: function(event, ui) {
			$purchase_price_buy = ui.item.value.split(' ')[0];
		}
	})

	$('#sell_out_ipt').autocomplete({
		source: availableTags,
		focus: function(event, ui) {
			$purchase_price_sell = ui.item.value.split(' ')[0];
		}
	})



});


// 点击事件
function purchase_func() {
	$('.sjs_purchase .btn-group button').each(function() {
		var index = $(this).index();
		$('.sjs_purchase .btn-group button').eq(index).on('click', function() {
			$(this).addClass('active').siblings().removeClass('active');
			$('.purchase_tab').eq(index).show().siblings('').hide();

		})
		$('#purchase_nav_modal .btn-group button').eq(index).on('click', function() {
			$(this).addClass('active').siblings().removeClass('active');
			$('.purchase_nav_tab').eq(index).show().siblings('').hide();

		})

	});



	$('.sjs_header_right li').eq(0).on('click', function() {
		$('#purchase_nav_modal .btn-group button').eq(0).addClass('active').siblings().removeClass('active');
		$('#purchase_nav_modal .purchase_nav_tab').eq(0).show().siblings('').hide();

	})

	$('.sjs_header_right li').eq(1).on('click', function() {
			$('#purchase_nav_modal .btn-group button').eq(1).addClass('active').siblings().removeClass('active');
			$('#purchase_nav_modal .purchase_nav_tab').eq(1).show().siblings('').hide();

		})
		// 导航tab
	get_nav_func();

}


// 买入 卖出接口
function get_purchase_modal_event(el) {
	// 导航买入

	$('#purchase_button').on('click', function() {
		$('#code_ipt_hide').val($purchase_price_buy);
		var Total = $('#price_nav_number').val() * $('#time_nav_number').val();
		var str = $('#price_nav_number').val();

		console.log($('#code_ipt').val())

		if ($('#code_ipt').val() == '') {
			layer.alert('发行人不能为空！');
		} else {
			layer.open({
				title: false,
				shadeClose: true,
				skin: 'buy_button',
				area: '260px',
				content: '<h1>订单确认</h1><p>状态：<b style="color:#FF2D41;">' + $('#purchase_button').html() + '</b></p><p>用户：<b>' + $('#code_ipt').val() + '</b></p><p>价格：<b>' + $('#price_nav_number').val() + '</b></p><p>时间：<b>' + $('#time_nav_number').val() + '秒</b></p><p>总价：<b>' + Total + '</b></p><p><button type="button" class="active">确定</button><button type="button">取消</button></p>',
				btn: []
			});

			$('.buy_button button').each(function(index, el) {
				// console.log(el)
				$('.buy_button button').eq(index).on('click', function() {
					console.log(index)
					$(this).addClass('active').siblings().removeClass('active');
					if (index == 0) {
						setTimeout(function() {
							layer.closeAll();
						}, 1);
						$.post(allurl1 + 'uusjs/orderReservations.do',
							$('#priceForm').serialize(),
							function(data) {
								console.log(data);
								if (data.STATUS == 3) {
									window.location = 'sjs_load.html';
								} else if (data.MSG == "股票代码为空！") {
									layer.alert("发行人代码为空！");
								} else {
									window.location = 'sjs_entrust.html';

								}
							}, 'json');
						$('.glyphicon.glyphicon-remove').click();
					} else if (index == 1) {
						setTimeout(function() {
							layer.closeAll();
						}, 1);
					}
				})
			});
		}


	});


	// 导航卖出
	$('#sell_out').on('click', function() {
		$('#sell_out_ipt_hide').val($purchase_price_sell);
		var Total_sell = ($('#purchase_sell_number').val() * $('#time_sell_number').val()).toFixed(2);

		// console.log(Total_sell)

		if ($('#sell_out_ipt').val() != '') {
			layer.open({
				type: 1,
				title: false,
				shadeClose: true,
				skin: 'sell_button',
				area: '260px',
				content: '<h1>订单确认</h1><p>状态：<b style="color:#FF2D41;">' + $('#sell_out').html() + '</b></p><p>用户：<b>' + $('#sell_out_ipt').val() + '</b></p><p>价格：<b>' + $('#purchase_sell_number').val() + '</b></p><p>时间：<b>' + $('#time_sell_number').val() + '秒</b></p><p>总价：<b>' + Total_sell + '</b></p><p><button type="button" class="active">确定</button><button type="button">取消</button></p>'
			});

			$('.sell_button button').each(function(index, el) {

				$('.sell_button button').eq(index).on('click', function() {
					console.log(index)
					$(this).addClass('active').siblings().removeClass('active');

					if (index == 0) {
						setTimeout(function() {
							layer.closeAll();
						}, 1);
						$.post(allurl1 + 'uusjs/sellOrder.do',
							$('#purchase_sell_Form').serialize(),
							function(data) {
								console.log(data);
								if (data.STATUS == 3) {
									window.location = 'sjs_load.html';
								} else {
									window.location = 'sjs_entrust.html';
								}
							}, 'json');
						$('.glyphicon.glyphicon-remove').click();
					} else if (index == 1) {
						setTimeout(function() {
							layer.closeAll();
						}, 1);

					}
				})
			});
		} else {
			layer.alert('发行人不能为空！');
		}


	});
}


// 导航
function get_nav_func() {
	// 导航买入价格
	$('#price_nav_remove').on('click', function() {
		var price_nav_num = Number($('#price_nav_number').val());
		get_price_func(1, price_nav_num, $('#price_nav_number'));
	})

	$('#price_nav_add').on('click', function() {
		var price_add_num = Number($('#price_nav_number').val());
		get_price_func(2, price_add_num, $('#price_nav_number'));
	})

	// 导航买入时间
	$('#time_nav_remove').on('click', function() {
		var nav_time_num = Number($('#time_nav_number').val());
		purchase_time_func(1, nav_time_num, $('#time_nav_number'));
	})

	$('#time_nav_add').on('click', function() {
		var nav_time_add = Number($('#time_nav_number').val());
		purchase_time_func(2, nav_time_add, $('#time_nav_number'));
	})

	// 导航卖出价格
	$('#purchase_sell_remove').on('click', function() {
		var price_nav_remove = Number($('#purchase_sell_number').val());
		get_price_func(1, price_nav_remove, $('#purchase_sell_number'));
	})

	$('#purchase_sell_add').on('click', function() {
		var price_nav_add = Number($('#purchase_sell_number').val());
		get_price_func(2, price_nav_add, $('#purchase_sell_number'));
	})

	// 导航卖出时间
	$('#time_sell_remove').on('click', function() {
		var purchase_sell_remove = Number($('#time_sell_number').val());
		purchase_time_func(1, purchase_sell_remove, $('#time_sell_number'));
	})
	$('#time_sell_add').on('click', function() {
		var purchase_sell_add = Number($('#time_sell_number').val());
		purchase_time_func(2, purchase_sell_add, $('#time_sell_number'));
	})


	// // 导航买入按钮
	// $('#purchase_button').on('click', function() {
	// 	if ($('#code_ipt').val() != '' && $('#code_ipt').val() != null) {
	// 		get_purchase($purchase_price_buy, $('#price_nav_number').val(), $('#time_nav_number').val());
	// 	} else {
	// 		alert('发行人不能为空！')
	// 	}
	// })

	// // 导航卖出按钮
	// $('#sell_out').on('click', function() {
	// 	if ($('#sell_out_ipt').val() != '' && $('#sell_out_ipt').val() != null) {
	// 		get_sell_out($purchase_price_sell, $('#purchase_sell_number').val(), $('#time_sell_number').val());
	// 	} else {
	// 		alert('发行人不能为空！')
	// 	}
	// })



}



//买入卖出时间
function purchase_time_func(page, num, obj) {
	console.log(num);
	var a = num;
	if (page == 1) {
		if (num > 1) {
			num--;
			obj.val(num);
		} else {}
	} else if (page == 2) {
		if (num >= 1) {
			num++;
			obj.val(num);
			console.log(num);
		} else {}
	}
}

//买入卖出价格
function get_price_func(page, num, obj) {
	if (page == 1) {
		if (num > 0) {
			num -= 0.1;
			obj.val(num.toFixed(2));
		} else {}
	} else if (page == 2) {
		if (num >= 0) {
			num += 0.1;
			obj.val(num.toFixed(2));
		} else {}
	}
}



// 买入接口
function get_purchase(investorsCode, buyerOrderPrice, buyerOrderNum) {
	var tags_url = allurl1 + 'uusjs/orderReservations.do';
	ajax(get_purchase_url(tags_url, investorsCode, buyerOrderPrice, buyerOrderNum), function(data) {
		console.log(data)
		if (data.MSG == 'SUCCESS') {
			if (data.MSG != 'SUCCESS') {
				layer.alert(data.MSG);
			} else {
				layer.alert('买入成功');
				window.location = location;
			}
		} else {
			layer.alert(data.MSG);
		}
	});
}


//get url
function get_purchase_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'orderReservations', n1, n2, n3, '', '', 'investorsCode', 'buyerOrderPrice', 'buyerOrderNum', '', '');
	console.log(index_string);
	return index_string;
}



// 卖出接口
function get_sell_out(investorsCode, sellOrderPrice, sellOrderNum) {
	var tags_url = allurl1 + 'uusjs/sellOrder.do';
	ajax(get_sell_out_url(tags_url, investorsCode, sellOrderPrice, sellOrderNum), function(data) {
		console.log(data)
		if (data.MSG == 'SUCCESS') {
			if (data.MSG != 'SUCCESS') {
				layer.alert(data.MSG);
			} else {
				layer.alert('卖出成功！')
				window.location = location;
			}
		} else {
			layer.alert(data.MSG);
		}
	});
}


//get url
function get_sell_out_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'sellOrder', n1, n2, n3, '', '', 'investorsCode', 'sellOrderPrice', 'sellOrderNum', '', '');
	console.log(index_string);
	return index_string;
}



function the_Name(map, parent) {
	console.log(map);

	this.span = document.createElement('span');
	this.span.innerHTML = map.investorsName;

	this.b = document.createElement('b');
	this.b.innerHTML = map.investorsCode;

	this.p = document.createElement('p');
	this.p.appendChild(this.span);
	this.p.appendChild(this.b);

	parent.append(this.p);
}



function getresult(url, api, f1, f2, f3, f4, f5, v1, v2, v3, v4, v5) {
	var last = 'uuk';
	f1 = '' + f1;
	f2 = '' + f2;
	f3 = '' + f3;
	f4 = '' + f4;
	f5 = '' + f5;
	//console.log(f1.length);
	var url_api = api.substring(api.length - 3);
	if (f1.length > 3) {
		f11 = f1.substring(f1.length - 3);
	} else {
		f11 = f1;
	}
	if (f2.length > 3) {
		f12 = f2.substring(f2.length - 3);
	} else {
		f12 = f2;
	}
	if (f3.length > 3) {
		f13 = f3.substring(f3.length - 3);
	} else {
		f13 = f3;
	}
	if (f4.length > 3) {
		f14 = f4.substring(f4.length - 3);
	} else {
		f14 = f4;
	}
	if (f5.length > 3) {
		f15 = f5.substring(f5.length - 3);
	} else {
		f15 = f5;
	}
	var md5_string = url_api + f11 + f12 + f13 + f14 + f15 + last;
	// console.log(md5_string);
	// var hash = hex_md5(md5_string);
	var lasturl = url + '?' + v1 + '=' + f1 + '&' + v2 + '=' + f2 + '&' + v3 + '=' + f3 + '&' + v4 + '=' + f4 + '&' + v5 + '=' + f5 + '&';
	//console.log(lasturl);
	lasturl = encodeURI(lasturl);
	return lasturl;
}