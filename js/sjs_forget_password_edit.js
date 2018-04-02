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
var tel = decodeURI(Request['tel']);

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
			get_registration_func(form.again_password.value, tel, very_Code)
		},
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().last());
		}
	});

}


// 修改密码
function get_registration_func(Password, userTel, veryCode) {
	var password = hex_md5(Password);
	var tags_url = allurl1 + 'uusjs/userForgetPassword.do';
	ajax(get_registration_url(tags_url, password, userTel, veryCode), function(data) {
		// console.log(data)
		if (data.MSG = 'SUCCESS') {
			window.location = 'sjs_load.html';
		} else {
			alert(data.MSG);
		}
	});
}
//get url
function get_registration_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'userForgetPassword', n1, n2, n3, '', '', 'userPassword', 'userTel', 'veryCode', '', '');
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