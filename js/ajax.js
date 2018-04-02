
function ajax(url,fn){
    // var oXHR = new XMLHttpRequest();
    var oXHR = null;
	if(window.XMLHttpRequest){
		oXHR = new XMLHttpRequest();
	}else{
		oXHR =new ActiveXObject("Microsoft.XMLHTTP");
	}
    
    oXHR.open('GET', url);
    oXHR.setRequestHeader('If-Modified-Since','0'); 
    oXHR.send(null);
    oXHR.onreadystatechange = function(){
        if(oXHR.readyState==4){
            if(oXHR.status==200){
                var text = oXHR.responseText;
                var title = getTitle(text);
                fn(title);
                // alert(title.MSG);
            }else{
                // alert('网络连接不好,请稍后再试')
            }
        }
    }
}
function getTitle(text) {
  var text=JSON.parse(text);
  return text;
}