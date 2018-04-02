var LocString = String(window.document.location.href);

function GetQueryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) return tmp[2];
	return "";
}
var _flag = decodeURI(GetQueryString('htmlFlag'));
var _clickFlag = decodeURI(GetQueryString('clickFlag'));


var scroll_flag = 1;
jQuery(document).ready(function($) {
	/*资产获取*/
	assets_func();

	// 页面点击函数
	click_func();

	// 交易记录
	order_transaction('1', '20');

	$("#table_parent").niceScroll({
		cursorcolor: "#ccc",
		cursoropacitymax: 1,
		touchbehavior: false,
		cursorwidth: "3px",
		cursorborder: "0",
		cursorborderradius: "5px"
	});



	$('#table_parent').on('scroll', function() {
		var $this = $(this),
			viewH = $(this).height(), //可见高度
			contentH = $(this).get(0).scrollHeight, //内容高度
			scrollTop = $(this).scrollTop(); //滚动高度
		//if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
		if (scrollTop / (contentH - viewH) >= 0.5) { //到达底部100px时,加载新内容
			// console.log(scroll_flag);
			scroll_flag++;
			order_transaction(scroll_flag + '', '20');
		}  
	})

	if (_clickFlag != undefined && _clickFlag != '' && _clickFlag != null) {
		$('#rechargeBtn').click();
	} else {

	}

});


// 点击事件
function click_func() {
	// $('#rechargeBtn').on('click', function() {
	// 	// 获取用户是否设置支付密码
	// 	get_cookie();
	// })

	$('#recharge_wx').on('click', function() {
		if ($('#recharge_money').val() == '') {
			$('.recharge i').html('充值金额不能为空');
		} else if (Number($('#recharge_money').val()) < 0.01) {
			$('.recharge i').html('充值金额不能小于0.01');
		} else {
			$('.recharge i').html(' ');

			$('.recharge_payment_inner .recharge_top i').html($('#recharge_money').val());

			get_recharge_wx($('#recharge_money').val())
		}


	})
}

// 获取cookie
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
				if (data.OBJECT.userName == '') {
					$('#username').val('请设置用户名').prop({
						'size': '12'
					});

					$('#char').html('12');

				} else {
					console.log(data.OBJECT.userName.length + 4);
					$('#username').val(data.OBJECT.userName).prop({
						'size': data.OBJECT.userName.length + 4
					});


					$('#char').html(data.OBJECT.userName.length + 4);
				}

				var Avatar_img = document.getElementById('useravatar');

				addImg(allurl2 + data.OBJECT.userAvatar, Avatar_img)

				$('#asset_people').html('投资人数：' + data.OBJECT.investmentNumber + '人');

				$('#time_position').html('资产总额：' + data.OBJECT.positionPrice + '元');

				var _depositors = document.createElement('span');
				_depositors.innerHTML = '总提现：' + data.OBJECT.totalWithdrawMoney + '元';

				var _recharge = document.createElement('span');
				_recharge.innerHTML = '总充值：' + data.OBJECT.totalRechargeMoney + '元';

				var _shares = document.createElement('span');
				_shares.innerHTML = '总盈亏：' + data.OBJECT.totalWorth + '元';

				// console.log($('.my_money_top dd'))

				$('.my_money_top dd').append(_depositors);
				$('.my_money_top dd').append(_recharge);
				$('.my_money_top dd').append(_shares);

				$('.recharge_top i').html(data.OBJECT.userPurse);

				$('#mine_money').html(data.OBJECT.userPurse + '元');

			} else if (data.STATUS == 3) {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}

		}
	})

}


//修改用户名称
$('#username').on('change', function() {
	$.ajax({
		url: allurl1 + 'uusjs/userModifyMessage.do',
		type: 'POST',
		dataType: 'json',
		data: {
			type: '0',
			content: $(this).val()
		},
		success: function(data) {
			// console.log(data);
		}
	})


})

$('#username').siblings('img').on('click', function() {
	$('#username').focus();
})



function checkLength(which) {
	var oTextCount = document.getElementById("char");
	iCount = which.value.replace(/[^\u0000-\u00ff]/g, "aa");
	oTextCount.innerHTML = "<font color=#FF0000>" + iCount.length + "</font>";
	which.size = iCount.length ;
}



// 订单交易
function order_transaction(page, size) {
	$.ajax({
		url: allurl1 + 'uusjs/orderRecord.do',
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: page,
			pageSize: size

		},
		success: function(data) {
			// console.log(data);
			if (data.STATUS == '0') {
				if (data.LIST.length > 0) {
					var parent = document.getElementById('transaction_record');
					var create_one_route = new transaction_func(parent, data.LIST);
				} else {
					$('#table_parent').off('scroll');
				}

			}
		}
	})


}


// 
function transaction_func(obj, data) {

	this.tbody = document.createElement('tbody');

	obj.appendChild(this.tbody);


	if (data.length >= 1) {
		for (var i = 0; i < data.length; i++) {
			var create_one_route = new transition_positions(data[i], this.tbody);
			// create_one_route.getclick();
		}
	}
	//

}

// 
function transition_positions(map, parent) {
	this.transition_td1 = document.createElement('td');
	this.transition_td1.innerHTML = map.recordTradeDate;

	this.transition_td2 = document.createElement('td');

	this.transition_td3 = document.createElement('td');

	this.transition_td4 = document.createElement('td');

	// 判断是否是买入卖出
	if (map.recordType == "买入" || map.recordType == "卖出") {
		// 名称
		this.transition_td2.innerHTML = map.title;

		// 是否买入 手续费
		if (map.recordType == "买入") {
			if (Number(map.feeRate) > 0) {
				this.transition_td3.innerHTML = '-' + map.recordTradeMoney + '(手续费:' + map.feeRate + ')';
			} else {
				this.transition_td3.innerHTML = '-' + map.recordTradeMoney;
			}

			if (map.recordStatus == '2') {
				this.transition_td4.innerHTML = '买入成功';
			}
		} else if (map.recordType == "卖出") {
			if (Number(map.feeRate) > 0) {
				this.transition_td3.innerHTML = '+' + map.recordTradeMoney + '(手续费:' + map.feeRate + ')';
			} else {
				this.transition_td3.innerHTML = '+' + map.recordTradeMoney;
			}

			if (map.recordStatus == '2') {
				this.transition_td4.innerHTML = '卖出成功';
			}
		}

		// 判断状态
		if (map.recordStatus == '0' || map.recordStatus == '4') {
			this.transition_td4.innerHTML = '委托中';
		} else if (map.recordStatus == '1') {
			this.transition_td4.innerHTML = '撤销成功';
			this.transition_td3.innerHTML = map.recordTradeMoney;
		}

	} else {
		// 不是就判断充值和提现
		this.transition_td3.innerHTML = '+' + map.recordTradeMoney;

		// 判断充值状态
		if (map.recordStatus == '1') {
			this.transition_td4.innerHTML = '充值中';
		} else if (map.recordStatus == '2') {
			this.transition_td4.innerHTML = '充值成功';
		} else if (map.recordStatus == '3') {
			this.transition_td4.innerHTML = '充值失败';
			this.transition_td3.innerHTML = map.recordTradeMoney;
		} else if (map.recordStatus == '4') {
			this.transition_td4.innerHTML = '充值取消';
			this.transition_td3.innerHTML = map.recordTradeMoney;
		}

		// 判断微信扫码充值
		if (map.recordType == "wxqrcode_recharge") {
			this.transition_td2.innerHTML = '微信扫码充值';
		} else if (map.recordType == "ali_recharge") {
			this.transition_td2.innerHTML = '支付宝充值';
		} else if (map.recordType == "wx_recharge") {
			this.transition_td2.innerHTML = '微信充值';
		} else if (map.recordType == 'wxpublic_recharge') {
			this.transition_td2.innerHTML = '微信公众号充值';
		} else {
			this.transition_td2.innerHTML = map.title;
		}


		// 是否是提现
		if (map.recordType == "widthdraw") {
			this.transition_td2.innerHTML = '提现';

			// 提现手续费
			if (Number(map.feeRate) > 0) {
				this.transition_td3.innerHTML = '-' + map.recordTradeMoney + '(手续费:' + map.feeRate + ')';
			} else {
				this.transition_td3.innerHTML = '-' + map.recordTradeMoney;
			}

			if (map.recordStatus == '1') {
				this.transition_td4.innerHTML = '提现中';
			} else if (map.recordStatus == '2') {
				this.transition_td4.innerHTML = '提现取消';
			} else if (map.recordStatus == '3') {
				this.transition_td4.innerHTML = '提现成功';
				this.transition_td3.innerHTML = map.recordTradeMoney;
			} else if (map.recordStatus == '4') {
				this.transition_td4.innerHTML = '提现成功';
				this.transition_td3.innerHTML = map.recordTradeMoney;
			}

		}

	}

	this.transition_td5_span = document.createElement('span');
	this.transition_td5_span.className = 'caret';

	this.transition_td5_a = document.createElement('a');
	this.transition_td5_a.innerHTML = '详情';
	this.transition_td5_a.setAttribute('data-toggle', 'dropdown');
	this.transition_td5_a.setAttribute('href', 'javascript:;');

	this.transition_td5_a.appendChild(this.transition_td5_span);

	this.transition_td5 = document.createElement('td');
	this.transition_td5.appendChild(this.transition_td5_a);


	this.transition_tr = document.createElement('tr');
	this.transition_tr.appendChild(this.transition_td1);
	this.transition_tr.appendChild(this.transition_td2);
	this.transition_tr.appendChild(this.transition_td3);
	this.transition_tr.appendChild(this.transition_td4);
	// this.transition_tr.appendChild(this.transition_td5);


	parent.appendChild(this.transition_tr);
}



// 设置图片
function addImg(isrc, object) {
	var Img = new Image();
	Img.src = isrc;
	Img.onload = function() {
		object.src = isrc;
	}
	Img.onerror = function() {
		object.src = '../img/default/default_avatar.png';
	}
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
		success: function(data) {
			if (data.STATUS == '0') {
				var code_img = data.OBJECT.fileName;
				code_orderid = data.OBJECT.orderId;

				$('.recharge_payment_inner').show().siblings().hide();

				$('.recharge_payment img').prop({
					'src': allurl2 + code_img,
				})

				// 检查充值状态
				check_order_func();
			} else {
				layer.alert(data.MSG);
			}



		}
	})
}

var time = null;
var time2 = null;

function check_order_func() {
	time = setInterval(sweep_code, 3000);


	time2 = setTimeout(function() {
		clearInterval(time);

		layer.alert('验证码已过期');
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
		success: function(data) {
			if (data.STATUS == '0') {
				var status = data.OBJECT.rechargeStatus;

				if (status == '2') {
					$('.rechargeSuccess').show().siblings().hide();

					clearInterval(time);

					clearTimeout(time2);

				}
			} else {
				layer.alert(data.MSG);
			}

		}
	})

}