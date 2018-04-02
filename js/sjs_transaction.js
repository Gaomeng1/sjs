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

jQuery(document).ready(function($) {



	tab_click();

	get_positions_func('1', '10');

	if (_name != '' && _price != '' && _code != '') {
		$('#code_ipt').val(_name + '  ' + _code);

		$purchase_price_buy = _code;

		$('#price_number').val(_price);

		ajax_func(_code, '1', $('#buy_rise'))


	} else {

	}


	// $(".sjs_transaction_content").niceScroll({
	// 	cursorcolor: "#999",
	// 	cursoropacitymax: 1,
	// 	touchbehavior: false,
	// 	cursorwidth: "3px",
	// 	cursorborder: "0",
	// 	cursorborderradius: "5px"
	// });
});



var $purchase_price_buy = null;
var $purchase_price_sell = null;
var $purchase_ipt = null;
var $purchase_sell = null;
var $availableflag = 0;
var $quotation = '';
var aa = null;
var bb = null;
$(function() {
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
				// console.log(data)
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


});



var price_max = null;
var price_min = null;
// 
function ajax_func(code, page, select) {
	$.ajax({
		url: allurl1 + 'uusjs/queryProductByCode.do',
		type: 'POST',
		dataType: 'json',
		data: {
			investorsCode: code
		},
		success: function(data) {
			// console.log(data);
			if (data.OBJECT != null) {
				$('#sjs_right_sell,#sjs_right_buy').empty();

				if (parseInt(data.OBJECT.investorsClosePrice) > 0) {
					var close_Price = data.OBJECT.investorsClosePrice;
				} else {
					var close_Price = data.OBJECT.openPrice;
				}

				// 买盘5档
				for (var i = 0; i < 5; i++) {
					var get_buy_disc = new buy_disc(data.OBJECT.buyFiverList[i], $('#sjs_right_buy'), i + 1, '买', close_Price, 0, page);
				}
				// 卖盘
				for (var i = 5; i >= 1; i--) {
					var get_sell_disc = new buy_disc(data.OBJECT.sellFiverList[i - 1], $('#sjs_right_sell'), i, '卖', close_Price, 1, page);

				}

				if (page == '1') {
					$('.transaction_left_r ul').each(function(index, el) {
						$(this).on('click', function() {
							$('#price_number').val($(this).find('li').eq(1).html())
						})
					});
				} else if (page == '2') {
					$('.transaction_left_r ul').each(function(index, el) {
						$(this).on('click', function() {
							$('#purchase_sell_number').val($(this).find('li').eq(1).html())
						})
					});
				}

				if (data.OBJECT.investorsFixPrice > 0) {
					select.html('跌停' + '<i style="color:#04C192">' + data.OBJECT.investorsFixPrice + '</i>').siblings('b').html('涨停' + '<i style="color:#FF2D41">' + data.OBJECT.investorsFixPrice + '</i>');

					$('#price_number').val(data.OBJECT.investorsFixPrice);

					price_max, price_min = data.OBJECT.investorsFixPrice;
				} else {
					select.html('跌停' + '<i style="color:#04C192">' + data.OBJECT.limitDownPrice + '</i>').siblings('b').html('涨停' + '<i style="color:#FF2D41">' + data.OBJECT.limitUpPrice + '</i>');

					price_max = data.OBJECT.limitUpPrice;
					price_min = data.OBJECT.limitDownPrice;
					if (page == '1') {
						select.find('i').on('click', function() {
							$('#price_number').val($(this).html());
						}).parent().siblings('b').find('i').on('click', function() {
							$('#price_number').val($(this).html());
						})

						if ($('#sjs_right_sell ul').last().find('li').eq(1).html() > 0) {
							$('#price_number').val($('#sjs_right_sell ul').last().find('li').eq(1).html());

						} else {
							$('#price_number').val(data.OBJECT.newOrderPrice);
						}

						purchasePrice($('#price_number').val())

					} else if (page == '2') {
						// console.log(page);
						select.find('i').on('click', function() {
							$('#purchase_sell_number').val($(this).html());
						}).parent().siblings('b').find('i').on('click', function() {
							$('#purchase_sell_number').val($(this).html());
						})

						if ($('#sjs_right_buy ul').first().find('li').eq(1).html() > 0) {
							$('#purchase_sell_number').val($('#sjs_right_buy ul').first().find('li').eq(1).html());
						} else {
							$('#purchase_sell_number').val(data.OBJECT.newOrderPrice);
						}
					}

					get_nav_func(Number(data.OBJECT.limitUpPrice), Number(data.OBJECT.limitDownPrice));



				}

			} else {
				select.html('--').siblings('b').html('--');
			}

		}
	})

}



function tab_click() {
	$('.transaction_tab_inner a').eq(0).click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.transaction_entrust').hide().siblings().show();
		$('#purchaseForm').show().siblings().hide();

		$('.reset').click();

		$('#sjs_right_sell li').nextAll(1).html('…').css({
			'color': '#000'
		});
		$('#sjs_right_buy li').nextAll(1).html('…').css({
			'color': '#000'
		});
	})

	$('.transaction_tab_inner a').eq(1).click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.transaction_entrust').hide().siblings().show();
		$('#purchase_sell_Form').show().siblings().hide();

		$('.reset').click();

		$('#sjs_right_sell li').nextAll(1).html('…').css({
			'color': '#000'
		});
		$('#sjs_right_buy li').nextAll(1).html('…').css({
			'color': '#000'
		});
	})

	$('.transaction_tab_inner a').eq(2).click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.transaction_entrust').show().siblings().hide();

		get_withdraw_order('1', '10');


	})

	$('.position_top a').each(function(index, el) {
		$('.position_top a').eq(index).click(function(event) {
			$('.position_inner').hide();
			$(this).addClass('active').siblings().removeClass('active');
			// console.log(index)
			if (index == 1) {
				$('.withdrawsing_ul').remove();
				$('.position_inner').eq(index).show();
				get_entrust_func('1', '10', 2);
			} else if (index == 0) {
				$('.position_inner_ul').eq(index).remove();
				$('.position_inner').eq(index).show();
				get_positions_func('1', '10');
			}
		});
	});
}



// 买入卖出
function get_purchase_modal_event(map) {
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
			$('#code_ipt_hide').val($purchase_price_buy);

			if (Number($('#price_number').val()) < price_min) {
				layer.alert('不能小于当天的跌停价');
			} else if (Number($('#price_number').val()) > price_max) {
				layer.alert('不能大于当天的跌停价');
			} else {
				$('#myModal .panel-body p').eq(0).find('b').html($('#code_ipt').val()).siblings('input').val($('#code_ipt_hide').val());

				$('#myModal .panel-body p').eq(1).find('b').html($('#price_number').val()).siblings('input').val($('#price_number').val());

				$('#myModal .panel-body p').eq(2).find('b').html($('#time_number').val()).siblings('input').val($('#time_number').val());

				$('#myModal').modal('show');

				var Purse_length = (Number($('#price_number').val()) * Number($('#time_number').val()) + Number($('#price_number').val()) * Number($('#time_number').val()) * 0.003).toFixed(2);

				$('#myModal .panel-body p').eq(3).find('b').html(Purse_length);

				if (Number($('#time_number').val()) > Number($('#purchaseForm strong i').html())) {
					$('#myModal .panel-body p').eq(2).find('label').html('余额不足');

					$('.payment_password').hide();

					$('#buyBtn').html('立即充值').on('click', function() {
						window.location = 'sjs_wallet.html';
					});

				} else {
					get_cookie();
				}
			}



		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});


	$("#submitForm").validate({
		rules: {
			user_payWord: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			user_payWord: {
				required: "请输入支付密码",
				minlength: '密码最少要6位'
			}

		},
		debug: true,
		onSubmit: false,
		submitHandler: function() {
			var primary_Password = hex_md5($('#passwordBtn').val());

			$('#passwordBtn').val(primary_Password);


			$.ajax({
				url: allurl1 + 'uusjs/security/userPayPassword.do',
				type: 'POST',
				dataType: 'json',
				data: {
					type: '4',
					oldPayPassword: primary_Password
				},
				success: function(data) {
					// console.log(data);
					if (data.MSG == "SUCCESS") {
						$.post(allurl1 + 'uusjs/orderReservations.do',
							$('#submitForm').serialize(),
							function(data) {
								// console.log(data);
								if (data.STATUS == 3) {
									window.location = 'sjs_load.html';
								} else if (data.MSG == "SUCCESS") {
									modal_tips('买入', $('#code_ipt').val());
									$('.reset').click();
								} else {
									alert_model(data.MSG);

									$('#passwordBtn').val('');

								}
							}, 'json');
						$('#myModal').modal('hide');

					} else {
						alert_model(data.MSG)
					}
				}
			})


		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});


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
		submitHandler: function() {
			// console.log(map);
			$('#sell_out_ipt_hide').val($purchase_price_sell);


			if (Number($('#purchase_sell_number').val()) < price_min) {
				layer.alert('不能小于当天的跌停价');
			} else if (Number($('#purchase_sell_number').val()) > price_max) {
				layer.alert('不能大于当天的跌停价');
			} else {
				// console.log(map);
				for (var i = 0; i < map.length; i++) {
					// console.log(map[i].investorsCode);
					if (map[i].investorsCode == $('#sell_out_ipt_hide').val()) {


						if (Number($('#time_sell_number').val()) > Number($('#purchase_sell_Form strong i').html())) {
							layer.alert('不能大于可卖数量');
						} else {
							$('#sellForm .panel-body p').eq(0).find('b').html($('#sell_out_ipt').val()).siblings('input').val($('#sell_out_ipt_hide').val());

							$('#sellForm .panel-body p').eq(1).find('b').html($('#purchase_sell_number').val()).siblings('input').val($('#purchase_sell_number').val());

							$('#sellForm .panel-body p').eq(2).find('b').html($('#time_sell_number').val()).siblings('input').val($('#time_sell_number').val());

							$('#sellModal').modal('show');

							var _sellPurse = (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val()) + (Number($('#purchase_sell_number').val()) * Number($('#time_sell_number').val())) * 0.003).toFixed(2);



							$('#sellForm .panel-body p').eq(3).find('b').html(_sellPurse);

						}

						// console.log(map);

					} else {
						alert_model('暂未持有该发行人');
					}
				}
			}



		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());

		}
	});

	$("#sellForm").validate({
		rules: {
			user_payWord: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			user_payWord: {
				required: "请输入支付密码",
				minlength: '密码最少要6位'
			}

		},
		debug: true,
		onSubmit: false,
		submitHandler: function() {
			var sell_Password = hex_md5($('#sellpassword').val());

			$('#sellpassword').val(sell_Password)

			$.ajax({
				url: allurl1 + 'uusjs/security/userPayPassword.do',
				type: 'POST',
				dataType: 'json',
				data: {
					type: '4',
					oldPayPassword: sell_Password
				},
				success: function(data) {
					// console.log(data);
					if (data.MSG == "SUCCESS") {
						$.post(allurl1 + 'uusjs/sellOrder.do',
							$('#sellForm').serialize(),
							function(data) {
								// console.log(data);
								if (data.STATUS == 3) {
									window.location = 'sjs_load.html';
								} else if (data.MSG == "SUCCESS") {
									modal_tips('卖出', $purchase_price_sell);
									$('.reset').click();
								} else {
									alert_model(data.MSG);
								}
							}, 'json');

						$('#sellModal').modal('hide');

					} else {
						alert_model(data.MSG);
					}
				}
			})


		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});

	$('.reset').on('click', function() {
		$(this).parent().find('li input').eq(0).val('').parent().parent().siblings().find('input').val('').parent().parent().siblings().find('b').html('--').parent().siblings().find('i').html('-');
	});

};



// 获取cookie
function get_cookie() {
	var flag = getCookie('sjs_stats_flag');

	if (flag != '') {
		if (flag == '1') {
			$('#myModal .panel-body p').eq(2).find('label').html('');

			$('.payment_password').show();

			$('#buyBtn').html('确认支付').off('click');
		} else if (flag == '2') {
			$('#myModal .panel-body p').eq(2).find('label').html('未设置支付密码');

			$('.payment_password').hide();

			$('#buyBtn').html('设置密码').on('click', function() {
				window.location = 'sjs_asset.html?flag=2';
			});
		}
	} else {
		window.location = 'sjs_load.html';
	}
}



// 查询可购买数量接口
function purchasePrice(price) {
	$.ajax({
		url: allurl1 + 'uusjs/queryCanBuyTime.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
		data: {
			price: price
		},
		success: function(data) {
			// console.log(data);
			if (data.MSG == 'SUCCESS') {
				$('#purchaseForm strong i').html(data.OBJECT.num);
			} else if (data.STATUS == 3) {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}
		}
	})

}

//提示弹框样式
function alert_model(ele) {
	layer.open({
		title: false,
		skin: 'alert_modal', //样式类名
		closeBtn: 0, //不显示关闭按钮
		shift: 2,
		area: ['260px', 'auto'],
		shadeClose: true, //开启遮罩关闭
		content: ele + '<p><button type="button" class="active">确定</button></p>',
		btn: []
	});

	$('.alert_modal button').on('click', function() {
		setTimeout(function() {
			layer.closeAll();
		}, 1);
	})
}

//
function modal_tips(type, ele) {
	$('.modal_open').show();
	$('.modal_open p').html('您的' + type + '委托' + ele + '已提交');
	setInterval(function() {
		$('.modal_open').hide();
	}, 4000)
}


// 右面买盘卖盘
var mint_price = [];
var mint_min_time = [];
// 价格
var tArray = new Array();
// 涨跌幅
var aArray = new Array();
// 成交
var amount = new Array();
// 成交量
var mint_volume = [];
// 颜色
var mint_color = [];

var close_Price = null;

var uplowFlag = null;

function get_buy_disc_sell(code) {
	// console.log(code)
	$.ajax({
		url: allurl1 + 'uusjs/publishInformation.do',
		type: 'POST',
		dataType: 'json',
		data: {
			pcode: code
		},
		success: function(data) {
			// console.log(data);

			if (data.OBJECT.baseInformation != null) {
				uplowFlag = data.OBJECT.baseInformation.uplowFlag;
				if (Number(data.OBJECT.baseInformation.closePrice) > 0) {
					close_Price = data.OBJECT.baseInformation.closePrice;
				} else {
					close_Price = data.OBJECT.baseInformation.openPrice;
				}
			} else {

			}

			mint_price = [];
			mint_min_time = [];
			mint_volume = [];
			mint_color = [];



			// 分时图
			if (data.OBJECT.minitePriceList.length > 0) {

				for (var k = 0; k < data.OBJECT.minitePriceList.length; k++) {
					mint_min_time.push(data.OBJECT.minitePriceList[k].time)

					mint_color.push((data.OBJECT.minitePriceList[k].buyAndSell * 10) % 10);

					mint_volume.push(parseInt(data.OBJECT.minitePriceList[k].buyAndSell.split('.')[0]));
					mint_price.push(data.OBJECT.minitePriceList[k].price);
				}


				//获取价格参数
				for (var a = 0; a < mint_min_time.length; a++) {

					tArray[a] = [mint_min_time[a], mint_price[a]];

					amount[a] = [mint_volume[a], mint_color[a]];

				}

				// console.log(amount);

				//获取增幅参数
				for (var a = 0; a < mint_min_time.length; a++) {
					var add = ((parseFloat(mint_price[a]) - parseFloat(close_Price)) / parseFloat(close_Price)) * 100;

					aArray[a] = [mint_volume[a], add.toFixed(2) + ""];


				}

				// 分时
				init_chart(close_Price, data.OBJECT.baseInformation.uplowFlag);
			} else {
				for (var i = 0; i < mint_time.length; i++) {
					mint_min_time.push('0.00')

					mint_color.push((0 * 10) % 10);

					mint_volume.push('0.00');
					mint_price.push('0.00');
				}

				console.log(mint_min_time);

				//获取价格参数
				for (var a = 0; a < mint_min_time.length; a++) {

					tArray[a] = [mint_min_time[a], mint_price[a]];

					amount[a] = [mint_volume[a], mint_color[a]];

				}

				// console.log(amount);

				//获取增幅参数
				for (var a = 0; a < mint_min_time.length; a++) {
					var add = ((parseFloat(mint_price[a]) - parseFloat(close_Price)) / parseFloat(close_Price)) * 100;

					aArray[a] = [mint_volume[a], add.toFixed(2) + ""];


				}

				// 分时
				init_chart(close_Price, data.OBJECT.baseInformation.uplowFlag);

			}
			// console.log(tArray)


		}
	})
}

// 买盘卖盘
function buy_disc(map, parent, page, ele, close, flag, size) {
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
	this.flag = size;

	parent.append(this.disc_ul);
}



// 获取持仓
var user_Purse = null;

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
			// console.log(data)

			if (data.MSG == 'SUCCESS') {
				var get_routes_container = document.getElementById('whole_positions');

				var create_route_container = new one_route_container(get_routes_container, data.LIST, page, data.OBJECT);

				// console.log(parseInt(data.OBJECT.userPurse));

				user_Purse = data.OBJECT.userPurse;

				get_purchase_modal_event(data.LIST);

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}

		}
	})


}


// 清除
function hide_hot_service() {
	// console.log($('#withdrawsing_contaniner').find('.Hot_service'));
	$('#whole_positions').find('.Hot_service').each(function() {
		$(this).hide();
	})
}

function one_route_container(obj, data, page, map) {
	//
	if (data.length >= 1) {
		for (var i = 0; i < data.length; i++) {
			var create_one_route = new query_positions(data[i], obj, map);
			create_one_route.getclick();

			get_buy_disc_sell(data[0].investorsCode);

			$('.transaction_content_center span').html(data[0].investorsName + '  ' + data[0].investorsCode);

		}
	}
	//

}

// tab持仓
var time_num = null;

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
	this.clear_li9.innerHTML = data.positionPrice;

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
query_positions.prototype.getclick = function() {
	var _this = this;
	this.ul.onclick = function() {
		get_buy_disc_sell(_this.map.investorsCode);

		$('.transaction_content_center span').html(_this.map.investorsName + '  ' + _this.map.investorsCode);

	}
	this.ul.ondblclick = function() {

		$('.transaction_tab_inner a').eq(1).click();

		$('#sell_out_ipt').val(_this.map.investorsName + '  ' + _this.map.investorsCode);

		ajax_func(_this.map.investorsCode, '2', $('#sell_rise'));

		$('#purchase_sell_number').val(_this.map.newOrderPrice);

		$('#time_sell_number').val(_this.map.possessNum);

		$('#purchase_sell_Form strong i').html(_this.map.buyerOrderNum);

		$purchase_price_sell = _this.map.investorsCode;

	}
}


// 委托
function get_entrust_func(page, Size, ele) {
	$.ajax({
		url: allurl1 + 'uusjs/queryAllStock.do',
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: page,
			pageSize: Size
		},
		success: function(data) {
			// console.log(data)

			$('#nav_entrust_contaniner').empty();

			if (ele == 1) {
				var get_entrust_container = document.getElementById('nav_entrust_contaniner');
				var create_route_container = new entrust_container(get_entrust_container, data.LIST, page, ele);

				entrust_func();
			} else if (ele == 2) {
				var get_parent_container = document.getElementById('entrust_contaniner');
				var create_nav_container = new entrust_container(get_parent_container, data.LIST, page, ele);
			}
		}

	})

}

//
function entrust_container(obj, data, page, ele) {
	if (data.length >= 1) {
		for (var i = 0; i < data.length; i++) {
			if (ele == 1) {
				var create_one_route = new nav_query_entrust(data[i], obj);
				create_one_route.getclick();
			} else if (ele == 2) {
				var create_two_route = new query_entrust(data[i], obj);
				create_two_route.getclick();
			} else if (ele == 3) {
				var create_three_route = new nav_withdrawsingle_func(data[i], obj);
				create_three_route.getclick();

			}
			// create_one_route.getclick();
		}
	}
}
// 2
function query_entrust(map, parent) {
	this.clear_li1 = document.createElement('li');
	this.clear_li1.innerHTML = map.entrustDate;

	this.clear_li2 = document.createElement('li');
	this.clear_li2.innerHTML = map.orderDate;

	this.clear_li3 = document.createElement('li');
	this.clear_li3.innerHTML = map.investorsCode;

	this.clear_li4 = document.createElement('li');
	this.clear_li4.innerHTML = map.investorsName;

	this.clear_li5 = document.createElement('li');

	this.clear_li6 = document.createElement('li');

	this.clear_li7 = document.createElement('li');
	this.clear_li7.innerHTML = map.orderNum;

	this.clear_li8 = document.createElement('li');
	this.clear_li8.innerHTML = map.orderPrice;

	this.clear_li9 = document.createElement('li');



	if (map.orderStatus == 0 || map.orderStatus == 4) {
		this.clear_li6.innerHTML = '已报';
	} else if (map.orderStatus == 1) {
		this.clear_li6.innerHTML = '废单';
	} else if (map.orderStatus == 2) {
		this.clear_li6.innerHTML = '已成';

	}


	this.ul = document.createElement('ul');
	if (map.type == '1') {
		this.ul.className = 'withdrawsing_ul entrust_ul_red';
		this.clear_li5.innerHTML = '买入';
	} else if (map.type == '2') {
		this.ul.className = 'withdrawsing_ul entrust_ul_blue';
		this.clear_li5.innerHTML = '卖出';
	}
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
query_entrust.prototype.getclick = function() {
	var _this = this;
	this.ul.onclick = function() {
		get_buy_disc_sell(_this.map.investorsCode);

		$('.transaction_content_center span').html(_this.map.investorsName + '  ' + _this.map.investorsCode);
	}
}



// 委托  1
function nav_query_entrust(map, parent) {
	this.clear_li1 = document.createElement('li');
	this.clear_li1.innerHTML = map.entrustDate;

	this.clear_li2 = document.createElement('li');
	this.clear_li2.innerHTML = map.orderDate;

	this.clear_li3 = document.createElement('li');
	this.clear_li3.innerHTML = map.investorsCode;

	this.clear_li4 = document.createElement('li');
	this.clear_li4.innerHTML = map.investorsName;

	this.clear_li5 = document.createElement('li');

	this.clear_li6 = document.createElement('li');

	this.clear_li7 = document.createElement('li');
	this.clear_li7.innerHTML = map.orderNum;

	this.clear_li8 = document.createElement('li');
	this.clear_li8.innerHTML = map.orderPrice;

	this.clear_li9 = document.createElement('li');

	if (map.orderStatus == 0 || map.orderStatus == 4) {
		this.clear_li6.innerHTML = '已报';
	} else if (map.orderStatus == 1) {
		this.clear_li6.innerHTML = '废单';
	} else if (map.orderStatus == 2) {
		this.clear_li6.innerHTML = '已成';

	}


	this.ul = document.createElement('ul');
	this.ul.className = 'entrust_ul';
	if (map.type == '1') {
		this.ul.className = 'entrust_ul_red entrust_ul';
		this.clear_li5.innerHTML = '买入';
	} else if (map.type == '2') {
		this.ul.className = 'entrust_ul_blue entrust_ul';
		this.clear_li5.innerHTML = '卖出';
	}

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

	this.orderid = map.orderId;
	this.type = map.type;
	this.map = map;

}
nav_query_entrust.prototype.getclick = function() {
	var _this = this;
	// this.ul.onclick = function() {
	// 	get_buy_disc_sell(_this.map.investorsCode);
	// }
}

// 委托点击事件
var nav_flag = 0;
var inner_flag = 0;

function entrust_func() {
	// 点击只显示撤单
	$('.entrust_nav label').on('mousedown', function() {
		if ($('.entrust_nav .entrust_nav_check').is(':checked') == true) {
			$('.entrust_nav .check_button').removeClass('active');

			get_entrust_func('1', '10', 1);
		} else {
			$('.entrust_nav .check_button').addClass('active');

			get_withdraw_order('1', '10')

		}
	});

	// 改变背景色
	$('.entrust_ul').each(function(index, el) {
		$('.entrust_ul').eq(index).on('mousedown', function() {
			if ($(this).find('.check').is(':checked') == false) {
				$(this).find('.check').prop({
					'checked': 'checked'
				}).siblings('b').addClass('active').parent().parent().siblings().find('.check').prop({
					'checked': ''
				}).siblings('b').removeClass('active');

			} else if ($(this).find('.check').is(':checked') == true) {
				$(this).find('.check').prop({
					'checked': ''
				}).siblings('b').removeClass('active');
			}
		})
	});



}
// 撤单
function get_withdraw_order(page, Size) {
	$.ajax({
		url: allurl1 + 'uusjs/queryEntrustedProduct.do',
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: page,
			pageSize: Size
		},
		success: function(data) {
			// console.log(data)

			layer.closeAll();

			$('.entrust_ul').remove();
			var get_entrust_container = document.getElementById('nav_entrust_contaniner');
			var create_route_container = new entrust_container(get_entrust_container, data.LIST, page, 3);

			entrust_func();
		}
	})
}

// 撤单面向对象
function nav_withdrawsingle_func(map, parent) {
	this.input = document.createElement('input');
	this.input.setAttribute('type', 'checkbox');
	this.input.className = 'check';

	this.b = document.createElement('b');
	this.b.className = 'check_button';

	this.span = document.createElement('span');
	this.span.innerHTML = map.entrustDate;

	this.clear_li1 = document.createElement('li');
	this.clear_li1.appendChild(this.input);
	this.clear_li1.appendChild(this.b);
	this.clear_li1.appendChild(this.span);

	this.clear_li2 = document.createElement('li');
	this.clear_li2.innerHTML = map.orderDate;

	this.clear_li3 = document.createElement('li');
	this.clear_li3.innerHTML = map.investorsCode;

	this.clear_li4 = document.createElement('li');
	this.clear_li4.innerHTML = map.investorsName;

	this.clear_li5 = document.createElement('li');

	this.clear_li6 = document.createElement('li');

	this.clear_li7 = document.createElement('li');
	this.clear_li7.innerHTML = map.orderNum;

	this.clear_li8 = document.createElement('li');
	this.clear_li8.innerHTML = map.orderPrice;

	this.clear_li9 = document.createElement('li');

	if (map.orderStatus == 0 || map.orderStatus == 4) {
		this.clear_li6.innerHTML = '已报';
	} else if (map.orderStatus == 1) {
		this.clear_li6.innerHTML = '废单';
	} else if (map.orderStatus == 2) {
		this.clear_li6.innerHTML = '已成';

	}


	this.ul = document.createElement('ul');
	this.ul.className = 'entrust_ul';
	if (map.type == '1') {
		this.ul.className = 'entrust_ul_red entrust_ul';
		this.clear_li5.innerHTML = '买入';
	} else if (map.type == '2') {
		this.ul.className = 'entrust_ul_blue entrust_ul';
		this.clear_li5.innerHTML = '卖出';
	}

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

	this.orderid = map.orderId;
	this.type = map.type;

}
nav_withdrawsingle_func.prototype.getclick = function() {
	var _this = this;
	this.ul.onclick = function() {
		$('.entrust_nav a').eq(0).on('click', function() {
			Prompt_model('您确定要撤销这一笔订单吗？', _this.type, _this.orderid);
		});
	}
}



// 撤单接口
function get_withdraw_order_click(type, orderId) {
	$.ajax({
		url: allurl1 + 'uusjs/updateRevocationStatus.do',
		type: 'POST',
		dataType: 'json',
		data: {
			type: type,
			orderId: orderId
		},
		success: function(data) {
			// console.log(data);
			$('.transaction_tab_inner a').eq(2).click();
		}
	})
}

//提示框样式
function Prompt_model(ele, type, orderId) {
	layer.confirm(ele, {
		title: '撤销委托',
		skin: 'Prompt_modal', //样式类名
		closeBtn: 0, //不显示关闭按钮
		shift: 2,
		area: ['300px', '180px'],
		shadeClose: true, //开启遮罩关闭
		btn: ['确定', '取消'] //按钮
	}, function() {
		time: 1,
		get_withdraw_order_click(type, orderId);
	}, function() {
		time: 1
	});
}


var mint_time = ['9:30', '9:31', '9:32', '9:33', '9:34', '9:35', '9:36', '9:37', '9:38', '9:39', '9:40', '9:41', '9:42', '9:43', '9:44', '9:45', '9:46', '9:47', '9:48', '9:49', '9:50', '9:51', '9:52', '9:53', '9:54', '9:55', '9:56', '9:57', '9:58', '9:59', '10:00', '10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09', '10:10', '10:11', '10:12', '10:13', '10:14', '10:15', '10:16', '10:17', '10:18', '10:19', '10:20', '10:21', '10:22', '10:23', '10:24', '10:25', '10:26', '10:27', '10:28', '10:29', '10:30', '10:31', '10:32', '10:33', '10:34', '10:35', '10:36', '10:37', '10:38', '10:39', '10:40', '10:41', '10:42', '10:43', '10:44', '10:45', '10:46', '10:47', '10:48', '10:49', '10:50', '10:51', "10:52", "10:53", "10:54", "10:55", "10:56", "10:57", "10:58", "10:59", '11:00', '11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07', '11:08', '11:09', '11:11', '11:11', '11:12', '11:13', '11:14', '11:15', '11:16', '11:17', '11:18', '11:19', '11:20', '11:21', '11:22', '11:23', '11:24', '11:25', '11:26', '11:27', '11:28', '11:29', '11:30/13:00', '13:01', '13:02', '13:03', '13:04', '13:05', '13:06', '13:07', '13:08', '13:09', '13:10', '13:11', '13:12', '13:13', '13:14', '13:15', '13:16', '13:17', '13:18', '13:19', '13:20', '13:21', '13:22', '13:23', '13:24', '13:25', '13:26', '13:27', '13:28', '13:29', '13:30', '13:31', '13:32', '13:33', '13:34', '13:35', '13:36', '13:37', '13:38', '13:39', '13:40', '13:41', '13:42', '13:43', '13:44', '13:45', '13:46', '13:47', '13:48', '13:49', '13:50', '13:51', "13:52", "13:53", "13:54", "13:55", "13:56", "13:57", "13:58", "13:59", '14:00', '14:01', '14:02', '14:03', '14:04', '14:05', '14:06', '14:07', '14:08', '14:09', '14:14', '14:11', '14:12', '14:14', '14:14', '14:15', '14:16', '14:17', '14:18', '14:19', '14:20', '14:21', '14:22', '14:23', '14:24', '14:25', '14:26', '14:27', '14:28', '14:29', '14:30', '14:31', '14:32', '14:33', '14:34', '14:35', '14:36', '14:37', '14:38', '14:39', '14:40', '14:41', '14:42', '14:43', '14:44', '14:45', '14:46', '14:47', '14:48', '14:49', '14:50', '14:51', "14:52", "14:53", "14:54", "14:55", "14:56", "14:57", "14:58", "14:59", '15:00/18:00', '18:01', '18:02', '18:03', '18:04', '18:05', '18:06', '18:07', '18:08', '18:09', '18:18', '18:11', '18:12', '18:18', '18:18', '18:15', '18:16', '18:17', '18:18', '18:19', '18:20', '18:21', '18:22', '18:23', '18:24', '18:25', '18:26', '18:27', '18:28', '18:29', '18:30', '18:31', '18:32', '18:33', '18:34', '18:35', '18:36', '18:37', '18:38', '18:39', '18:40', '18:41', '18:42', '18:43', '18:44', '18:45', '18:46', '18:47', '18:48', '18:49', '18:50', '18:51', "18:52", "18:53", "18:54", "18:55", "18:56", "18:57", "18:58", "18:59", '19:00', '19:01', '19:02', '19:03', '19:04', '19:05', '19:06', '19:07', '19:08', '19:09', '19:19', '19:11', '19:12', '19:19', '19:19', '19:15', '19:16', '19:17', '19:19', '19:19', '19:20', '19:21', '19:22', '19:23', '19:24', '19:25', '19:26', '19:27', '19:28', '19:29', '19:30', '19:31', '19:32', '19:33', '19:34', '19:35', '19:36', '19:37', '19:38', '19:39', '19:40', '19:41', '19:42', '19:43', '19:44', '19:45', '19:46', '19:47', '19:48', '19:49', '19:50', '19:51', "19:52", "19:53", "19:54", "19:55", "19:56", "19:57", "19:58", "19:59", '20:00', '20:01', '20:02', '20:03', '20:04', '20:05', '20:06', '20:07', '20:08', '20:09', '20:20', '20:11', '20:12', '20:20', '20:20', '20:15', '20:16', '20:17', '20:20', '20:20', '20:20', '20:21', '20:22', '20:23', '20:24', '20:25', '20:26', '20:27', '20:28', '20:29', '20:30', '20:31', '20:32', '20:33', '20:34', '20:35', '20:36', '20:37', '20:38', '20:39', '20:40', '20:41', '20:42', '20:43', '20:44', '20:45', '20:46', '20:47', '20:48', '20:49', '20:50', '20:51', "20:52", "20:53", "20:54", "20:55", "20:56", "20:57", "20:58", "20:59", '21:00'];
// 分时图
function init_chart(close_Price, uplowFlag) {

	// console.log(mint_color);

	// console.log(tArray);
	var dates = tArray.map(function(item) {
		return item[0];
	});


	var data = tArray.map(function(item) {
		return item[1];
	});

	var adata = aArray.map(function(item) {
		return item[1];
	});

	var _amount = amount.map(function(item) {
		return item[0];
	});

	var _amount_color = amount.map(function(item) {
		return item[1];
	});

	// console.log(amount);
	// console.log(_amount);
	// console.log(uplowFlag)
	// console.log(close_Price);

	//var _maxlength = Math.max.apply(null, data);
	var close_Price_value = parseFloat(close_Price);
	var _maxlength = close_Price_value * 1.1;
	//var _minlength = "" + (close_Price_value - close_Price_value * 0.1);
	var _minlength = close_Price_value * 0.9;


	var a_max = uplowFlag;
	if (uplowFlag == 10) {} else {
		_maxlength = close_Price_value * 2;
		_minlength = 0;
		// var a_max = ((parseFloat(_maxlength) - parseFloat(close_Price)) / parseFloat(close_Price)).toFixed(4) * 100;

	}



	option = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			x: 50,
			y: 15,
			x2: 60,
			y2: 5
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			boundaryGap: true,
			data: mint_time,
			axisLabel: {
				show: true,
				interval: 104,
				textStyle: {
					color: '#fff',
					baseline: 'middle'
				}
			},
			axisTick: {
				show: false,
				inside: true,
				alignWithLabel: true,
				lineStyle: {
					color: '#fff'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#ff9500'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			}
		}],
		yAxis: [{
			type: 'value',
			splitNumber: 4,
			max: _maxlength,
			min: _minlength,
			axisLabel: {
				formatter: function(value, Template) {
					return value.toFixed(2);
				},
				textStyle: {
					color: function(value) {
						var color = "white";
						if (value > close_Price_value) {
							color = "#FF2D41";
						} else if (value == close_Price_value) {
							color = "white";
						} else {
							color = "#04C192";
						}
						return color;
					}

				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			}

		}, {
			type: 'value',
			splitNumber: 4,
			max: a_max,
			min: -(a_max),
			axisLabel: {
				formatter: function(value) {
					// console.log(value)
					return value.toFixed(2) + '%';
				},
				textStyle: {
					color: function(value) {
						var color = "#000";
						if (value > 0) {
							color = "#FF2D41";
						} else if (value == 0) {
							color = "#000";
						} else {
							color = "#04C192";
						}
						return color;
					}
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			}
		}],
		series: [{
			name: '价格',
			type: 'line',
			smooth: true,
			data: data,
			lineStyle: {
				normal: {
					color: '#04C192'
				},
			},
			itemStyle: {
				normal: {
					color: '#04C192'
				}
			},
			symbol: 'none'
		}, {
			name: '涨跌幅',
			//scatter
			type: 'scatter',
			data: adata,
			yAxisIndex: 1,
			lineStyle: {
				normal: {
					color: '#04C192'
				}
			},
			itemStyle: {
				normal: {
					color: '#04C192'
				}
			},
			symbol: 'none'
		}]
	};

	// 为echarts对象加载数据
	var myChart = echarts.init(document.getElementById('main_chart'));
	myChart.setOption(option);


	option2 = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			x: 50,
			y: 5,
			x2: 60,
			y2: 30
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: mint_time,
			axisLabel: {
				show: true,
				interval: 104,
				margin: 15,
				textStyle: {
					color: '#000',
					baseline: 'middle'
				}
			},
			axisTick: {
				show: true,
				inside: false,
				alignWithLabel: true,
				lineStyle: {
					color: '#000'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			}
		}],
		yAxis: [{
			type: 'value',
			splitNumber: 2,
			axisLabel: {
				formatter: function(value) {
					//console.log(value)
					return parseInt(value);
				},
				textStyle: {
					color: '#000'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},

		}, {
			type: 'value',
			splitNumber: 2,
			axisLabel: {
				formatter: function(value) {
					// console.log(value.)
					return parseInt(value);
				},
				textStyle: {
					color: '#000'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#22262e'
				}
			},
		}],
		series: [{
			name: '成交量',
			type: 'bar',
			data: _amount,
			lineStyle: {
				normal: {
					color: '#04C192'
				},
			},
			itemStyle: {
				normal: {
					color: function(params) {
						var colorList = [
							'#fff', '#FF2D41', '#04C192',
						];
						// console.log(_amount_color[params.dataIndex])

						if (_amount_color[params.dataIndex] == 1) {
							return colorList[0]
						} else if (_amount_color[params.dataIndex] == 2) {
							return colorList[1]
						} else {
							return colorList[2]
						}

					},
				}
			},
		}]
	};

	// 为echarts对象加载数据
	var myChart2 = echarts.init(document.getElementById('main_chart2'));
	myChart2.setOption(option2);

	myChart.connect([myChart2]);
	myChart2.connect([myChart]);

	// 异步加载数据
	// load_data(myChart, data);



}

var hour = 8;




//
function get_nav_func(max, min) {

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

	// 买入时间
	$('#time_remove').on('click', function() {
		var nav_time_num = Number($('#time_number').val());
		purchase_time_func(1, nav_time_num, $('#time_number'));
	})

	$('#time_add').on('click', function() {
		var nav_time_add = Number($('#time_number').val());
		// console.log(nav_time_add);
		purchase_time_func(2, nav_time_add, $('#time_number'));
	})

	// 卖出价格
	$('#purchase_sell_remove').on('click', function() {


		var price_nav_remove = Number($('#purchase_sell_number').val());
		console.log(price_nav_remove)
		get_price_func(1, price_nav_remove, $('#purchase_sell_number'), max, min);
	})

	$('#purchase_sell_add').on('click', function() {
		var price_nav_add = Number($('#purchase_sell_number').val());
		console.log(price_nav_add)
		get_price_func(2, price_nav_add, $('#purchase_sell_number'), max, min);
	})

	// 卖出时间
	$('#time_sell_remove').on('click', function() {
		var purchase_sell_remove = Number($('#time_sell_number').val());
		purchase_time_func(1, purchase_sell_remove, $('#time_sell_number'));
	})
	$('#time_sell_add').on('click', function() {
		var purchase_sell_add = Number($('#time_sell_number').val());
		purchase_time_func(2, purchase_sell_add, $('#time_sell_number'));
	})
}

//买入卖出时间
function purchase_time_func(page, num, obj) {
	if (page == 1) {
		if (num > 0) {
			num--;
			obj.val(num);
		} else {}
	} else if (page == 2) {
		if (num >= 0) {
			num++;
			obj.val(num);
			// console.log(num);
		} else {}
	}
}

//买入卖出价格
function get_price_func(page, num, obj, max, min) {
	if (page == 1) {
		if (num > min) {
			num -= 0.01;
			obj.val(num.toFixed(2));

			purchasePrice(num)

		} else {
			layer.alert('不能小于当天的跌停价');
		}
	} else if (page == 2) {
		if (num < max) {
			num += 0.01;
			obj.val(num.toFixed(2));

			purchasePrice(num)
		} else {
			layer.alert('不能大于当天的跌停价');
		}
	}
}