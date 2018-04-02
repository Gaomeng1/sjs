var LocString = String(window.document.location.href);

function GetQueryString(str) {
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
        tmp;
    if (tmp = rs) return tmp[2];
    return "";
}
var _flag = decodeURI(GetQueryString('htmlFlag'));
var _typeFlag = Number(decodeURI(GetQueryString('typeFlag')));
var _typeCode = Number(decodeURI(GetQueryString('code')));
var _typePassword = decodeURI(GetQueryString('password'));


//_flag==2  充值尚未设置支付密码  _flag==3  交易尚未设置支付密码  _flag==4  提现成功提交页面
//_typeFlag 支付密码的状态  0是尚未设置  1是忘记密码  2是修改密码

console.log(_flag)

jQuery(document).ready(function($) {
    // 验证表单
    Verification();

    // 页面点击函数
    click_func();

    // 获取cookie
    get_cookie();

    if(_typeFlag==0){
        $('.new_asset_top').show();
        $('.asset_content_top').hide();
    }else{
        $('.asset_content_top').show();
        $('.new_asset_top').hide();
    }

});


// 新用户设置密码表单验证
function Verification() {
    $('#defaultForm').validate({
        debug: true,
        onSubmit: false,
        rules: {
            password_one: {
                required: true,
                minlength: 6,
            },
            password_two: {
                required: true,
                minlength: 6,
                equalTo: "#password_one"
            },
        },
        messages: {
            password_one: {
                required: "支付密码不能为空", //输入为空时的提示信息
                minlength: '密码为6位数字',
            },
            password_two: {
                required: "支付密码不能为空",
                minlength: '密码为6位数字',
                equalTo: "两次密码输入不一致"

            },
        },
        submitHandler: function() {
            // 设置密码的状态
            if (_typeFlag == 0) {
                var newPassword = hex_md5($('#password_two').val());
                $.ajax({
                    url: allurl1 + 'uusjs/security/userPayPassword.do',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        type: '1',
                        userPayPassword: newPassword
                    },
                    success: function(data) {
                        // console.log(data);
                        if (data.STATUS == "0") {
                            if (_flag != undefined && _flag != '' && _flag != null) {
                                window.location='sjs_set_password_two.html?htmlFlag='+_flag;
                            } else {
                                window.location='sjs_set_password_two.html';
                            }

                            addCookie(1);

                        } else if (data.STATUS == 3) {
                            window.location = 'sjs_load.html';
                        } else {
                            layer.alert(data.MSG)
                        }
                    }
                })
            } else if (_typeFlag == 1) {
                var modifyPassword = hex_md5($('#password_one').val());
                $.ajax({
                    url: allurl1 + 'uusjs/security/userPayPassword.do',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        type: '3',
                        userPayPassword: modifyPassword,
                        veryCode: _typeCode,
                    },
                    success: function(data) {
                        // console.log(data);
                        if (data.STATUS == "0") {
                            window.location='sjs_set_password_two.html?htmlFlag='+_flag;
                        } else if (data.STATUS == 3) {
                            window.location = 'sjs_load.html';
                        } else {
                            layer.alert(data.MSG)
                        }
                    }
                })
            } else {
                var resetPassword = hex_md5($('#password_one').val());
                var primaryPassword = _typePassword;
                $.ajax({
                    url: allurl1 + 'uusjs/security/userPayPassword.do',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        type: '2',
                        oldPayPassword: primaryPassword,
                        newPayPassword: resetPassword
                    },
                    success: function(data) {
                        // console.log(data);
                        if (data.MSG == "SUCCESS") {
                            window.location='sjs_set_password_two.html';
                        } else if (data.STATUS == 3) {
                            window.location = 'sjs_load.html';
                        } else {
                            layer.alert(data.MSG);
                        }
                    }
                })
            }
        }

    });


}

// 获取cookie
function get_cookie() {
    var tel = getCookie('sjs_load_tel');
    console.log(tel)
    if (tel != '' && tel != null) {
        var myphone = tel.substr(3, 4);

        var lphone = tel.replace(myphone, "****");

        $('.usertel').html(lphone)

    }
}


// 选择密码状态
function click_func() {
    if (_flag != undefined && _flag != '' && _flag != null) {
        if (_flag == '2') {
            $('.success_foot').show().find('a').html('去交易');

        } else if(_flag == '3'){
            $('.success_foot').show().find('a').html('立即充值');
        }else if(_flag=='4'){
			$('.success_top').html('<img src="../img/asset/recharge.png" alt="">提现提交成功');
        }

    } else {

    }


    //判断设置成功后的状态
    $('.success_foot a').on('click', function() {
        if (_flag == '2') {
            window.location = 'sjs_transaction_buy.html';
        } else {
            window.location = 'sjs_wallet.html?clickFlag=3';
        }
    })


}




// 保存cookie
function addCookie(stats) {
    var stats = escape(stats);

    document.cookie = 'sjs_stats_flag=' + stats + ';path=/';
}