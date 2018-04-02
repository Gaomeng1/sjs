var entrust_flag = 1;
var withdraw_flag = 1;
jQuery(document).ready(function($) {


	$("#nav_entrust_contaniner_scroll,#nav_withdraw_contaniner_scroll").niceScroll({
		cursorcolor: "#999",
		cursoropacitymax: 1,
		touchbehavior: false,
		cursorwidth: "3px",
		cursorborder: "0",
		cursorborderradius: "5px"
	});

	get_withdraw_order('1', '30');

	//撤单
	$('#nav_withdraw_contaniner_scroll').on('scroll', function() {
		var $this = $(this),
			viewH = $(this).height(), //可见高度
			contentH = $(this).get(0).scrollHeight, //内容高度
			scrollTop = $(this).scrollTop(); //滚动高度
		//if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
		if (scrollTop / (contentH - viewH) >= 0.98) { //到达底部100px时,加载新内容
			withdraw_flag++;
			get_withdraw_order(withdraw_flag + '', '30');
		}  
	})

	// 委托
	$('#nav_entrust_contaniner_scroll').on('scroll', function() {
		var $this = $(this),
			viewH = $(this).height(), //可见高度
			contentH = $(this).get(0).scrollHeight, //内容高度
			scrollTop = $(this).scrollTop(); //滚动高度
		//if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
		if (scrollTop / (contentH - viewH) >= 0.98) { //到达底部100px时,加载新内容
			entrust_flag++;
			get_entrust_func(entrust_flag + '', '30');
		}  
	})

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



// 委托
function get_entrust_func(page, Size) {
	$.ajax({
		url: allurl1 + 'uusjs/queryAllStock.do',
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: page,
			pageSize: Size
		},
		success: function(data) {
			// console.log(data);
			if (data.STATUS == '0') {

				$('#nav_entrust_contaniner_scroll').show().siblings('#nav_withdraw_contaniner_scroll').hide();
				
				if (data.LIST.length > 0) {
					var parent = document.getElementById('nav_entrust_contaniner_scroll');

					for (var i = 0; i < data.LIST.length; i++) {
						var create_two_route = new nav_query_entrust(data.LIST[i], parent);
					}
				} else {
					$('#nav_entrust_contaniner_scroll').off('scroll');
				}

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
			}

		}

	})

}

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

// 委托点击事件
var nav_flag = 0;
var inner_flag = 0;

function entrust_func() {
	$('.entrust_nav label').off('mousedown');
	// 点击只显示撤单
	$('.entrust_nav label').on('mousedown', function() {
		if ($('.entrust_nav .entrust_nav_check').is(':checked') == true) {
			$('.entrust_nav .check_button').removeClass('active');

			$('#nav_entrust_contaniner_scroll').empty();

			get_entrust_func('1', '30');
		} else {
			$('.entrust_nav .check_button').addClass('active');


			$('#nav_withdraw_contaniner_scroll').empty();

			get_withdraw_order('1', '30');

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
			// console.log(data);
			if (data.STATUS == '0') {

				$('#nav_withdraw_contaniner_scroll').show().siblings('#nav_entrust_contaniner_scroll').hide();
				if (data.LIST.length > 0) {
					var get_entrust_container = document.getElementById('nav_withdraw_contaniner_scroll');
					for (var i = 0; i < data.LIST.length; i++) {
						var create_three_route = new nav_withdrawsingle_func(data.LIST[i], get_entrust_container);
						create_three_route.getclick();
					}

				} else {
					$('#nav_withdraw_contaniner_scroll').off('scroll');
				}


				entrust_func();
			}
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

	$('.alert_modal button').on('click', function() {
		setTimeout(function() {
			layer.closeAll();
		}, 1);
	})
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
			window.location.reload();
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
		shadeClose: true, //开启遮罩关闭
		btn: ['确定', '取消'] //按钮
	}, function() {
		time: 1,
		get_withdraw_order_click(type, orderId);
	}, function() {
		time: 1
	});
}