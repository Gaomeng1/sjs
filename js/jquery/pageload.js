// author lukai
//date 2016-10-08
$.load={
	pre:function(options){
		var defaults={
			delayTime:500,
			sleep:0,
			start:50,
			state:98,
		};
		//补充参数
		var options=$.extend({},defaults,options);
		//定义html实体
		if($("#pre-load").length==0){
			var load_html="<div class='load-wrap'><div id='pre-load'></div></div>";
			//定义load效果
			$("body").append(load_html);
		}
		//监听加载状态
		function load(options){
			var loadingMask=$("#pre-load");
			$({property: options.start}).animate({property: options.state},{
				duration: 1000,
				step:function(){
                    var percentage = Math.round(this.property);
                    loadingMask.css('width', percentage + "%");
                    //页面加载后执行
                   	if(percentage==100){
                        setTimeout(function(){
                            loadingMask.animate({"opacity": 0},options.delayTime,
                            	function() {
                                    $(this).parent('.load-wrap').remove();
                                    console.log('Loading has been successful');
                                });
                            },
                        options.sleep);
                   	};
				}
			})
		}
		load(options);
	}
}