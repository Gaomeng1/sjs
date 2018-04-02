var LocString = String(window.document.location.href);

function GetQueryString(str) {
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
        tmp;
    if (tmp = rs) return tmp[2];
    return "";
}

var _Flag =decodeURI(GetQueryString('htmlFlag'));
var _typeFlag = Number(decodeURI(GetQueryString('typeFlag')));


console.log(_Flag)

//页面加载完成时
jQuery(document).ready(function($) {

    //获取cookie
    get_cookie();

    $('.asset_content_top').show();

});


// 获取cookie
function get_cookie() {
    var tel = getCookie('sjs_load_tel');
    var flag = getCookie('sjs_stats_flag');

    if (tel != '' && tel != null) {
        var myphone = tel.substr(3, 4);
        var lphone = tel.replace(myphone, "****");

        $('.usertel').html(lphone)

        verification_code(tel);
    }
    if (flag != '' && tel != null) {

        if (flag == '1') {
            $('.asset_old').show().siblings().hide();
        } else if (flag == '2') {
            $('.asset_new').show().siblings().hide();
        }
    } else {
        window.location = 'sjs_load.html';
    }
}
//获取支付验证码
function verification_code(tel) {
    $('#click_obtain').on('click', function() {
        $(this).hide().parent().find('input').show().siblings('label').css({
            'opacity': '1'
        });
        $.ajax({
            url: allurl1 + 'uusjs/userVerificationCode.do',
            type: 'POST',
            dataType: 'json',
            data: {
                type: '5',
                userTel: tel,
                uuid: 'channel_pc'

            },
            success: function(data) {
                // console.log(data);
            }
        })



    })
}


// 忘记密码 按钮
$('.Next_step').on('click', function() {
    if ($('.forget_password input').val() != '' && $('#click_obtain').is(':hidden') == true) {
        $.ajax({
            url: allurl1 + 'uusjs/checkVerificationCode.do',
            type: 'POST',
            dataType: "json",
            data: {
                veryCode: $('.forget_password input').val()
            },
            success: function(data) {
                console.log(data);
                if (data.STATUS == '0') {
                    window.location='sjs_set_password_one.html?typeFlag=1&htmlFlag='+_Flag+'&code='+$('#passwordcode').val();
                } else if (data.STATUS == 3) {
                    window.location = 'sjs_load.html';
                } else {
                    alert_model(data.MSG);
                }
            }
        })
    }
})

$('#forgetPassword').on('click', function() {
    $('.forget_password').show().siblings().hide();

    type_flag = 1;
})



//提示弹框样式
function alert_model(ele) {
    layer.open({
        title: false,
        skin: 'alert_modal', //样式类名
        closeBtn: 0, //不显示关闭按钮
        shift: 2,
        area: ['260px', 'auto'],
        shadeClose: true, //开启遮罩关闭
        content: ele + '<p><button type="button" class="active">确定</button></p>',
        btn: []
    });

    $('.alert_modal button').on('click', function () {
        setTimeout(function () {
            layer.closeAll();
        }, 1);
    })
}