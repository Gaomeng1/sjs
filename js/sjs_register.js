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
	$(function() {
		$('input,textarea').placeholder();
	});

	get_city_code();

}


var time = null;

function get_click() {

	console.log($('.checkbox input').is(':checked') == true);
	// 点击国家
	$('#click_city').on('click', function() {
		$('.citys').show();
	});

	$('.user_iphone').on('click', function() {
		$('.citys').hide();
	})

	// 点击获取验证码
	$('#click_verification').on('click', yzmclick_registerModal);


	$('.checkbox input').on('click', function() {
		if ($('.checkbox input').is(':checked') == false) {
			$('.checkbox .check_button').removeClass('active');

			$('.click_load button').attr({
				'disabled': 'disabled'
			});

		} else {
			$('.checkbox .check_button').addClass('active');

			$('.click_load button').removeAttr('disabled');
		}
	})

	$('.click_load button').on('click', function() {
		var veryCode = $('#inputCode').val();
		var phone = document.getElementById('inputTel').value;

		if (phone == '') {
			alert("请输入手机号！");
			return false;
			phone.val('');
		} else if (veryCode == '') {
			alert("请输入验证码！");
			return false;
			veryCode.val('');
		} else if ($('.checkbox input').is(':checked') == false) {
			$('.click_load button').attr({
				'disabled': 'disabled'
			});
		} else {
			$.ajax({
				url: allurl1 + 'uusjs/checkVerificationCode.do',
				type: 'POST',
				data: {
					veryCode: veryCode
				},
				success: function(data) {
					// console.log(data);
					if ($.parseJSON(data).MSG == 'SUCCESS') {
						var areacode = $('.borderRight').html().split('+')[1];
						window.location = '../html/sjs_register_password.html?veryCode=' + veryCode + '&city=' + areacode + '&tel=' + phone;
					} else {
						$('.get_label').html($.parseJSON(data).MSG);
					}
				}
			})

		}

	})
}

// 获取验证码
function yzmclick_registerModal() {
	$('#click_verification').off("click", yzmclick_registerModal);
	var givetype = 0;
	var telvalue = $('#inputTel').val();
	// console.log(telvalue);
	var uuid = 'channel_pc';
	var getyzmcilck = document.getElementById('click_verification');
	var areacode = $('.borderRight').html().split('+')[1];
	if (telvalue != '') {
		var yzmoriginurl = allurl1 + 'uusjs/userVerificationCode.do';
		ajax(get_verification_code_url(yzmoriginurl, givetype, telvalue, uuid, areacode), function(data) {
			console.log(data)
			if (data.MSG == 'SUCCESS') {
				startgetyzm(getyzmcilck, yzmclick_registerModal);
			} else {
				alert(data.MSG);
				$('#click_verification').on("click", yzmclick_registerModal);
			}
		});
	} else {
		// console.log(telvalue);
		alert('请填写手机号');
		$('#click_verification').on("click", yzmclick_registerModal);
	}
}



//开始读秒60
function startgetyzm(obj, func) {
	var starnum = 59;
	var gotime = null;
	obj.innerHTML = starnum + "秒";

	function minstime() {
		starnum--;
		obj.innerHTML = starnum + "秒";
		if (starnum == 0) {
			clearInterval(gotime);
			obj.innerHTML = "重新获取验证码";
			$(obj).on("click", func);
		}
	}
	gotime = setInterval(minstime, 1000);
}

function get_verification_code_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'userVerificationCode', n1, n2, n3, n4, '', 'type', 'userTel', 'uuid', 'mobileCountryCode', '');
	console.log(index_string);
	return index_string;
}



// 获取国家代码
function get_city_code(type, userTel, uuid, country) {
	var tags_url = allurl1 + 'uusjs/queryCountryCode.do';
	ajax(get_city_code_url(tags_url), function(data) {
		console.log(data)
		if (data.MSG = 'SUCCESS') {
			for (var i = 0; i < data.LIST.length; i++) {
				var whole_city = new whole_citys(data.LIST[i], $('.citys')[0]);
				whole_city.getclick();
			}

			$('.city_name,.user_iphone,.click_load,#inputCode').on('click', function() {
				$('.citys').hide();
			})
		}

		get_click();
	});
}
//get url
function get_city_code_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'queryCountryCode', '', '', '', '', '', '', '', '', '', '');
	console.log(index_string);
	return index_string;
}



// 注册城市的
function whole_citys(map, parent) {
	this.b = document.createElement('b');
	this.b.innerHTML = map.name.split('(')[0];

	this.i = document.createElement('i');
	this.i.innerHTML = '+' + map.phoneAreaCode;

	this.a = document.createElement('a');
	this.a.setAttribute('href', 'javascript:;');
	this.a.appendChild(this.b);
	this.a.appendChild(this.i);

	this.li = document.createElement('li');
	this.li.appendChild(this.a);

	parent.appendChild(this.li);
}
whole_citys.prototype.getclick = function() {
	var _this = this;
	this.li.onclick = function() {
		$(this).addClass('active').siblings().removeClass('active');

		$('.city_name').html($(this).find('b').html());

		$('.borderRight').html($(this).find('i').html());

		$('.citys').hide();
	}
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