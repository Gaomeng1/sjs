console.log(allurl1)

function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
		} 
	}
	return theRequest;
} 
var Request = new Object(); 
Request = GetRequest();
var the_Code=decodeURI(Request['Code']);
var the_orderid=decodeURI(Request['orderid']);
var the_money=decodeURI(Request['money']);




jQuery(document).ready(function($) {
	sweep_code();

});



// 扫码支付
function sweep_code(){
	$('.sjs_recharge_payment h5').html('充值金额'+the_money+'元');

	$('.sjs_recharge_payment img').prop('src',allurl2+the_Code);

}


// function get_button(){
// 	$('.payment .payment_label').each(function(){
// 		var index=$(this).index()-1;

// 		$('.payment .payment_label').eq(index).on('click',function(){
// 			$(this).find('i').addClass('active').parent().siblings().find('i').removeClass('active');
// 		})

// 	});


// 	$('#recharge_wx').on('click',function(){
// 		console.log($('#recharge_money').val());
// 		get_recharge_wx($('#recharge_money').val())

// 	})
// }






// 资产管理
// function get_recharge() {
// 	var tags_url = allurl1 + 'uusjs/publishInformation.do';
// 	ajax(get_recharge_url(tags_url), function(data) {
// 		console.log(data)
// 		if (data.MSG = 'SUCCESS') {
// 			$('.recharge span').html(data.OBJECT.userPurse);
// 		} else {
// 			alert(data.MSG)
// 		}
// 	});
// }


// //get url
// function get_recharge_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
// 	var index_string = getresult(originurl, 'publishInformation', '', '', '', '', '', '', '', '', '', '');
// 	console.log(index_string);
// 	return index_string;
// }


// // 获取微信充值二维码
// function get_recharge_wx(rechargeMoney) {
// 	var tags_url = allurl1 + 'uusjs/qrcodeWxCharge.do';
// 	ajax(get_recharge_wx_url(tags_url,rechargeMoney), function(data) {
// 		console.log(data)
// 		if (data.MSG = 'SUCCESS') {
// 			var money = hex_md5(rechargeMoney);
// 			var code_img=data.OBJECT.fileName;
// 			var code_orderid=data.OBJECT.orderId;

// 			window.location='sjs_recharge_payment.html?code='+code_img+'&orderid='+code_orderid+'&money='+money;
// 		} else {
// 			alert(data.MSG)
// 		}
// 	});
// }


// //get url
// function get_recharge_wx_url(originurl, n1, n2, n3, n4, n5, m1, m2, m3, m4, m5) {
// 	var index_string = getresult(originurl, 'publishInformation',n1, '', '', '', '', 'rechargeMoney', '', '', '', '');
// 	console.log(index_string);
// 	return index_string;
// }




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

