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
	//init the chart
	$(function() {
		$('input,textarea').placeholder();
	});

	// 获取验证码
	verification_code();

	// 点击事件
	get_click();

}

function get_click() {
	$('.click_code').on('click', function() {
		verification_code();
	})


	$('#get_user_password,.m_click_code input').focus(function(event) {
		$(this).val('');

		$('#user_load').removeAttr('disabled');
	});
	
	$('#get_user_password,.m_click_code input').change(function(event) {
		$('#user_load').removeAttr('disabled');
	});

	$("#loadForm").validate({
		rules: {
			userTel: {
				required: true,
			},
			userPassword: {
				required: true,
			},
			userCode: {
				required: true,
			}

		},
		messages: {
			userTel: {
				required: "请输入用户名", //输入为空时的提示信息
			},
			userPassword: {
				required: "请输入密码", //输入为空时的提示信息
			},
			userCode: {
				required: "请输入验证码", //输入为空时的提示信息
			}

		},
		submitHandler: function(form) {
			get_load(form.userTel.value, form.userPassword.value, form.userCode.value);
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}
	});



}

// 获取验证码
function verification_code() {
	var xhr = new XMLHttpRequest();
	xhr.open("post", allurl1 + 'uusjs/validateCode.do', true);
	xhr.responseType = "blob";
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send();
	xhr.onload = function() {
		if (this.status == 200) {
			var blob = this.response;
			// console.log(blob)
			var img = document.getElementById('code_img');
			img.onload = function(e) {
				window.URL.revokeObjectURL(img.src);
			};
			img.src = window.URL.createObjectURL(blob);
		}
	};
}

// 用户登陆
function get_load(userTel, userPassword, verycode) {
	var password = hex_md5(userPassword);
	var tags_url = allurl1 + 'uusjs/security/PCUserLogin.do';
	ajax(get_load_url(tags_url, userTel, password, verycode), function(data) {
		// console.log(data);
		if (data.STATUS == '0') {
			if (data.OBJECT != null) {

				window.location = '../index.html';

				var Avatar = data.OBJECT.userAvatar;
				var userId = data.OBJECT.userId;
				var userName = data.OBJECT.userName;
				var userTel = data.OBJECT.userTel;
				var userPayStats = data.OBJECT.userPayStats;

				addCookie(Avatar, userName, userTel, userPayStats);
			}
		}else {
			verification_code();

			$('<label id="get_user_password-error" class="error" for="get_user_password" style="display: inline-block;">' + data.MSG + '</label>').appendTo($('.user_password'));

			$('#user_load').attr({
				'disabled': ''
			});

		}
	});
}


//get url
function get_load_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, '/security/PCUserLogin', n1, n2, n3, '', '', 'userTel', 'userPassword', 'verycode', '', '');
	console.log(index_string);
	return index_string;
}


// 保存cookie
function addCookie(avatar, name, tel, stats) {
	var avatar = escape(avatar);
	var name = escape(name);
	var tel = escape(tel);
	var stats = escape(stats);

	document.cookie = "sjs_load_avatar=" + avatar + ';path=/';
	document.cookie = 'sjs_load_name=' + name + ';path=/';
	document.cookie = 'sjs_load_tel=' + tel + ';path=/';
	document.cookie = 'sjs_stats_flag=' + stats + ';path=/';
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