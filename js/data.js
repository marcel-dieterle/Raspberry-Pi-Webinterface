var appData = {
	currentTime : function(){
		var date = new Date();
		var min = date.getMinutes();
		min = min < 10 ? "0" + min : min;
		var time = date.getHours() + ":" + min;
		return time;
	}
};