var entrust_flag = 1;
var position_flag = 1;
jQuery(document).ready(function($) {
	$("#entrust_contaniner_scroll,#whole_positions_scroll").niceScroll({
		cursorcolor: "#999",
		cursoropacitymax: 1,
		touchbehavior: false,
		cursorwidth: "3px",
		cursorborder: "0",
		cursorborderradius: "5px"
	});


	// 持仓
	$('#whole_positions_scroll').on('scroll', function() {
		var $this = $(this),
			viewH = $(this).height(), //可见高度
			contentH = $(this).get(0).scrollHeight, //内容高度
			scrollTop = $(this).scrollTop(); //滚动高度
		//if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
		if (scrollTop / (contentH - viewH) >= 0.98) { //到达底部100px时,加载新内容
			position_flag++;
			get_positions_func(position_flag + '', '30');
		}  
	})

	// 委托
	$('#entrust_contaniner_scroll').on('scroll', function() {
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
				window.location = 'sjs_set_password_one.html?typeFlag=0&htmlFlag=2';
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


//当在申购中的时候调用的数量
function purchase_time_func2(page, num, obj, price) {
    if (page == 1) {
        if (num >= 1000) {
            num -= 1000;
            if (num < 1000) {
                obj.val(1000);
            } else {
                obj.val(num);
            }
        } else {
        }
    } else if (page == 2) {
        if (num < price) {
            num += 1000;
            obj.val(num);
            // console.log(num);
            if (num > price) {
                obj.val(100000);
            } else {
                obj.val(num);
            }
        } else {
        }
    }
}


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
			// console.log(data)
			if (data.STATUS == '0') {

				var parent = document.getElementById('entrust_contaniner_scroll');
				if (data.LIST.length > 0) {
					for (var i = 0; i < data.LIST.length; i++) {
						var create_two_route = new query_entrust(data.LIST[i], parent);
					}
				} else {
					$('#entrust_contaniner_scroll').off('scroll');
				}

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
			}



		}

	})

}
// 
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


// 买入提示
function modal_tips(type, ele) {
	$('.modal_open').show();
	$('.modal_open p').html('您的' + type + '委托' + ele + '已提交');
	setInterval(function() {
		$('.modal_open').hide();
	}, 4000)
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

var uplowFlag = null;

function get_buy_disc_sell(code) {
	$.ajax({
		url: allurl1 + 'uusjs/publishInformation.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
		data: {
			pcode: code
		},
		success: function(data) {
			// console.log(data);

			if (data.STATUS == '0') {
				mint_price = [];
				mint_min_time = [];
				mint_volume = [];
				mint_color = [];

				//获取闭盘价
				if (Number(data.OBJECT.baseInformation.closePrice) > 0) {
					var close_Price = data.OBJECT.baseInformation.closePrice;
				} else {
					var close_Price = data.OBJECT.baseInformation.openPrice;
				}

				// 分时图
				if (data.OBJECT.minitePriceList.length > 0) {

					// console.log(2)

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
					init_chart(close_Price, data.OBJECT.baseInformation.uplowFlag, data.OBJECT.baseInformation.price);
				} else {

					// console.log(4)
					for (var i = 0; i < mint_time.length; i++) {
						mint_min_time.push('0.00')

						mint_color.push((0 * 10) % 10);

						mint_volume.push('0.00');
						mint_price.push('0.00');
					}

					// console.log(mint_min_time);

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
					init_chart(close_Price, data.OBJECT.baseInformation.uplowFlag, data.OBJECT.baseInformation.price);
				}

			} else if (data.STATUS == '3') {
				window.location = 'sjs_load.html';
			} else {
				alert_model(data.MSG);
			}
		}
	})
}
var mint_time = ['9:30', '9:31', '9:32', '9:33', '9:34', '9:35', '9:36', '9:37', '9:38', '9:39', '9:40', '9:41', '9:42', '9:43', '9:44', '9:45', '9:46', '9:47', '9:48', '9:49', '9:50', '9:51', '9:52', '9:53', '9:54', '9:55', '9:56', '9:57', '9:58', '9:59', '10:00', '10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09', '10:10', '10:11', '10:12', '10:13', '10:14', '10:15', '10:16', '10:17', '10:18', '10:19', '10:20', '10:21', '10:22', '10:23', '10:24', '10:25', '10:26', '10:27', '10:28', '10:29', '10:30', '10:31', '10:32', '10:33', '10:34', '10:35', '10:36', '10:37', '10:38', '10:39', '10:40', '10:41', '10:42', '10:43', '10:44', '10:45', '10:46', '10:47', '10:48', '10:49', '10:50', '10:51', "10:52", "10:53", "10:54", "10:55", "10:56", "10:57", "10:58", "10:59", '11:00', '11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07', '11:08', '11:09', '11:11', '11:11', '11:12', '11:13', '11:14', '11:15', '11:16', '11:17', '11:18', '11:19', '11:20', '11:21', '11:22', '11:23', '11:24', '11:25', '11:26', '11:27', '11:28', '11:29', '11:30/13:00', '13:01', '13:02', '13:03', '13:04', '13:05', '13:06', '13:07', '13:08', '13:09', '13:10', '13:11', '13:12', '13:13', '13:14', '13:15', '13:16', '13:17', '13:18', '13:19', '13:20', '13:21', '13:22', '13:23', '13:24', '13:25', '13:26', '13:27', '13:28', '13:29', '13:30', '13:31', '13:32', '13:33', '13:34', '13:35', '13:36', '13:37', '13:38', '13:39', '13:40', '13:41', '13:42', '13:43', '13:44', '13:45', '13:46', '13:47', '13:48', '13:49', '13:50', '13:51', "13:52", "13:53", "13:54", "13:55", "13:56", "13:57", "13:58", "13:59", '14:00', '14:01', '14:02', '14:03', '14:04', '14:05', '14:06', '14:07', '14:08', '14:09', '14:14', '14:11', '14:12', '14:14', '14:14', '14:15', '14:16', '14:17', '14:18', '14:19', '14:20', '14:21', '14:22', '14:23', '14:24', '14:25', '14:26', '14:27', '14:28', '14:29', '14:30', '14:31', '14:32', '14:33', '14:34', '14:35', '14:36', '14:37', '14:38', '14:39', '14:40', '14:41', '14:42', '14:43', '14:44', '14:45', '14:46', '14:47', '14:48', '14:49', '14:50', '14:51', "14:52", "14:53", "14:54", "14:55", "14:56", "14:57", "14:58", "14:59", '15:00/18:00', '18:01', '18:02', '18:03', '18:04', '18:05', '18:06', '18:07', '18:08', '18:09', '18:18', '18:11', '18:12', '18:18', '18:18', '18:15', '18:16', '18:17', '18:18', '18:19', '18:20', '18:21', '18:22', '18:23', '18:24', '18:25', '18:26', '18:27', '18:28', '18:29', '18:30', '18:31', '18:32', '18:33', '18:34', '18:35', '18:36', '18:37', '18:38', '18:39', '18:40', '18:41', '18:42', '18:43', '18:44', '18:45', '18:46', '18:47', '18:48', '18:49', '18:50', '18:51', "18:52", "18:53", "18:54", "18:55", "18:56", "18:57", "18:58", "18:59", '19:00', '19:01', '19:02', '19:03', '19:04', '19:05', '19:06', '19:07', '19:08', '19:09', '19:19', '19:11', '19:12', '19:19', '19:19', '19:15', '19:16', '19:17', '19:19', '19:19', '19:20', '19:21', '19:22', '19:23', '19:24', '19:25', '19:26', '19:27', '19:28', '19:29', '19:30', '19:31', '19:32', '19:33', '19:34', '19:35', '19:36', '19:37', '19:38', '19:39', '19:40', '19:41', '19:42', '19:43', '19:44', '19:45', '19:46', '19:47', '19:48', '19:49', '19:50', '19:51', "19:52", "19:53", "19:54", "19:55", "19:56", "19:57", "19:58", "19:59", '20:00', '20:01', '20:02', '20:03', '20:04', '20:05', '20:06', '20:07', '20:08', '20:09', '20:20', '20:11', '20:12', '20:20', '20:20', '20:15', '20:16', '20:17', '20:20', '20:20', '20:20', '20:21', '20:22', '20:23', '20:24', '20:25', '20:26', '20:27', '20:28', '20:29', '20:30', '20:31', '20:32', '20:33', '20:34', '20:35', '20:36', '20:37', '20:38', '20:39', '20:40', '20:41', '20:42', '20:43', '20:44', '20:45', '20:46', '20:47', '20:48', '20:49', '20:50', '20:51', "20:52", "20:53", "20:54", "20:55", "20:56", "20:57", "20:58", "20:59", '21:00'];
// 分时图
function init_chart(close_Price, uplowFlag, price) {
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


	var close_Price_value = parseFloat(close_Price);
	var up_down = ((Number(price) - Number(close_Price)) / close_Price * 100).toFixed(2);
	var _maxlength = close_Price_value * 1.1;
	var _minlength = close_Price_value * 0.9;

	if (up_down > uplowFlag) {
		var a_max = up_down;
	} else if (uplowFlag == 10) {
		var a_max = uplowFlag;
	} else {
		var a_max = uplowFlag;
		_maxlength = close_Price_value * 2;
		_minlength = 0;

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
			boundaryGap: false,
			data: mint_time,
			axisLabel: {
				show: true,
				interval: 119,
				textStyle: {
					color: '#fff',
					baseline: 'middle'
				}
			},
			axisTick: {
				show: false,
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
						var color = "#000";
						if (value > close_Price_value) {
							color = "#FF2D41";
						} else if (value == close_Price_value) {
							color = "#000";
						} else {
							color = "#04C192";
						}
						return color;
					}

				}
			},
			axisLine: {
				show: false,
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
				show: false,
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
				interval: 119,
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
				show: false,
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