var LocString = String(window.document.location.href);

function GetQueryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) return tmp[2];
	return "";
}
var _name = decodeURI(GetQueryString('name'));
var _code = decodeURI(GetQueryString('code'));
var _price = decodeURI(GetQueryString('price'));
var _num = decodeURI(GetQueryString('num'));

jQuery(document).ready(function($) {

	// 获取持仓
	get_positions_func('1', '30');

	// 在首页点击交易时  买入添加数据
	if (_name != '' && _price != '' && _code != '') {
		$('#code_ipt').val(_name + '  ' + _code);

		$purchase_price_buy = _code;

		$('#price_number').val(_price);

		if (_num == '0') {
			$('#time_number').val('1000');
		} else {

		}

		ajax_func(_code);


		get_buy_disc_sell(_code);


	} else {

	}

	tab_click();


	// 买入
	get_purchase_modal_event();

});


function f_rand() {
	rand = Math.random();
	$('a').each(function() {
		href = $(this).attr('href');
		if (href.length == 0 || href.indexOf('javascript') > -1) return;
		else if (href.indexOf('?') > -1) {
			$(this).attr('href', href + '&' + rand);
		} else {
			$(this).attr('href', href + '?' + rand);
		}
	});
};



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
	$('#buy_rise').css('width', '58px').siblings('b').show();

	$purchase_ipt = null;

	$('.reset').click();

}).focusout(function(event) {
	if ($purchase_ipt != '' && $purchase_ipt != null) {
		if ($purchase_ipt.indexOf(' ') > 0) {
			$(this).val($purchase_ipt);

			aa = $purchase_ipt.split(' ')[1];
		}

		ajax_func(aa);


	} else {
		var ipt = $('#code_ipt').val();
		if (ipt == '') {

		} else {
			if (!(/[^\d.\u4e00-\u9fa5]/g.test(ipt))) {
				aa = ipt;

				for (var i = 0; i < availableTags.length; i++) {
					if (availableTags[i].indexOf(aa) >= 0) {
						$('#code_ipt').val(availableTags[i]);

						aa = availableTags[i].split(' ')[1];

						$purchase_price_buy = aa;

						ajax_func(aa);

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


// tab点击事件
function tab_click() {
	// 点击持仓或者委托
	$('.position_top a').each(function(index, el) {
		$('.position_top a').eq(index).click(function(event) {
			$('.position_inner').hide();
			$(this).addClass('active').siblings().removeClass('active');
			// console.log(index)
			if (index == 1) {
				$('.withdrawsing_ul').remove();
				$('.position_inner').eq(index).show();

				get_entrust_func('1', '30');
			} else if (index == 0) {
				$('.position_inner_ul').remove();
				$('.position_inner').eq(index).show();
				
				get_positions_func('1', '30');
			}
		});
	});
}


var price_max = null;
var price_min = null;
var _FixPrice = null;
// 获取涨跌停 买盘卖盘
function ajax_func(code) {
	$.ajax({
		url: allurl1 + 'uusjs/queryProductByCode.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
		data: {
			investorsCode: code
		},
		success: function(data) {
			// console.log(data);
			if (data.STATUS == '0') {

				//获取闭盘价
				if (Number(data.OBJECT.investorsClosePrice) > 0) {
					var close_Price = data.OBJECT.investorsClosePrice;
				} else {
					var close_Price = data.OBJECT.openPrice;
				}

				_FixPrice = Number(data.OBJECT.investorsFixPrice);

				// 清除买盘卖盘数据
				$('#sjs_right_sell,#sjs_right_buy').empty();

				// 买盘5档
				for (var i = 0; i < 5; i++) {
					var get_buy_disc = new buy_disc(data.OBJECT.buyFiverList[i], $('#sjs_right_buy'), i + 1, '买', close_Price, 0);
				}
				// 卖盘
				for (var i = 5; i >= 1; i--) {
					var get_sell_disc = new buy_disc(data.OBJECT.sellFiverList[i - 1], $('#sjs_right_sell'), i, '卖', close_Price, 1);

				}

				//
				$('.transaction_left_r ul').each(function() {
					$(this).on('click', function() {
						if ($(this).find('li').eq(1).html() != '…') {
							$('#price_number').val($(this).find('li').eq(1).html());
						} else {

						}
					})
				});


				// 获取涨停跌停价格
				if (_FixPrice > 0) {

					$('#price_number').val(data.OBJECT.investorsFixPrice);

					price_min = data.OBJECT.investorsFixPrice;

					get_nav_func(price_min, '', 1, 100000);

					// 获取可买数量
					purchasePrice($('#price_number').val());

					$('#buy_rise').html('请输入1000的倍数').css('width', '121px').show().siblings('b').hide();

				} else {
					$('#buy_rise').html('跌停' + '<i style="color:#04C192">' + data.OBJECT.limitDownPrice + '</i>').css('width', '58px').siblings('b').show().html('涨停' + '<i style="color:#FF2D41">' + data.OBJECT.limitUpPrice + '</i>');

					price_max = Number(data.OBJECT.limitUpPrice);
					price_min = Number(data.OBJECT.limitDownPrice);

					// 把价格添加到页面上
					$('#buy_rise').find('i').on('click', function() {
						$('#price_number').val($(this).html());
						// 获取可买数量
						purchasePrice($('#price_number').val())
					}).parent().siblings('b').find('i').on('click', function() {
						$('#price_number').val($(this).html());
						// 获取可买数量
						purchasePrice($('#price_number').val())
					})

					// 买盘卖盘的价格
					if ($('#sjs_right_sell ul').last().find('li').eq(1).html() > 0) {
						$('#price_number').val($('#sjs_right_sell ul').last().find('li').eq(1).html());

					} else {
						$('#price_number').val(data.OBJECT.newOrderPrice);
					}

					// 获取可买数量
					purchasePrice($('#price_number').val())

					get_nav_func(price_min, price_max);
				}


			} else {
				$('#buy_rise').html('--').siblings('b').html('--');
			}

		}
	})

}
// 买盘卖盘
function buy_disc(map, parent, page, ele, close, flag) {
	this.disc_b = document.createElement('b');
	this.disc_li1 = document.createElement('li');
	this.disc_li2 = document.createElement('li');
	this.disc_li3 = document.createElement('li');
	this.disc_ul = document.createElement('ul');

	this.disc_b.innerHTML = page;
	this.disc_li1.innerHTML = ele;
	this.disc_li1.appendChild(this.disc_b);

	if (map != undefined) {

		this.disc_li2.innerHTML = map.price;

		this.disc_li3.innerHTML = map.num;

		if (map.price > close) {
			this.disc_li2.style.color = '#FF2D41';
		} else if (map.price == close) {
			this.disc_li2.style.color = '#000';
		} else {
			this.disc_li2.style.color = '#04c192';
		}

		if (flag == 0) {
			this.disc_li3.style.color = '#FF2D41';
		} else if (flag == 1) {
			this.disc_li3.style.color = '#04c192';
		}

	} else {
		this.disc_li2.innerHTML = '…';

		this.disc_li3.innerHTML = '…';
	}

	this.disc_ul.appendChild(this.disc_li1);
	this.disc_ul.appendChild(this.disc_li2);
	this.disc_ul.appendChild(this.disc_li3);

	this.map = map;

	parent.append(this.disc_ul);
}


// 点击价格时间加减号
//flag 判断是否是申购日
function get_nav_func(min, max, flag, price) {

	$('#price_remove,#price_add,#time_remove,#time_add').off('click');
	$('#price_number').on('change', function() {
		purchasePrice($('#price_number').val())
	})

	// 买入价格
	$('#price_remove').on('click', function() {
		var price_nav_num = Number($('#price_number').val());
		get_price_func(1, price_nav_num, $('#price_number'), max, min);
	})

	$('#price_add').on('click', function() {
		var price_add_num = Number($('#price_number').val());
		get_price_func(2, price_add_num, $('#price_number'), max, min);
	})

	if (flag > 0) {
		// 买入时间
		$('#time_remove').on('click', function() {
			var nav_time_num = Number($('#time_number').val());
			purchase_time_func2(1, nav_time_num, $('#time_number'), price);
		})

		$('#time_add').on('click', function() {
			var nav_time_add = Number($('#time_number').val());
			purchase_time_func2(2, nav_time_add, $('#time_number'), price);
		})

	} else {
		// 买入时间
		$('#time_remove').on('click', function() {
			var nav_time_num = Number($('#time_number').val());
			purchase_time_func(1, nav_time_num, $('#time_number'), price);
		})

		$('#time_add').on('click', function() {
			var nav_time_add = Number($('#time_number').val());
			purchase_time_func(2, nav_time_add, $('#time_number'), price);
		})
	}


}

function get_purchase_modal_event() {

	// 买入
	$("#purchaseForm").validate({
		debug: true,
		onSubmit: false,
		rules: {
			code_ipt: {
				required: true,
			},
			buyerOrderPrice: {
				required: true,
				minlength: 1
			},
			buyerOrderNum: {
				required: true,
				minlength: 1
			}
		},
		messages: {
			code_ipt: {
				required: "请填写发行人", //输入为空时的提示信息
			},
			buyerOrderPrice: {
				required: "请填写价格",
				minlength: '买入价格不能小于1元'
			},
			buyerOrderNum: {
				required: "请填写时间",
				minlength: '买入时间不能小于1秒'
			}
		},

		submitHandler: function() {
			// console.log(_FixPrice);
			$('#code_ipt_hide').val($purchase_price_buy);

			if (_FixPrice > 0) {
				if (Number($('#time_number').val()) % 1000 == 0 && Number($('#time_number').val()) <= 100000) {
					$('#myModal .panel-body p').eq(0).find('b').html($('#code_ipt').val()).siblings('input').val($('#code_ipt_hide').val());

					$('#myModal .panel-body p').eq(1).find('b').html($('#price_number').val() + '元/秒').siblings('input').val($('#price_number').val());

					$('#myModal .panel-body p').eq(2).find('b').html($('#time_number').val() + '秒').siblings('input').val($('#time_number').val());

					$('#passwordBtn').val('');

					$('#myModal').modal('show');

					if ((Number($('#price_number').val()) * Number($('#time_number').val()) * 0.003) < 0.01) {
						var Purse_length = ((Number($('#price_number').val()) * Number($('#time_number').val())) + 0.01).toFixed(2);
					} else {
						var Purse_length = ((Number($('#price_number').val()) * Number($('#time_number').val())) + (Number($('#price_number').val()) * Number($('#time_number').val()) * 0.003)).toFixed(2);
					}


					$('#myModal .panel-body p').eq(3).find('b').html(Purse_length + '元');

					if (Number($('#time_number').val()) > Number($('#purchaseForm strong i').html())) {
						$('#myModal .panel-body p').eq(2).find('label').html('余额不足');

						$('.payment_password').hide();

						$('#buyBtn').html('立即充值').on('click', function() {
							window.location = 'sjs_wallet.html?htmlFlag=1';
						});

					} else {
						get_cookie();
					}
				} else {
					alert_model('买入数量不是1000的倍数');
				}

			} else {

				if (Number($('#price_number').val()) < price_min) {
					alert_model('不能小于当天的跌停价');
				} else if (Number($('#price_number').val()) > price_max) {
					alert_model('不能大于当天的涨停价');
				} else {
					$('#myModal .panel-body p').eq(0).find('b').html($('#code_ipt').val()).siblings('input').val($('#code_ipt_hide').val());

					$('#myModal .panel-body p').eq(1).find('b').html($('#price_number').val() + '元/秒').siblings('input').val($('#price_number').val());

					$('#myModal .panel-body p').eq(2).find('b').html($('#time_number').val() + '秒').siblings('input').val($('#time_number').val());

					$('#passwordBtn').val('');

					$('#myModal').modal('show');

					if ((Number($('#price_number').val()) * Number($('#time_number').val()) * 0.003) < 0.01) {
						var Purse_length = ((Number($('#price_number').val()) * Number($('#time_number').val())) + 0.01).toFixed(2);
					} else {
						var Purse_length = ((Number($('#price_number').val()) * Number($('#time_number').val())) + (Number($('#price_number').val()) * Number($('#time_number').val()) * 0.003)).toFixed(2);
					}

					$('#myModal .panel-body p').eq(3).find('b').html(Purse_length + '元');

					if (Number($('#time_number').val()) > Number($('#purchaseForm strong i').html())) {
						$('#myModal .panel-body p').eq(2).find('label').html('余额不足');

						$('.payment_password').hide();

						$('#buyBtn').html('立即充值').on('click', function() {
							window.location = 'sjs_wallet.html?htmlFlag=1';
						});

					} else {
						get_cookie();
					}

				}
			}
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});


	$("#submitForm").validate({
		rules: {
			PayWord: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			PayWord: {
				required: "请输入支付密码",
				minlength: '密码最少要6位'
			}

		},
		debug: true,
		onSubmit: false,
		submitHandler: function() {
			var primary_Password = hex_md5($('#passwordBtn').val());

			$('#passwordHid').val(primary_Password);
			$.ajax({
				url: allurl1 + 'uusjs/security/userPayPassword.do',
				type: 'POST',
				dataType: 'json',
				data: {
					type: '4',
					oldPayPassword: primary_Password
				},
				success: function(data) {
					if (data.STATUS == "0") {
						$.post(allurl1 + 'uusjs/orderReservations.do',
							$('#submitForm').serialize(),
							function(data) {
								if (data.STATUS == '0') {
									modal_tips('买入', $('#code_ipt').val());
									$('.reset').click();

									$('#passwordBtn').val('');

									setTimeout(function() {
										window.location = 'sjs_transaction_buy.html';
									}, 1000);

								} else {
									alert_model(data.MSG);

									$('#passwordBtn').val('');
								}
							}, 'json');
						$('#myModal').modal('hide');

					} else {
						alert_model(data.MSG);

						$('#passwordBtn').val('');

					}
				}
			})


		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});


};


// 获取持仓
function get_positions_func(page, size) {
	$.ajax({
		url: allurl1 + 'uusjs/queryPositionProduct.do',
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: page,
			pageSize: size,
		},
		success: function(data) {
			// console.log(data);
			if (data.STATUS == '0') {

				// 创建面向对象
				var get_routes_container = document.getElementById('whole_positions_scroll');

				if (data.LIST.length > 0) {
					for (var i = 0; i < data.LIST.length; i++) {
						var create_one_route = new query_positions(data.LIST[i], get_routes_container, data.OBJECT);
						create_one_route.getclick();

						$('.transaction_content_center span').html(data.LIST[0].investorsName + '  ' + data.LIST[0].investorsCode);

					}
				} else {
					$('#whole_positions_scroll').off('scroll');
				}	

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
			}

		}
	})


}


$('.reset').on('click', function() {
	$(this).parent().find('li input').eq(0).val('').parent().parent().siblings().find('input').val('').parent().parent().siblings().find('b').html('--').parent().siblings().find('i').html('--');
});


function query_positions(map, parent, data) {
	this.clear_li1 = document.createElement('li');
	this.clear_li1.innerHTML = map.investorsCode;

	this.clear_li2 = document.createElement('li');
	this.clear_li2.innerHTML = map.investorsName;

	this.clear_li3 = document.createElement('li');
	this.clear_li3.innerHTML = map.possessNum;

	this.clear_li4 = document.createElement('li');
	this.clear_li4.innerHTML = map.newOrderPrice;

	this.clear_li5 = document.createElement('li');
	this.clear_li5.innerHTML = map.buyerOrderNum;

	this.clear_li6 = document.createElement('li');
	this.clear_li6.innerHTML = map.buyerOrderPrice;

	this.clear_li7 = document.createElement('li');
	this.clear_li7.innerHTML = map.uplowPrice;

	this.clear_li8 = document.createElement('li');
	this.clear_li8.innerHTML = data.userPurse;

	this.clear_li9 = document.createElement('li');
	this.clear_li9.innerHTML = map.singlePosition;


	if (map.uplowPrice == 1) {
		this.clear_li7.className = 'red';
		this.clear_li8.className = 'red';
	} else if (map.uplowPrice == 2) {
		this.clear_li7.className = 'green';
		this.clear_li8.className = 'green';

	}

	this.ul = document.createElement('ul');
	this.ul.className = 'position_inner_ul';
	this.ul.appendChild(this.clear_li1);
	this.ul.appendChild(this.clear_li2);
	this.ul.appendChild(this.clear_li3);
	this.ul.appendChild(this.clear_li4);
	this.ul.appendChild(this.clear_li5);
	this.ul.appendChild(this.clear_li6);
	this.ul.appendChild(this.clear_li7);
	this.ul.appendChild(this.clear_li8);
	this.ul.appendChild(this.clear_li9);

	parent.appendChild(this.ul);

	this.map = map;
}
query_positions.prototype.getclick = function() {
	var _this = this;
	this.ul.onclick = function() {
		get_buy_disc_sell(_this.map.investorsCode);

		$('#code_ipt').val(_this.map.investorsName + '  ' + _this.map.investorsCode);

		ajax_func(_this.map.investorsCode);

		$('#price_number').val(_this.map.newOrderPrice);

		$('#purchaseForm strong i').html(_this.map.buyerOrderNum);

		$purchase_price_buy = _this.map.investorsCode;

	}
}