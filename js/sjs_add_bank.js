/**
 * Created by uuzhang on 2016/12/15.
 */
var LocString = String(window.document.location.href);

function GetQueryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) return tmp[2];
	return "";
}
var _bankCardType = decodeURI(GetQueryString('bankCardType'));
var _flag = decodeURI(GetQueryString('flag'));
var _bankCard = decodeURI(GetQueryString('card'));
var _bankname = decodeURI(GetQueryString('name'));
var _bankId = decodeURI(GetQueryString('bankid'));


jQuery(document).ready(function() {

	//添加银行卡
	add_bank_Verification();


	if (_flag == '2'&&_bankCardType != '8') {
		$('#bankcard').val(_bankCard);

		$('#bankOwner').val(_bankname);
	} else if(_flag == '2'&&_bankCardType == '8'){
		$('#aipaycard').val(_bankCard);

		$('#aipayOwner').val(_bankname);
	}


	if (_bankCardType == '8') {
		$('.sjs_aipay_content').show().siblings('.sjs_add_bank').hide();
	} else {
		$('.sjs_add_bank').show().siblings('.sjs_aipay_content').hide();
	}


});


(function() {
	//添加银行卡
	var _add_Bank_name = document.getElementById('add_Bank_code_name');
	var _add_Bank_img = document.getElementById('add_Bank_code_img');

	//添加支付宝
	var _add_aipay_img = document.getElementById('add_aipay_img')
	var _add_aipay_name = document.getElementById('add_aipay_name');

	var _bankcard = document.getElementById('bankcard');

	_bankcard.onkeydown = function(event) {
		console.log(event.keyCode);

		// _bankcard.value=_bankcard.value.replace(/\d+/g,'').replace(/....(?!$)/g,'$& ');

		if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
			if (_bankcard.value.length == 4) {
				_bankcard.value = _bankcard.value + " ";
			} else if (_bankcard.value.length == 9) {
				_bankcard.value = _bankcard.value + " ";
			} else if (_bankcard.value.length == 14) {
				_bankcard.value = _bankcard.value + " ";
			} else if (_bankcard.value.length == 19) {
				_bankcard.value = _bankcard.value + " ";
			}
		}
	}

	_bankcard.onkeyup=function(event){
		if(!(/^[0-9 ]+$/.test(_bankcard.value))||event.keyCode==32){
			_bankcard.value=_bankcard.value.replace(/\D/g,'').replace(/....(?!$)/g,'$& ');
		}
	}

	switch (_bankCardType) {
		case '1':
			_add_Bank_name.innerHTML = "中国银行";
			_add_Bank_img.setAttribute('src', '../img/atm/zg.png');
			break;
		case '2':
			_add_Bank_name.innerHTML = "中国农业银行";
			_add_Bank_img.setAttribute('src', '../img/atm/ny.png');
			break;
		case '3':
			_add_Bank_name.innerHTML = "中国工商银行";
			_add_Bank_img.setAttribute('src', '../img/atm/gs.png');
			break;
		case '4':
			_add_Bank_name.innerHTML = "中国建设银行";
			_add_Bank_img.setAttribute('src', '../img/atm/js.png');
			break;
		case '5':
			_add_Bank_name.innerHTML = "中国交通银行";
			_add_Bank_img.setAttribute('src', '../img/atm/jt.png');
			break;
		case '6':
			_add_Bank_name.innerHTML = "中国招商银行";
			_add_Bank_img.setAttribute('src', '../img/atm/zs.png');
			break;
		case '7':
			_add_Bank_name.innerHTML = "中国光大银行";
			_add_Bank_img.setAttribute('src', '../img/atm/gd.png');
			break;
		case '8':
			_add_aipay_name.innerHTML = "支付宝";
			_add_aipay_img.setAttribute('src', '../img/atm/zfb.png');
			break;
		default:
			break;
	}
})();


//验证
function add_bank_Verification() {

	//银行卡验证
	$("#atmForm").validate({
		debug: true,
		onSubmit: false,
		rules: {
			bankCard: {
				required: true,
				minlength: 23,
				maxlength: 23

			},
			bankOwner: {
				required: true,
			},

		},
		messages: {
			bankCard: {
				required: "请输入开户卡号", //输入为空时的提示信息
				minlength: '账户输入有误',
				maxlength: '账户输入有误'
			},
			bankOwner: {
				required: "请输入开户姓名",
			},

		},

		submitHandler: function(form) {
			// console.log(form.bankCard.value)
			layer.confirm('提交前请仔细核对 以免造成不必要的损失', {
				title: '确认',
				skin: 'Prompt_modal', //样式类名
				closeBtn: 0, //不显示关闭按钮
				shift: 2,
				area: 'auto',
				shadeClose: true, //开启遮罩关闭
				btn: ['确定', '取消'] //按钮
			}, function() {
				if (_flag == 1) {
					$.ajax({
						url: allurl1 + 'uusjs/security/userBoundBankCard.do',
						type: 'POST',
						contentType: "application/x-www-form-urlencoded",
						dataType: 'json',
						data: {
							bankCard: form.bankCard.value,
							bankCardType: _bankCardType,
							bankOwner: form.bankOwner.value,
							bankIsDefault: '1',
						},
						success: function(data) {
							if (data.STATUS == '0') {
								window.location = 'sjs_atm.html';
							} else {
								layer.alert(data.MSG);
							}

						}
					})
				} else if (_flag == 2) {
					$.ajax({
						url: allurl1 + 'uusjs/security/updateBankCard.do',
						type: 'POST',
						dataType: 'json',
						data: {
							bankId: _bankId,
							bankCard: form.bankCard.value,
							bankOwner: form.bankOwner.value,
						},
						success: function(data) {
							// console.log(data);
							if (data.STATUS == '0') {
								window.location = 'sjs_atm.html';
							} else {
								layer.alert(data.MSG);
							}

						}
					})
				}

				layer.closeAll();

			}, function() {
				time: 1
			});

		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});


	//支付宝验证
	$("#aipayForm").validate({
		debug: true,
		onSubmit: false,
		rules: {
			aipayCard: {
				required: true,
				checkEmail: true,
			},
			aipayOwner: {
				required: true,
			},

		},
		messages: {
			aipayCard: {
				required: "请输入支付宝账号",
				checkEmail: '输入正确邮箱或者手机号',
			},
			aipayOwner: {
				required: "请输入支付宝姓名",
			},
		},

		submitHandler: function(form) {
			layer.confirm('提交前请仔细核对 以免造成不必要的损失', {
				title: '确认',
				skin: 'Prompt_modal', //样式类名
				closeBtn: 0, //不显示关闭按钮
				shift: 2,
				area: 'auto',
				shadeClose: true, //开启遮罩关闭
				btn: ['确定', '取消'] //按钮
			}, function() {
				if (_flag == '1') {
					$.ajax({
						url: allurl1 + 'uusjs/security/userBoundBankCard.do',
						type: 'POST',
						contentType: "application/x-www-form-urlencoded",
						dataType: 'json',
						data: {
							bankCard: form.aipayCard.value,
							bankCardType: _bankCardType,
							bankOwner: form.aipayOwner.value,
							bankIsDefault: '1',
						},
						success: function(data) {
							// console.log(data);
							if (data.STATUS == '0') {
								window.location = 'sjs_atm.html';
							} else {
								layer.alert(data.MSG);
							}
						}
					})
				} else if (_flag == '2') {
					$.ajax({
						url: allurl1 + 'uusjs/security/updateBankCard.do',
						type: 'POST',
						contentType: "application/x-www-form-urlencoded",
						dataType: 'json',
						data: {
							bankId: _bankId,
							bankCard: form.aipayCard.value,
							bankOwner: form.aipayOwner.value,
						},
						success: function(data) {
							// console.log(data);
							if (data.STATUS == '0') {
								window.location = 'sjs_atm.html';
							} else {
								layer.alert(data.MSG);
							}

						}
					})
				}

				layer.closeAll();

			}, function() {
				time: 1
			});

		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}

	});

	$.validator.addMethod("checkEmail", function(value, element, params) {
		var checkEmail = /^[a-z0-9]+@([a-z0-9]+\.)+[a-z]{2,4}$/i;
		var checkTel = /^1(3|4|5|7|8)\d{9}$/;

		if (checkEmail.test(value) == true || checkTel.test(value) == true) {
			return checkEmail.test(value) || checkTel.test(value);
		} else {
			return this.optional(element);
		}

	}, "*请输入正确的邮箱或者手机号！");


}


//提示框样式
function Prompt_model(ele) {
	layer.confirm(ele, {
		title: '确认',
		skin: 'Prompt_modal', //样式类名
		closeBtn: 0, //不显示关闭按钮
		shift: 2,
		area: 'auto',
		shadeClose: true, //开启遮罩关闭
		btn: ['确定', '取消'] //按钮
	}, function() {
		time: 1

	}, function() {
		time: 1
	});
}