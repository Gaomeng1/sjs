function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var Request = new Object();
Request = GetRequest();



window.onload = function() {
	// 撤单
	get_withdraw_order('1', '8');
}


// 撤单显示
var done_page = [];

function get_withdraw_order(page, Size) {
	var tags_url = allurl1 + 'uusjs/queryEntrustedProduct.do';
	ajax(get_withdraw_order_url(tags_url, page, Size), function(data) {
		console.log(data)
		if (data.MSG == 'SUCCESS') {
			done_page.push(page);
			if (data.LIST.length >= 1) {
				var get_routes_container = document.getElementById('withdrawsing_contaniner');
				var create_route_container = new one_route_container(get_routes_container, data.LIST, page);
				if (page == '1') {
					var data_num = parseInt(data.LIST[0].totalNum);
					var num_1 = parseInt(data_num / 8);
					var num_2 = parseInt(data_num % 8);
					var num = null;
					if (num_2 > 0) {
						num = num_1 + 1;
					} else {
						num = num_1;
					}
					console.log(num);
					var nav_container = document.getElementById('get_nav_container');

					$("#get_nav_container").createPage({
						pageCount: num,
						current: 1,
						backFn: function(p) {
							//
							hide_hot_service();
							//
							$('#hot_service' + (p)).show();
							//
							var result = $.inArray(p + '', done_page);
							if (result >= 0) {
								// alert(result);
							} else {
								get_withdraw_order(p + '', '8');
							}
						}
					});
				}

				$('.withdrawsing_ul li').each(function(index, el) {
					if ($('.withdrawsing_ul li').eq(index).html() == '') {
						$(this).html('&nbsp;')
					}
				});
			} else {
				$('#withdrawsing_contaniner').html('"无数据"');
				$('#withdrawsing_contaniner').css({
					'background': '#fff',
					'text-align': 'center',
					'color': '#FF2D41'
				});

			}
		} else if (data.MSG == '用户未登录！') {
			window.location = 'sjs_load.html';
		} else {
			layer.alert(data.MSG);
		}
	});
}


//get url
function get_withdraw_order_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'queryEntrustedProduct', n1, n2, '', '', '', 'currentPage', 'pageSize', '', '', '');
	console.log(index_string);
	return index_string;
}


function hide_hot_service() {
	// console.log($('#withdrawsing_contaniner').find('.Hot_service'));
	$('#withdrawsing_contaniner').find('.Hot_service').each(function() {
		$(this).hide();
	})
}

// 
function one_route_container(obj, data, page) {
	this.withdraw_li1 = document.createElement('li');
	this.withdraw_li2 = document.createElement('li');
	this.withdraw_li3 = document.createElement('li');
	this.withdraw_li4 = document.createElement('li');
	this.withdraw_li5 = document.createElement('li');
	this.withdraw_li6 = document.createElement('li');
	this.withdraw_li7 = document.createElement('li');
	this.withdraw_li8 = document.createElement('li');
	this.withdraw_li9 = document.createElement('li');
	this.withdraw_ul = document.createElement('ul');

	this.withdraw_li1.innerHTML = '名称代码';

	this.withdraw_li2.innerHTML = '持有人';

	this.withdraw_li3.innerHTML = '委托时长';

	this.withdraw_li4.innerHTML = '委托价格';

	this.withdraw_li5.innerHTML = '交易状态';

	this.withdraw_li6.innerHTML = '交易时间';

	this.withdraw_li7.innerHTML = '委托类型';

	this.withdraw_li8.innerHTML = '成交类型';

	this.withdraw_li9.innerHTML = '操作';

	this.withdraw_ul.className = 'clear';
	this.withdraw_ul.appendChild(this.withdraw_li1);
	this.withdraw_ul.appendChild(this.withdraw_li2);
	this.withdraw_ul.appendChild(this.withdraw_li3);
	this.withdraw_ul.appendChild(this.withdraw_li4);
	this.withdraw_ul.appendChild(this.withdraw_li5);
	this.withdraw_ul.appendChild(this.withdraw_li6);
	this.withdraw_ul.appendChild(this.withdraw_li7);
	this.withdraw_ul.appendChild(this.withdraw_li8);
	this.withdraw_ul.appendChild(this.withdraw_li9);

	this.hot_service = document.createElement('div');
	this.hot_service.className = 'Hot_service clear';
	this.hot_service.setAttribute('id', 'hot_service' + page);
	this.hot_service.appendChild(this.withdraw_ul);


	//
	for (var i = 0; i < data.length; i++) {
		// console.log(i)
		var create_one_route = new withdraw_order(data[i], this.hot_service, 0);
		create_one_route.getclick();
	}
	//
	obj.style.border = '1px solid #e5e5e5';
	obj.appendChild(this.hot_service);
}



function withdraw_order(map, parent, page) {
	this.withdraw_li1 = document.createElement('li');
	this.withdraw_li2 = document.createElement('li');
	this.withdraw_li3 = document.createElement('li');
	this.withdraw_li4 = document.createElement('li');
	this.withdraw_li5 = document.createElement('li');
	this.withdraw_li6 = document.createElement('li');
	this.withdraw_li7 = document.createElement('li');
	this.withdraw_li8 = document.createElement('li');
	this.withdraw_li9 = document.createElement('li');
	this.withdraw_ul = document.createElement('ul');

	this.withdraw_li1.innerHTML = map.investorsName;

	this.withdraw_li2.innerHTML = map.investorsCode;

	this.withdraw_li3.innerHTML = map.orderNum;

	this.withdraw_li4.innerHTML = map.orderPrice;

	if (map.orderStatus == 0 || map.orderStatus == 4) {
		this.withdraw_li5.innerHTML = '进行中';
	} else if (map.orderStatus == 1) {
		this.withdraw_li5.innerHTML = '废单';
	} else if (map.orderStatus == 2) {
		this.withdraw_li5.innerHTML = '已成';
	}

	this.withdraw_li6.innerHTML = map.orderDate;

	if (map.type == 1) {
		this.withdraw_li7.innerHTML = '买入';
	} else if (map.type == 2) {
		this.withdraw_li7.innerHTML = '卖出';
	}

	this.withdraw_li8.innerHTML = map.actualNumber;

	this.withdraw_li9_a = document.createElement('a');
	this.withdraw_li9_a.setAttribute('href', 'javascript:;');
	this.withdraw_li9_a.innerHTML = '撤单';

	this.withdraw_li9.appendChild(this.withdraw_li9_a);

	this.withdraw_ul.className = 'clear withdrawsing_ul';
	this.withdraw_ul.appendChild(this.withdraw_li1);
	this.withdraw_ul.appendChild(this.withdraw_li2);
	this.withdraw_ul.appendChild(this.withdraw_li3);
	this.withdraw_ul.appendChild(this.withdraw_li4);
	this.withdraw_ul.appendChild(this.withdraw_li5);
	this.withdraw_ul.appendChild(this.withdraw_li6);
	this.withdraw_ul.appendChild(this.withdraw_li7);
	this.withdraw_ul.appendChild(this.withdraw_li8);
	this.withdraw_ul.appendChild(this.withdraw_li9);

	this.parent_node = parent;
	this.parent_node.appendChild(this.withdraw_ul);

	this.type = map.type;
	this.orderId = map.orderId;

}
withdraw_order.prototype.getclick = function() {
	var _this = this;
	this.withdraw_li9.onclick = function() {
		Prompt_model('是否撤单？', _this.type, _this.orderId);
	}
}


// 撤单接口
function get_withdraw_order_click(type, orderId) {
	$.ajax({
		url: allurl1 + 'uusjs/updateRevocationStatus.do',
		type: 'POST',
		data: {
			type: type,
			orderId: orderId
		},
		success: function(data) {
			console.log(data);
			window.location = location;
			get_withdraw_order('1', '8');
		}
	})
}


//提示框样式
function Prompt_model(ele, type, orderId) {
	layer.confirm(ele, {
		title: false,
		skin: 'Prompt_modal', //样式类名
		closeBtn: 0, //不显示关闭按钮
		shift: 2,
		area: ['260px', '140px'],
		shadeClose: true, //开启遮罩关闭
		btn: ['确定', '取消'] //按钮
	}, function() {
		time:1
		get_withdraw_order_click(type, orderId);
	}, function() {
		time: 1
	});
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