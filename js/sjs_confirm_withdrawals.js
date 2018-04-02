/**
 * Created by uuzhang on 2016/12/16.
 */
var LocString = String(window.document.location.href);

function GetQueryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) return tmp[2];
	return "";
}
var _bankCardType = decodeURI(GetQueryString('bankCardType'));
var _bankCard = decodeURI(GetQueryString('card'));
var _bankname = decodeURI(GetQueryString('name'));
var _money = decodeURI(GetQueryString('money'));
var _bankId = decodeURI(GetQueryString('bankid'));


jQuery(document).ready(function () {
	get_cookie();

	_withdrawals_click();

});


// 获取cookie  判断是否登录
function get_cookie() {
	var flag = getCookie('sjs_stats_flag');

	if(flag!=''&flag!=null){

	}else{
		window.location='sjs_load.html';
	}
}



(function () {

	var _withdrawals_name = document.getElementById('withdrawals_name');
	var _withdrawals_money = document.getElementById('withdrawals_money');
	var _withdrawals_img = document.getElementById('withdrawals_bank_code_img');
	var _withdrawals_bank_name = document.getElementById('withdrawals_bank_name');
	var _withdrawals_bank_card = document.getElementById('withdrawals_bank_card');

	_withdrawals_name.innerHTML = _bankname;
	_withdrawals_money.innerHTML = Number(_money).toFixed(2) + '元';
	_withdrawals_bank_card.innerHTML = '(' + _bankCard + ')';

	$('.withdrawals_money i').html('(+' + (Number(_money) * 0.01).toFixed(2) + '元手续费)')


	switch (_bankCardType) {
		case '1':
			_withdrawals_bank_name.innerHTML = "中国银行";
			_withdrawals_img.setAttribute('src', '../img/atm/zg.png');
			break;
		case '2':
			_withdrawals_bank_name.innerHTML = "中国农业银行";
			_withdrawals_img.setAttribute('src', '../img/atm/ny.png');
			break;
		case '3':
			_withdrawals_bank_name.innerHTML = "中国工商银行";
			_withdrawals_img.setAttribute('src', '../img/atm/gs.png');
			break;
		case '4':
			_withdrawals_bank_name.innerHTML = "中国建设银行";
			_withdrawals_img.setAttribute('src', '../img/atm/js.png');
			break;
		case '5':
			_withdrawals_bank_name.innerHTML = "中国交通银行";
			_withdrawals_img.setAttribute('src', '../img/atm/jt.png');
			break;
		case '6':
			_withdrawals_bank_name.innerHTML = "中国招商银行";
			_withdrawals_img.setAttribute('src', '../img/atm/zs.png');
			break;
		case '7':
			_withdrawals_bank_name.innerHTML = "中国光大银行";
			_withdrawals_img.setAttribute('src', '../img/atm/gd.png');
			break;
		case '8':
			_withdrawals_bank_name.innerHTML = "支付宝";
			_withdrawals_img.setAttribute('src', '../img/atm/zfb.png');
			break;
		default:
			break;
	}
})();


function _withdrawals_click() {
	$('#withdrawals_btn').off('click');

	$('.u_width input').val('');

	$('.u_width input').on('keyup',function () {
		if($(this).val().length==6){
			$(this).blur();
		}else{

		}
	}).focus(function () {
		$(this).val('');
	})

	$('#withdrawals_btn').on('click',function () {
		if($('.u_width input').val()==''){
			layer.alert('请输入支付密码');
		}else{

			var _u_password=hex_md5($('.u_width input').val());
			console.log(_u_password)
			$.ajax({
				url: allurl1 + 'uusjs/security/userPayPassword.do',
				type: 'POST',
				dataType: 'json',
				data: {
					type: '4',
					oldPayPassword: _u_password
				},
				success: function(data) {
					console.log(data);
					if (data.MSG == "SUCCESS") {
						$.ajax({
							url: allurl1 + 'uusjs/security/userWithdraw.do',
							type: 'POST',
							dataType: 'json',
							data:{
								withdrawMoney:_money,
								withDrawBankId:_bankId,
								userPayPassword:_u_password,
							},
							success: function (data) {
								console.log(data);
								if (data.STATUS == '0') {
									window.location='sjs_set_password_two.html?htmlFlag=4';
								}else{
									layer.alert(data.MSG);
								}

							}
						})
					} else if (data.STATUS == 3) {
						window.location = 'sjs_load.html';
					} else {
						layer.alert(data.MSG)
					}
				}
			})
		}
	})
}
