console.log(allurl1)

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
var very_Code = decodeURI(Request['veryCode']);
var city = decodeURI(Request['city']);
var iphone = decodeURI(Request['tel']);

window.onload = function() {


	get_click();


}



function get_click() {
	$("#passwordForm").validate({
		rules: {
			get_password: {
				required: true,
			},
			again_password: {
				required: true,
				equalTo: '#get_password'
			}

		},
		messages: {
			get_password: {
				required: "请输入用户名", //输入为空时的提示信息
			},
			again_password: {
				required: "请输入密码",
				equalTo: "两次密码输入不一致"
			}

		},
		submitHandler: function(form) {
			get_registration_func(form.again_password.value,very_Code,city,iphone)
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}
	});

}


// 注册
function get_registration_func(Password, veryCode, country, userTel) {
	var password = hex_md5(Password);
	var tags_url = allurl1 + 'uusjs/security/userRegister.do';
	ajax(get_registration_url(tags_url, password, veryCode, 'pc_uuid', country, userTel), function(data) {
		console.log(data)
		if (data.MSG == 'SUCCESS') {
			if (data.OBJECT == null || data.OBJECT == '') {
				alert('验证码已过期！')
			} else {
				alert('注册成功');
				window.location = 'sjs_load.html';
			}
		} else {
			alert(data.MSG);
		}
	});
}
//get url
function get_registration_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, '/security/userRegister', n1, n2, n3, n4, n5, 'userPassword', 'veryCode', 'uuid', 'mobileCountryCode', 'userTel');
	console.log(index_string);
	return index_string;
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