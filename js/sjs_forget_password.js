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
	get_click()

}


var time = null;

function get_click() {
	// 点击获取验证码
	$('#click_verification').on('click', yzmclick_registerModal);
	// 

	$("#forgetForm").validate({
		rules: {
			userTel: {
				required: true,
			},
			usercode: {
				required: true,
			},
		},
		messages: {
			userTel: {
				required: "手机号不能为空", //输入为空时的提示信息

			},
			usercode: {
				required: "验证码不能为空",
			},

		},
		submitHandler: function() {


		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());

		}

	});


	$('#next').on('click', function() {
		var veryCode = $('#get_user_code').val();
		var phone = document.getElementById('get_user_tel').value;
		console.log(veryCode);

		$.ajax({
			url: allurl1 + 'uusjs/checkVerificationCode.do',
			type: 'POST',
			dataType: 'json',
			data: {
				veryCode: veryCode
			},
			success: function(data) {
				console.log(data);
				if (data.MSG == "SUCCESS") {
					window.location = '../html/sjs_forget_password_edit.html?veryCode=' + veryCode + '&tel=' + phone;
				} else {
					alert(data.MSG)
				}
			}
		})
	})
}

function yzmclick_registerModal() {
	$('#click_verification').off("click", yzmclick_registerModal);
	var givetype = 1;
	var telvalue = $('#get_user_tel').val();
	// console.log(telvalue);
	var uuid = 'channel_pc';
	var getyzmcilck = document.getElementById('click_verification');
	if (telvalue != '') {
		var yzmoriginurl = allurl1 + 'uusjs/userVerificationCode.do';
		ajax(get_verification_code_url(yzmoriginurl, givetype, telvalue, uuid), function(data) {
			// console.log(data)
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
	var index_string = getresult(originurl, 'userVerificationCode', n1, n2, n3, '', '', 'type', 'userTel', 'uuid', '', '');
	console.log(index_string);
	return index_string;
}



// 设置图片
function addImg_ya(isrc, object, origin_src) {
	var origin_url = origin_src;
	var Img = new Image();
	Img.src = isrc;
	Img.onload = function() {
		object.src = isrc;
	}
	Img.onerror = function() {
		var url = allurl2 + add_url1 + origin_url.split('.')[0] + '_ya.jpg';
		addImg(url, object);
	}
}
// 设置图片
function addImg(isrc, object) {
	var Img = new Image();
	Img.src = isrc;
	Img.onload = function() {
		object.src = isrc;
	}
	Img.onerror = function() {
		object.src = '../img/default/rectangle.png';
	}
}

function addAvatar(isrc, object) {
	var Img = new Image();
	Img.src = isrc;
	Img.onload = function() {
		object.src = isrc;
	}
	Img.onerror = function() {
		object.src = '../img/default/default_avatar.png';
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