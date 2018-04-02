console.log(allurl2)
jQuery(document).ready(function($) {
	// 获取头像
	init_cookie();

	// 点击事件
	get_click();
});


function get_click() {
	$('#release_btn').on('click',function(){
		// alert(33)
		get_Logout();
	})

	

	f_rand();

}


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


// 获取cookie
function init_cookie(){
	var avatar=getCookie('sjs_load_avatar');	
	if(avatar!=null&&name!=null){
		show_load_data(avatar,name);
	}
}

// 登陆注册隐藏  用户显示
function show_load_data(avatar,name){
	//登陆和注册消失
	$('#pc_user_load').parent('li').hide();
	$('#pc_user_register').parent('li').hide();
	//用户信息显示
	$('#user_avatar,#release_btn').show();
	load_message(avatar,name);
}


// 登陆和注册显示 用户隐藏
function hide_load_data(){
	//登陆和注册显示
	$('#pc_user_load').parent('li').show();
	$('#pc_user_register').parent('li').show();
	//用户隐藏
	$('#release_btn,#user_avatar').hide();
}



/////modal初始化结束,登陆成功后函数
function load_message(avatar,name){
	//头像avatar
	var avatar_png_url=allurl2+avatar;
	//名字name
	if(name==''){
		name='小U';
	}
	var name_value=name;
	console.log(avatar_png_url)
	///
	var user_avatar_obj=document.getElementById('user_avatar');
	addAvatar(avatar_png_url,user_avatar_obj);
	///
	$('#user_name').html(name_value);

}


function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return null;
	}
}


function delCookie(name){ 
    var exp=new Date(); 
    exp.setTime(exp.getTime()-1); 
    var cval=getCookie(name);
    if(cval!=null){
        document.cookie=name+"="+cval+";expires="+exp.toGMTString()+";path=/";
        //init the unload;
        hide_load_data();
    }
} 


function load_out_cookie(){
	//useravatar
	delCookie('sjs_load_avatar');
	delCookie('sjs_load_name');
	delCookie('sjs_load_tel');
	delCookie('sjs_stats_flag');
}



// 获取_ya图片
function addImg_ya(isrc,object,origin_src){
	var origin_url=origin_src;
	var Img=new Image();
	Img.src=isrc;
	Img.onload = function (){
		object.src=isrc;
	}
	Img.onerror=function(){
		var url=add_url1+origin_url.split('.')[0]+'_ya.jpg';
		addImg(url,object);
	}
}
// 设置图片
function addImg(isrc,object){
	var Img=new Image();
	Img.src=isrc;
	Img.onload = function (){
		object.src=isrc;
	}
	Img.onerror=function(){
		object.src='../img/default/rectangle.png';
	}
}
function addAvatar(isrc,object){
	var Img=new Image();
	Img.src=isrc;
	Img.onload = function (){
		object.src=isrc;
	}
	Img.onerror=function(){
		object.src='../img/default/default_avatar.png';
	}
}








// 用户详细资料
// function get_detailed_information(investorsCode){
// 	var tags_url = allurl1 + 'uusjs/queryInvestorsInfo.do';
// 	ajax(get_detailed_information_url(tags_url, investorsCode), function(data) {
// 		console.log(data)
// 		if (data.MSG = 'SUCCESS') {
			
// 		} else {

// 		}
// 	});
// }


// //get url
// function get_detailed_information_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
// 	var index_string = getresult(originurl, 'queryInvestorsInfo', n1, '', '', '', '', 'investorsCode', '', '', '', '');
// 	console.log(index_string);
// 	return index_string;
// }


// 退出登陆
function get_Logout() {
	var tags_url = allurl1 + 'uusjs/userLogout.do';
	ajax(get_Logout_url(tags_url), function(data) {
		console.log(data)
		if (data.MSG = 'SUCCESS') {
			load_out_cookie();

			window.location='sjs_load.html';
		} else {
			alert(data.MSG);
		}
	});
}


//get url
function get_Logout_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
	var index_string = getresult(originurl, 'orderReservations', '', '', '', '', '', '', '', '', '', '');
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