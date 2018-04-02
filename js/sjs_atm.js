/**
 * Created by uuzhang on 2016/12/14.
 */

//flag  1=添加   2=修改


jQuery(document).ready(function () {
	//获取银行卡
	Bank_card();

	//添加银行卡
	add_bank();

	//提现
	Withdraw_func();


	$(".sjs_atm_content_inner").niceScroll({
		cursorcolor: "#ccc",
		cursoropacitymax: 1,
		touchbehavior: false,
		cursorwidth: "3px",
		cursorborder: "0",
		cursorborderradius: "5px"
	});
});


var user_price = null;

function Bank_card() {
	//获取资产
	$.ajax({
		url: allurl1 + 'uusjs/queryUserPurse.do',
		type: 'POST',
		contentType: "application/x-www-form-urlencoded",
		dataType: 'json',
		success: function (data) {
			// console.log(data);
			if (data.STATUS == '0') {
				$('#time_position').html(data.OBJECT.withDrawMoney);

				user_price = Number(data.OBJECT.withDrawMoney);

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}
		}
	})
	//获取银行卡
	$.ajax({
		url: allurl1 + 'uusjs/userBoundBankCardList.do',
		type: 'POST',
		dataType: 'json',
		success: function (data) {
			// console.log(data);
			if (data.STATUS == '0') {
				if (data.LIST.length > 0) {
					var parent = document.getElementById('Bank_code');
					$('#Bank_code').empty();

					for (var i = 0; i < data.LIST.length; i++) {
						var create_one_route = new Bank_code_func(parent, data.LIST[i], data.LIST.length);
						create_one_route.getclick();

						if (i > 1) {
							$('#Bank_code pre').eq(1).nextAll().hide();

							$('#choose_bank').show();
						} else {

						}

						//点击事件
						bank_card_click();
					}
				} else {

				}
			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				layer.alert(data.MSG);
			}

		}
	})
}

var choose_flag = 0;

function bank_card_click() {
	$('#choose_bank').off('click');

	//银行卡点击事件
	$('#Bank_code pre').each(function (index) {
		$(this).on('click', function () {
			$('#Bank_code pre').eq(index).addClass('active').find('.pull-right').show().end().find('input').attr('checked', 'true').siblings('b').addClass('active').parent().parent().siblings().find('.pull-right').hide().find('ul').hide().end().end().removeClass('active').find('b').removeClass('active').siblings('input').removeAttr('checked');
		})

	})

	$('#Bank_code pre').eq(0).click();


	$('#choose_bank').on('click', function () {
		if (choose_flag == 0) {
			$('#Bank_code pre').show();
			choose_flag = 1;
		} else if (choose_flag == 1) {
			$('#Bank_code pre').eq(1).nextAll().hide();
			choose_flag = 0;
		}
	})


}
//
var code_flag = 0;

function Bank_code_func(parent, map, length) {
	this.img = document.createElement('img');

	this.input = document.createElement('input');
	this.input.style.display = 'none';
	this.input.setAttribute('type', 'checkbox');
	this.input.setAttribute('value', map.bankCardType);

	this.input2 = document.createElement('input');
	this.input2.setAttribute('type', 'hidden');
	this.input2.setAttribute('id', 'u_ipt_hidden');
	this.input2.setAttribute('value', map.bankId);

	this.i1 = document.createElement('i');

	this.b = document.createElement('b');

	this.pull_left = document.createElement('div');
	this.pull_left.className = 'pull-left';
	this.pull_left.appendChild(this.input);
	this.pull_left.appendChild(this.input2);
	this.pull_left.appendChild(this.b);
	this.pull_left.appendChild(this.img);


	this.a = document.createElement('a');
	this.a.setAttribute('href', 'javascript:;');
	this.a.className = 'u_background';
	this.a.innerHTML = '管理';

	this.ul = document.createElement('ul');

	this.delete = document.createElement('a');
	this.delete.innerHTML = '删除';


	for (var j = 0; j < 2; j++) {
		this.li = document.createElement('li');
		this.inner = document.createElement('a');
		if (j == 0) {
			this.inner.innerHTML = '编辑';
			this.inner.setAttribute('href', 'sjs_add_bank.html?bankCardType=' + map.bankCardType + '&bankid=' + map.bankId + '&flag=2&card=' + map.bankCard + '&name=' + map.bankOwner);
		} else {
			this.inner.innerHTML = '删除';
			this.inner.setAttribute('href', 'javascript:;');
		}
		this.li.appendChild(this.inner);
		this.ul.appendChild(this.li);
	}

	this.pull_right = document.createElement('div');
	this.pull_right.className = 'pull-right';
	this.pull_right.appendChild(this.a);
	this.pull_right.appendChild(this.ul);

	switch (map.bankCardType) {
		case '1':
			this.i1.innerHTML = "中国银行";
			this.img.setAttribute('src', '../img/atm/zg.png');
			break;
		case '2':
			this.i1.innerHTML = "中国农业银行";
			this.img.setAttribute('src', '../img/atm/ny.png');
			break;
		case '3':
			this.i1.innerHTML = "中国工商银行";
			this.img.setAttribute('src', '../img/atm/gs.png');
			break;
		case '4':
			this.i1.innerHTML = "中国建设银行";
			this.img.setAttribute('src', '../img/atm/js.png');
			break;
		case '5':
			this.i1.innerHTML = "中国交通银行";
			this.img.setAttribute('src', '../img/atm/jt.png');
			break;
		case '6':
			this.i1.innerHTML = "中国招商银行";
			this.img.setAttribute('src', '../img/atm/zs.png');
			break;
		case '7':
			this.i1.innerHTML = "中国光大银行";
			this.img.setAttribute('src', '../img/atm/gd.png');
			break;
		case '8':
			this.i1.innerHTML = "支付宝";
			this.img.setAttribute('src', '../img/atm/zfb.png');
			break;
		default:
			break;
	}

	this.pull_left.appendChild(this.i1);
	for (var i = 0; i < 2; i++) {
		this.i = document.createElement('i');
		if (i == 0) {
			this.i.innerHTML = map.bankCard;
		} else if (i == 1) {
			this.i.innerHTML = '开户姓名：' + map.bankOwner;
		}
		this.pull_left.appendChild(this.i);
	}


	this.pre = document.createElement('pre');
	this.pre.className = 'clear';
	this.pre.appendChild(this.pull_left);
	this.pre.appendChild(this.pull_right)

	if (map.bankIsDefault == 1) {
		parent.insertBefore(this.pre, parent.childNodes[0]);
	} else {
		parent.appendChild(this.pre);
	}


	this.map = map;

}
Bank_code_func.prototype.getclick = function () {
	var _this = this;
	this.a.onclick = function (e) {
		e = e || window.event;
		if (e.stopPropagation) { //W3C阻止冒泡方法  
			e.stopPropagation();
		} else {
			e.cancelBubble = true; //IE阻止冒泡方法  
		}
		// console.log($('#Bank_code .active ul'));
		$('#Bank_code .active ul').toggle();
	};
	this.inner.onclick = function () {
		layer.confirm('是否要删除提现账户？', {
			title: '删除',
			skin: 'Prompt_modal', //样式类名
			closeBtn: 0, //不显示关闭按钮
			shift: 2,
			area: 'auto',
			shadeClose: true, //开启遮罩关闭
			btn: ['确定', '取消'] //按钮
		}, function () {
			$.ajax({
				url: allurl1 + 'uusjs/deleteUserBankCard.do',
				type: 'POST',
				dataType: 'json',
				data: {
					bankId: _this.map.bankId,
				},
				success: function (data) {
					// console.log(data);
					if (data.STATUS == '0') {
						window.location = location;
					} else if (data.STATUS == '3') {
						window.location = 'sjs_load.html';
					} else {
						layer.alert(data.MSG);
					}

				}
			})
			layer.closeAll();
		}, function () {
			time: 1
		});
	}

}


//添加银行卡
function add_bank() {
	//添加银行卡
	$('.bank_atm li').each(function (index) {
		$(this).on('click', function () {
			$('.bank_atm li').eq(index).find('input').attr('checked', 'true').siblings('b').addClass('active').parent().parent().siblings().find('b').removeClass('active').siblings('input').removeAttr('checked');
			$('.network_money li').find('b').removeClass('active').siblings('input').removeAttr('checked');

			window.location = 'sjs_add_bank.html?bankCardType=' + (index + 1) + '&flag=1';
		})

	})

	//支付宝
	$('.network_money li').each(function (index) {
		$(this).on('click', function () {
			$('.network_money li').eq(index).find('input').attr('checked', 'true').siblings('b').addClass('active').parent().parent().siblings().find('b').removeClass('active').siblings('input').removeAttr('checked');
			$('.bank_atm li').find('b').removeClass('active').siblings('input').removeAttr('checked');

			window.location = 'sjs_add_bank.html?bankCardType=8&flag=1';
		})
	})
}


// 提现
function Withdraw_func() {
	$('#next_btn').off('click');


	$('#atm_money').on('keyup', function () {
		$(this).siblings('span').html('+' + (Number($(this).val()) * 0.01).toFixed(2) + '元手续费');
	})

	$('#next_btn').on('click', function () {
		if ($('#Bank_code pre').hasClass('active') == false) {
			layer.alert('请添加提现账户!');
		} else if ($('#atm_money').val() == '') {
			layer.alert('提现金额不能为空!');
		} else if (Number($('#atm_money').val()) < 10) {
			layer.alert('提现金额不能小于10元');
		} else if (Number($('#atm_money').val()) > user_price) {
			layer.alert('提现金额不能超过可提现金额');
		} else {
			window.location = 'sjs_confirm_withdrawals.html?bankCardType=' + $('#Bank_code .active input').val() + '&card=' + $('#Bank_code .active i').eq(1).html() + '&name=' + $('#Bank_code .active i').eq(2).html().split('：')[1] + '&money=' + $('#atm_money').val() + '&bankid=' + $('#u_ipt_hidden').val();
		}
	})


}