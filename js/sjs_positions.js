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
	
	get_positions_func('1','7');

}


// 获取持仓接口
var done_page=[];
function get_positions_func(page,size){
	var tags_url=allurl1+'uusjs/queryPositionProduct.do';
	ajax(get_positions_url(tags_url,page,size),function(data){
		console.log(data)
		if(data.MSG =='SUCCESS'){
			done_page.push(page);
			if(data.LIST.length>1){
				var get_routes_container = document.getElementById('whole_positions');
				var create_route_container = new one_route_container(get_routes_container, data.LIST, page);

				if (page == '1') {
					var data_num = parseInt(data.LIST.length);
					var num_1 = parseInt(data_num / 7);
					var num_2 = parseInt(data_num % 7);
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
								get_positions_func(p + '', '7');
							}
						}
					});
				}

			}else{
				$('#whole_positions').html('"无数据"');
				$('#whole_positions').css({
					'text-align': 'center',
					'color': '#FF2D41',
					// 'background':'none',
					'border':'none'
				});
			}
			if(data.OBJECT!=null){
				positions_price(data.OBJECT);
			}
			// 

		}else if(data.MSG=='用户未登录！'){
			window.location='sjs_load.html';	
		}else{
			layer.alert(data.MSG);
		}
	});
}


//get url
function get_positions_url(originurl,n1,n2,n3,n4,n5,m1,m2,m3,m4,m5){
	var index_string=getresult(originurl,'queryPositionProduct',n1,n2,'','','','currentPage','pageSize','','','');
	console.log(index_string);
	return index_string;
}

// 清除
function hide_hot_service() {
	// console.log($('#withdrawsing_contaniner').find('.Hot_service'));
	$('#whole_positions').find('.Hot_service').each(function() {
		$(this).hide();
	})
}


function positions_price(map){
	$('#user_money').html(map.userPurse);

	$('#position_money').html(map.positionPrice);
}


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

	this.withdraw_li1.innerHTML = '发行人代码';

	this.withdraw_li2.innerHTML = '发行人';

	this.withdraw_li3.innerHTML = '持有';

	this.withdraw_li4.innerHTML = '现价';

	this.withdraw_li5.innerHTML = '可卖';

	this.withdraw_li6.innerHTML = '成本';

	this.withdraw_li7.innerHTML = '盈亏';

	this.withdraw_li8.innerHTML = '盈亏比例';

	this.withdraw_li9.innerHTML = '操作';

	this.withdraw_ul.className = 'clear first_child';
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
		var create_one_route = new query_positions(data[i], this.hot_service);
		create_one_route.getclick();

	}
	//
	obj.style.border = '1px solid #e5e5e5';
	obj.appendChild(this.hot_service);
}





// 
function query_positions(map,parent){
	this.clear_li1=document.createElement('li');
	this.clear_li1.innerHTML=map.investorsCode;

	this.clear_li2=document.createElement('li');
	this.clear_li2.innerHTML=map.investorsName;

	this.clear_li3=document.createElement('li');
	this.clear_li3.innerHTML=map.buyerOrderNum;

	this.clear_li4=document.createElement('li');
	this.clear_li4.innerHTML=map.newOrderPrice;

	this.clear_li5=document.createElement('li');
	this.clear_li5.innerHTML=map.buyerOrderNum;
	
	this.clear_li6=document.createElement('li');
	this.clear_li6.innerHTML=map.buyerOrderPrice;

	this.clear_li7=document.createElement('li');
	this.clear_li7.innerHTML=map.addPrice;

	this.clear_li8=document.createElement('li');
	this.clear_li8.innerHTML=map.uplowPrice;

	if(map.uplowPrice==1){
		this.clear_li7.className='red';
		this.clear_li8.className='red';
	}else if(map.uplowPrice==2){
		this.clear_li7.className='green';
		this.clear_li8.className='green';

	}

	this.li9_a=document.createElement('a');
	this.li9_a.setAttribute('data-toggle','modal');
	this.li9_a.setAttribute('data-target','#purchase_modal');
	this.li9_a.setAttribute('href','');
	this.li9_a.innerHTML='买入';

	this.clear_li9=document.createElement('li');
	this.clear_li9.className='border purchase';
	this.clear_li9.appendChild(this.li9_a);

	this.li10_a=document.createElement('a');
	this.li10_a.setAttribute('data-toggle','modal');
	this.li10_a.setAttribute('href','');
	this.li10_a.setAttribute('data-target','#purchase_modal');
	this.li10_a.innerHTML='卖出';

	this.clear_li10=document.createElement('li');
	this.clear_li10.className='purchase blue_border';
	this.clear_li10.appendChild(this.li10_a);

	this.li11_a=document.createElement('a');
	this.li11_a.innerHTML='行情';

	this.clear_li11=document.createElement('li');
	this.clear_li11.className='purchase';
	this.clear_li11.appendChild(this.li11_a);

	this.ul=document.createElement('ul');
	this.ul.className='clear';
	this.ul.appendChild(this.clear_li1);
	this.ul.appendChild(this.clear_li2);
	this.ul.appendChild(this.clear_li3);
	this.ul.appendChild(this.clear_li4);
	this.ul.appendChild(this.clear_li5);
	this.ul.appendChild(this.clear_li6);
	this.ul.appendChild(this.clear_li7);
	this.ul.appendChild(this.clear_li8);
	this.ul.appendChild(this.clear_li9);
	this.ul.appendChild(this.clear_li10);
	this.ul.appendChild(this.clear_li11);

	parent.appendChild(this.ul)


	this.code=map.investorsCode;
	this.map=map;
}
query_positions.prototype.getclick = function() {
	var _this = this;
	this.li9_a.onclick = function() {
		$('#purchase_modal .btn-group button').eq(0).addClass('active').siblings().removeClass('active');
		$('.purchase_tab1').show().siblings().hide();

		get_purchase_modal(_this.map);
	}
	this.li10_a.onclick = function() {
		$('#purchase_modal .btn-group button').eq(1).addClass('active').siblings().removeClass('active');
		$('.purchase_tab2').show().siblings().hide();
		get_purchase_modal(_this.map);
	}
	this.li11_a.onclick=function(){
		window.location='sjs_index_load.html?code='+this.code;
	}
}



// 交易
function get_purchase_modal(map) {
	$('.purchase_tab').each(function(index, el) {
		console.log(index)
		$('.purchase_tab').eq(index).find('.sjs_modal_top span').html(map.investorsName);

		$('.purchase_tab').eq(index).find('.sjs_modal_top b').html(map.newOrderPrice);

		$('.purchase_tab').eq(index).find('.sjs_modal_top i').html(map.uplowPrice);

		$('.purchase_tab').eq(index).find('.sjs_modal_center b').html(map.investorsName + '&nbsp;' + map.investorsCode);

	});

	$('#price_number').val(map.newOrderPrice);

	$('#transaction_sell_num').val(map.newOrderPrice);

	// 交易买入
	$('#purchase_buy').on('click', function() {
			get_purchase(map.investorsCode, $('#price_number').val(), $('#time_number').val());
		})
		// 交易卖出
	$('#purchase_sell').on('click', function() {
		get_sell_out(map.investorsCode, $('#transaction_sell_num').val(), $('#transaction_time_num').val());
	})

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