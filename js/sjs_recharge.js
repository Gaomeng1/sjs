jQuery(document).ready(function ($) {
	get_cookie();

	//
	recharge_click();

	assets_func()

});


function get_cookie() {
	var flag = getCookie('sjs_stats_flag');

	if (flag != '') {
		if (flag == '2') {
			window.location = 'sjs_set_password_one.html?typeFlag=0&htmlFlag=3';
		}
	} else {
		window.location = 'sjs_load.html';
	}
}

/*资产获取*/
function assets_func() {
	$.ajax({
		url: allurl1 + 'uusjs/queryTotalWorth.do',
		type: 'POST',
		contentType: "application/x-www-form-urlencoded",
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if (data.STATUS == '0') {
				$('.recharge_top i').html(data.OBJECT.userPurse).css('color','#FF2D41');
			} else if (data.STATUS == 3) {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}

		}
	})

}




var recharge_money = null;

function recharge_click() {
	$('#u_recharge').off('click');
	$('#rechargeMoney').off('keydown');


	//	输入充值金额 取消选择充值
	$('#rechargeMoney').on('keydown', function () {
		$('.u_choose_money a').removeClass('active');
	})


	//选择充值 取消输入金额
	$('.u_choose_money a').each(function (index, el) {
		$(this).on('click', function () {
			$(this).toggleClass('active').siblings().removeClass('active');
			$('#rechargeMoney').val($('.u_choose_money a.active').html().split('元')[0]);
		})
	});


	// 改变支付方式
	$('.payment_label').each(function (index, el) {
		$('.payment_label').eq(index).on('mousedown', function () {
			if ($(this).find('.check').is(':checked') == false) {
				$(this).find('.check').prop({
					'checked': 'checked'
				}).siblings('i').addClass('active').parent().siblings().find('.check').prop({
					'checked': ''
				}).siblings('i').removeClass('active');

			} else if ($(this).find('.check').is(':checked') == true) {
				$(this).find('.check').prop({
					'checked': ''
				}).siblings('i').removeClass('active');
			}
		})
	});

	//点击下一步
	$('#u_recharge').on('click', function () {
		if ($('#rechargeMoney').val() != '' || $('.u_choose_money a').hasClass('active')) {
			if ($('#rechargeMoney').val() != '') {
				if (Number($('#rechargeMoney').val()) < 0.01) {
					alert_model('充值金额不能小于0.01');
				} else {
					zfb_recharge($('#rechargeMoney').val());
				}
			} else {
				var recharge_money = $('.u_choose_money a.active').html().split('元')[0];
				zfb_recharge(recharge_money);
			}
		} else {
			alert_model('请选择或输入支付金额！')
		}

	})

}


// 充值
// 获取微信充值二维码
var code_orderid = null;
function get_recharge_wx(rechargeMoney) {
	$.ajax({
		url: allurl1 + 'uusjs/qrcodeWxCharge.do',
		type: 'POST',
		dataType: 'json',
		data: {
			rechargeMoney: rechargeMoney
		},
		success: function (data) {
			console.log(data);
			if (data.STATUS == '0') {
				var code_img = data.OBJECT.fileName;
				code_orderid = data.OBJECT.orderId;

				// // 检查充值状态
				// check_order_func();
			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
			}


		}
	})
}


var time = null;
var time2 = null;

function check_order_func() {
	time = setInterval(sweep_code, 3000);


	time2 = setTimeout(function () {
		clearInterval(time);

		alert_model('验证码已过期');
	}, 30000);
}


// 扫码支付成功
function sweep_code() {
	$.ajax({
		url: allurl1 + 'uusjs/queryRechargeStatus.do',
		type: 'POST',
		dataType: 'json',
		data: {
			orderId: code_orderid
		},
		success: function (data) {
			if (data.STATUS == '0') {
				var status = data.OBJECT.rechargeStatus;

				if (status == '2') {
					$('.rechargeSuccess').show().siblings().hide();

					clearInterval(time);

					clearTimeout(time2);

				}
			} else {
				alert_model(data.MSG);
			}

		}
	})

}


//调取支付宝支付
function zfb_recharge(rechargeMoney) {
	$.ajax({
		url: allurl1 + 'uusjs/security/AliRecharge.do',
		type: 'POST',
		dataType: 'json',
		data: {
			rechargeMoney: rechargeMoney
		},
		success: function (data) {
			if (data.STATUS == '0') {
				$('#code').html(data.OBJECT.payInfo);
			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
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
		shadeClose: true, //开启遮罩关闭
		content: ele + '<p><button type="button" class="active">确定</button></p>',
		btn: []
	});

	$('.alert_modal button').on('click', function () {
		setTimeout(function () {
			layer.closeAll();
		}, 1);
	})
}