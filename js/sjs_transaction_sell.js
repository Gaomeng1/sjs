jQuery(document).ready(function ($) {

	// 获取持仓
	get_positions_func('1', '30');


	tab_click();


});

var $purchase_price_sell = null;
var $purchase_sell = null;
var $availableflag = 0;
var $quotation = '';
var aa = null;
var bb = null;
$(function () {
	var availableTags = [];
	if ($availableflag == 0) {
		$.ajax({
			url: allurl1 + 'uusjs/autoComplete.do',
			dataType: 'json',
			type: "POST",
			data: {
				investorsCode: $quotation
			},
			success: function (data) {
				// console.log(data)
				$.each(data.LIST, function (index, el) {
					availableTags.push(el.investorsName + ' ' + el.investorsCode);
				});

			}
		});


		$availableflag = 1;
	}

	//卖出
	$('#sell_out_ipt').autocomplete({
		source: availableTags,
		focus: function (event, ui) {
			$purchase_price_sell = ui.item.label.split(' ')[1];
			$purchase_sell = ui.item.label;
		},
		select: function () {
			if ($('#whole_positions_scroll').html() != '') {
				$('.position_inner_ul').each(function (index) {
					console.log($('.position_inner_ul').eq(index).find('li').eq(0).html() == $purchase_price_sell)
					if ($('.position_inner_ul').eq(index).find('li').eq(0).html() == $purchase_price_sell) {
						get_buy_disc_sell($purchase_price_sell);

						$('#sell_out').removeAttr('disabled');

						$('.transaction_content_center span').html($purchase_sell);

						$('#purchase_sell_number').focus();

						$('#time_sell_number').val($('.position_inner_ul').eq(index).find('li').eq(4).html());

						$('#purchase_sell_Form strong i').html($('.position_inner_ul').eq(index).find('li').eq(4).html());

						ajax_func($purchase_price_sell);

						return false;
					} else {
						$('#purchase_sell_number').focus();

						$('#sell_out').attr('disabled', 'true');
					}
				});
			} else {
				$('#purchase_sell_number').focus();

				$('#sell_out').attr('disabled', 'true');
			}
		}
	}).focus(function () {
		$purchase_sell = null;

		$('.reset').click();

	})


});

// tab点击事件
function tab_click() {
	// 点击持仓或者委托
	$('.position_top a').each(function (index, el) {
		$('.position_top a').eq(index).click(function (event) {
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
// 
function ajax_func(code) {
	$.ajax({
		url: allurl1 + 'uusjs/queryProductByCode.do',
		type: 'POST',
		dataType: 'json',
		data: {
			investorsCode: code
		},
		success: function (data) {
			// console.log(data);

			if (data.STATUS == '0') {

				//获取闭盘价
				if (Number(data.OBJECT.investorsClosePrice) > 0) {
					var close_Price = data.OBJECT.investorsClosePrice;
				} else {
					var close_Price = data.OBJECT.openPrice;
				}

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
				$('.transaction_left_r ul').each(function (index, el) {
					$(this).on('click', function () {
						if (!/\d+/g.test($(this).find('li').eq(1).html())) {

						} else {
							$('#purchase_sell_number').val($(this).find('li').eq(1).html());
						}
					})
				});


				// 获取涨停跌停价格
				if (data.OBJECT.investorsFixPrice > 0) {
					$('#sell_rise').html('跌停' + '<i style="color:#04C192">' + data.OBJECT.investorsFixPrice + '</i>').siblings('b').html('涨停' + '<i style="color:#FF2D41">' + data.OBJECT.investorsFixPrice + '</i>');

					$('#purchase_sell_number').val(data.OBJECT.investorsFixPrice);

					price_max, price_min = data.OBJECT.investorsFixPrice;
				} else {
					$('#sell_rise').html('跌停' + '<i style="color:#04C192">' + data.OBJECT.limitDownPrice + '</i>').siblings('b').html('涨停' + '<i style="color:#FF2D41">' + data.OBJECT.limitUpPrice + '</i>');

					price_max = data.OBJECT.limitUpPrice;
					price_min = data.OBJECT.limitDownPrice;

					// 把价格添加到页面上
					$('#sell_rise').find('i').on('click', function () {
						$('#purchase_sell_number').val($(this).html());
					}).parent().siblings('b').find('i').on('click', function () {
						$('#purchase_sell_number').val($(this).html());
					})

					// 买盘卖盘的价格
					if ($('#sjs_right_sell ul').last().find('li').eq(1).html() > 0) {
						$('#purchase_sell_number').val($('#sjs_right_sell ul').last().find('li').eq(1).html());

					} else {
						$('#purchase_sell_number').val(data.OBJECT.newOrderPrice);
					}

					// 获取可买数量
					purchasePrice($('#purchase_sell_number').val())
				}

				get_nav_func(Number(data.OBJECT.limitUpPrice), Number(data.OBJECT.limitDownPrice));

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

function get_nav_func(max, min) {

	$('#time_sell_remove,#time_sell_add,#purchase_sell_add,#purchase_sell_remove').off('click');

	$('#price_number').on('change', function () {

		purchasePrice($('#price_number').val())
	})

	// 卖出价格
	$('#purchase_sell_remove').on('click', function () {
		var price_nav_remove = Number($('#purchase_sell_number').val());
		// console.log(price_nav_remove)
		get_price_func(1, price_nav_remove, $('#purchase_sell_number'), max, min);
	})

	$('#purchase_sell_add').on('click', function () {
		var price_nav_add = Number($('#purchase_sell_number').val());
		// console.log(price_nav_add)
		get_price_func(2, price_nav_add, $('#purchase_sell_number'), max, min);
	})

	// 卖出时间
	$('#time_sell_remove').on('click', function () {
		var purchase_sell_remove = Number($('#time_sell_number').val());
		purchase_time_func(1, purchase_sell_remove, $('#time_sell_number'));
	})
	$('#time_sell_add').on('click', function () {
		var purchase_sell_add = Number($('#time_sell_number').val());
		purchase_time_func(2, purchase_sell_add, $('#time_sell_number'));
	})
}


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
		success: function (data) {
			// console.log(data);
			if (data.STATUS == '0') {

				// 创建面向对象
				var get_routes_container = document.getElementById('whole_positions_scroll');

				if (data.LIST.length > 0) {
					for (var i = 0; i < data.LIST.length; i++) {
						var create_one_route = new query_positions(data.LIST[i], get_routes_container, data.OBJECT);
						create_one_route.getclick();

						$('.transaction_content_center span').html(data.LIST[0].investorsName + '  ' + data.LIST[0].investorsCode);

						get_purchase_modal_event(data.LIST)

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

	parent.appendChild(this.ul)

	this.map = map;
}
query_positions.prototype.getclick = function () {
	var _this = this;
	this.ul.onclick = function () {
		get_buy_disc_sell(_this.map.investorsCode);

		$('#sell_out_ipt').val(_this.map.investorsName + '  ' + _this.map.investorsCode);

		ajax_func(_this.map.investorsCode);

		$('#purchase_sell_number').val(_this.map.newOrderPrice);

		$('#time_sell_number').val(_this.map.possessNum);

		$('#purchase_sell_Form strong i').html(_this.map.buyerOrderNum);

		$purchase_price_sell = _this.map.investorsCode;
	}
}


// 买入卖出
function get_purchase_modal_event(map) {
	// 卖出
	$("#purchase_sell_Form").validate({
		debug: true,
		onSubmit: false,
		rules: {
			sell_out_ipt: {
				required: true,
			},
			sellOrderPrice: {
				required: true,
				minlength: 1
			},
			sellOrderNum: {
				required: true,
				minlength: 1
			}
		},
		messages: {
			sell_out_ipt: {
				required: "请填写发行人", //输入为空时的提示信息
			},
			sellOrderPrice: {
				required: "请填写价格",
				minlength: '卖出价格不能小于1元'
			},
			sellOrderNum: {
				required: "请填写时间",
				minlength: '密码为6位数字',
			}

		},
		submitHandler: function () {
			// console.log(map);
			$('#sell_out_ipt_hide').val($purchase_price_sell);

			if (Number($('#purchase_sell_number').val()) < price_min) {
				layer.alert('不能小于当天的跌停价');
			} else if (Number($('#purchase_sell_number').val()) > price_max) {
				layer.alert('不能大于当天的涨停价');
			} else {
				for (var i = 0; i < map.length; i++) {
					if (map[i].investorsCode == $('#sell_out_ipt_hide').val()) {

						if (Number($('#time_sell_number').val()) > Number($('#purchase_sell_Form strong i').html())) {
							layer.alert('不能大于可卖数量');
						} else {
							$('#sellForm .panel-body p').eq(0).find('b').html($('#sell_out_ipt').val()).siblings('input').val($('#sell_out_ipt_hide').val());

							$('#sellForm .panel-body p').eq(1).find('b').html($('#purchase_sell_number').val() + '元/秒').siblings('input').val($('#purchase_sell_number').val());

							$('#sellForm .panel-body p').eq(2).find('b').html($('#time_sell_number').val() + '秒').siblings('input').val($('#time_sell_number').val());

							$('#sellpassword').val('');

							$('#sellModal').modal('show');


							if (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val() * 0.003) < 0.01) {
								var _sellPurse = (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val()) - 0.01).toFixed(2);
							} else {
								var _sellPurse = (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val()) - (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val())) * 0.003).toFixed(2);
							}


							$('#sellForm .panel-body p').eq(3).find('b').html(_sellPurse + '元');

						}

						// console.log(map);

					} else {
						// alert_model('暂未持有该发行人');
					}
				}
			}


		},
		errorPlacement: function (error, element) {
			error.appendTo(element.parent().last());

		}
	});

	$("#sellForm").validate({
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
		submitHandler: function () {
			var sell_Password = hex_md5($('#sellpassword').val());

			$('#passwordHid').val(sell_Password);

			// console.log($('#passwordHid').val());

			$.ajax({
				url: allurl1 + 'uusjs/security/userPayPassword.do',
				type: 'POST',
				dataType: 'json',
				data: {
					type: '4',
					oldPayPassword: sell_Password
				},
				success: function (data) {
					// console.log(data);
					if (data.STATUS == "0") {
						$.post(allurl1 + 'uusjs/sellOrder.do',
							$('#sellForm').serialize(),
							function (data) {
								// console.log(data);
								if (data.STATUS == 3) {
									window.location = 'sjs_load.html';
								} else if (data.STATUS == "0") {
									modal_tips('卖出', $purchase_price_sell);
									$('.reset').click();

									$('#sellpassword').val('');

									setTimeout(function () {
										window.location.reload();
									}, 1000)

								} else {
									alert_model(data.MSG);

									$('#sellpassword').val('');
								}
							}, 'json');

						$('#sellModal').modal('hide');


					} else {
						alert_model(data.MSG);

						$('#sellpassword').val('');
					}
				}
			})


		},
		errorPlacement: function (error, element) {
			error.appendTo(element.parent().last());
		}

	});
};


$('.reset').on('click', function () {
	$(this).parent().find('li input').eq(0).val('').attr('placeholder', '搜索发行人').parent().parent().siblings().find('input').val('').parent().parent().siblings().find('b').html('--').parent().siblings().find('i').html('--');
});