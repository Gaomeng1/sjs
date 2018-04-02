var LocString = String(window.document.location.href);

function GetQueryString(str) {
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
        tmp;
    if (tmp = rs) return tmp[2];
    return "";
}
var _flag = decodeURI(GetQueryString('flag'));

jQuery(document).ready(function() {
    if (_flag != undefined && _flag != '' && _flag != null) {

    } else {

    }



});

// 记得密码
$('#remember_btn').on('click', function() {
    if($('#passwordBtn').val()==''){
        layer.alert('请输入原始密码');
    }else{
        var primary_Password = hex_md5($('#passwordBtn').val());
        $.ajax({
            url: allurl1 + 'uusjs/security/userPayPassword.do',
            type: 'POST',
            dataType: 'json',
            data: {
                type: '4',
                oldPayPassword: primary_Password
            },
            success: function(data) {
                // console.log(data);
                if (data.MSG == "SUCCESS") {
                    window.location='sjs_set_password_one.html?typeFlag=2&password='+primary_Password;

                } else if (data.STATUS == 3) {
                    window.location = 'sjs_load.html';
                } else {
                    layer.alert(data.MSG)
                }
            }
        })
    }

})