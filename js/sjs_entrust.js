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

	// 委托接口
	get_entrust_func('1', '8');
}



// 获取委托接口
var done_page = [];

function get_entrust_func(page, Size) {
	var tags_url = allurl1 + 'uusjs/queryAllStock.do';
	ajax(get_entrust_url(tags_url, page, Size), function(data) {
		console.log(data)
		if (data.MSG == 'SUCCESS') {
			done_page.push(page);
			if (data.LIST.length >= 1) {
				var get_routes_container = document.getElementById('entrust_contaniner');
				var create_route_container = new one_route_container(get_routes_container, data.LIST, page);

				console.log(data.LIST[0].totalNum)
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
								get_entrust_func(p + '', '8');
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
				$('#entrust_contaniner').html('"无数据"');
				$('#entrust_contaniner').css({
					'background': '#fff',
					'text-align': 'center',
					'color': '#FF2D41',
					'border': 'none'
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
function get_entrust_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'queryAllStock', n1, n2, '', '', '', 'currentPage', 'pageSize', '', '', '');
	console.log(index_string);
	return index_string;
}
// 
function hide_hot_service() {
	$('#entrust_contaniner').find('.Hot_service').each(function() {
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

	this.withdraw_li1.innerHTML = '代码';

	this.withdraw_li2.innerHTML = '发行人';

	this.withdraw_li3.innerHTML = '委托价格';

	this.withdraw_li4.innerHTML = '委托时间';

	this.withdraw_li5.innerHTML = '委托量';

	this.withdraw_li6.innerHTML = '成交量';

	this.withdraw_li7.innerHTML = '状态';

	this.withdraw_ul.className = 'clear';
	this.withdraw_ul.appendChild(this.withdraw_li1);
	this.withdraw_ul.appendChild(this.withdraw_li2);
	this.withdraw_ul.appendChild(this.withdraw_li3);
	this.withdraw_ul.appendChild(this.withdraw_li4);
	this.withdraw_ul.appendChild(this.withdraw_li5);
	this.withdraw_ul.appendChild(this.withdraw_li6);
	this.withdraw_ul.appendChild(this.withdraw_li7);

	this.hot_service = document.createElement('div');
	this.hot_service.className = 'Hot_service clear';
	this.hot_service.setAttribute('id', 'hot_service' + page);
	this.hot_service.appendChild(this.withdraw_ul);


	//
	for (var i = 0; i < data.length; i++) {
		console.log(i)
		var create_one_route = new query_entrust(data[i], this.hot_service);
		// create_one_route.getclick();
	}


	obj.style.border = '1px solid #e5e5e5';
	obj.appendChild(this.hot_service);
}



function query_entrust(map, parent) {
	this.clear_li1 = document.createElement('li');
	this.clear_li1.innerHTML = map.investorsCode;

	this.clear_li2 = document.createElement('li');
	this.clear_li2.innerHTML = map.investorsName;

	this.clear_li3 = document.createElement('li');
	this.clear_li3.innerHTML = map.orderPrice;

	this.clear_li4 = document.createElement('li');
	this.clear_li4.innerHTML = map.orderDate;

	this.clear_li5 = document.createElement('li');
	this.clear_li5.innerHTML = map.orderNum;

	this.clear_li6 = document.createElement('li');
	this.clear_li6.innerHTML = map.actualNumber;

	this.clear_li7 = document.createElement('li');

	if (map.type == '买入') {
		this.clear_li7.className = 'red';
	} else if (map.type == '卖出') {
		this.clear_li7.className = 'green';
	}

	if (map.orderStatus == 0 || map.orderStatus == 4) {
		this.clear_li7.innerHTML = '(已报)';
	} else if (map.orderStatus == 1) {
		this.clear_li7.innerHTML = '(废单)';
	} else if (map.orderStatus == 2) {
		this.clear_li7.innerHTML = '(已成)';

	}


	this.ul = document.createElement('ul');
	this.ul.className = 'clear withdrawsing_ul';
	this.ul.appendChild(this.clear_li1);
	this.ul.appendChild(this.clear_li2);
	this.ul.appendChild(this.clear_li3);
	this.ul.appendChild(this.clear_li4);
	this.ul.appendChild(this.clear_li5);
	this.ul.appendChild(this.clear_li6);
	this.ul.appendChild(this.clear_li7);


	parent.appendChild(this.ul)
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