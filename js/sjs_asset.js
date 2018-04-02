var LocString = String(window.document.location.href);

function GetQueryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) return tmp[2];
	return "";
}
var _flag = decodeURI(GetQueryString('flag'));

jQuery(document).ready(function($) {
	// 获取cookie
	get_cookie();


});

// 获取cookie
function get_cookie() {
	var flag = getCookie('sjs_stats_flag');

	if (flag != '') {

		if (flag == '1') {
			$('.asset_old').show().siblings().hide();
		} else if (flag == '2') {
			$('.asset_new').show().siblings().hide();
		}
	} else {
		window.location = 'sjs_load.html';
	}
}