var hueScenes = [];

var myHomeApp = {
	repeaters : [],
	start : function(){
		// Display the current local time
		myHomeApp.initClock();
		// Get current weather info from OpenWeatherMap
		myHomeApp.weather.getCurrentWeather();
		// Get calendar events from public iCloud calendar
		myHomeApp.calendar.getCalEvents();
		// Get and display all lights connected to the hue bridge
		myHomeApp.hue.getLights();
		// Get and display scenes stored in the hue bridge
		myHomeApp.hue.getScenes();
		// Get live temperature from connected sensors
		myHomeApp.temperature.update();
		// Initialize update interval to keep temperature updated
		myHomeApp.temperature.startInterval();
		// Display temperature history chart from stored values in SQLITE database
		myHomeApp.temperature.getHistory();
		// Display news from RSS feed
		myHomeApp.news.loadNews();
	},
	getCurrentTime : function(){
		var date = new Date();
		var min = date.getMinutes();
		min = min < 10 ? "0" + min : min;
		var time = date.getHours() + ":" + min;
		return time;
	},
	temperature : {
		startInterval : function(timeout){
			setInterval(function(){
				myHomeApp.temperature.update();
			}, config.api.temperature.updateInterval);
		},
		update : function(){
			$.ajax({
				method: "GET",
				url: config.api.temperature.url
			}).done(function(dataSet){
				var tempContent = "";
				$.each(dataSet, function(index, data){
					tempContent += "<div class='big-number'><div class='label'>" + data.devicename + "</div><div class='number'>" + data.value + "°C</div>";
				});
				$("#live-temperature").html(tempContent);
			});
		},
		getHistory : function(){
			$.ajax({
				method: "GET",
				url: config.api.temperature.history.url,
				data: {
					limit: config.api.temperature.history.limit
				}
			}).done(function(response){
				if(response.success){
					myHomeApp.temperature.initHistoryChart(response.data);
				}else{
					alert("History data request failed");
				}
			});
		},
		initHistoryChart : function(data) {
			var themeColorDark = "rgba(0,0,0,0.8)";
			var themeColorWhite = "rgba(255,255,255,0.8)";

			var dataSetColors = ["#00C87E","#499bea"];

			var dataSets = [];
			var i = 0;

			$.each(data, function(index, sensor){
				var dataArray = [];
				$.each(sensor, function(index, temp){
					var arr = temp.timestamp.split(/[- :]/);
					date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

					dataArray.push({
						x: date,
						y: temp.degree
					});
				});

				var color = dataSetColors[i];

				var dataSet = {
					type: "line",
					showInLegend: true,
					legendText: sensor.devicename,
					color: color,
					dataPoints: dataArray
				};
				dataSets.push(dataSet);
				i++;
			});


			var options = {
				legend: {
					fontSize: 16,
					fontFamily: "Roboto, Arial",
					fontWeight: 300
				},
				backgroundColor: "transparent",
				zoomEnabled: true,
				animationEnabled: true,
				toolTip: {
					fontColor: themeColorDark,
					content: "{x} - {y}°C"
				},
				title: {

				},
				axisX: {
					valueFormatString: "DD.MM. hh:mm",
					labelFontColor: themeColorDark,
					lineColor: themeColorDark,
					gridColor: "rgba(0,0,0,0.2)",
					tickColor: "rgba(0,0,0,0.2)",
					tickLength: 10
				},
				axisY: {
					includeZero: false,
					labelFontColor: themeColorDark,
					lineColor: themeColorDark,
					gridColor: "rgba(0,0,0,0.2)",
					tickColor: "rgba(0,0,0,0.2)",
					tickLength: 10,
					interval:1,
					labelFormatter: function ( e ) {
						return e.value + "°C";
					}
				},
				data: dataSets
			};
			$("#chart-container").CanvasJSChart(options);
		}
	},
	stopUpdateRepeater : function(receiverId){
		clearInterval(this.repeaters[receiverId]);
	},
	weather : {
		getCurrentWeather : function(){
			$.ajax({
				method: "GET",
				url: config.api.weather.url,
				data: {
					id: "2806946",
					cnt: 3,
					units: "metric",
					lang: "de",
					appid: config.api.weather.appId
				}
			}).done(function(currentWeatherData) {
				var days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
				var weatherContent = "";
				count = 1;

				$.each(currentWeatherData.list,function(index, day){
					d = new Date(day.dt*1000);
					n = d.getDay();

					weatherContent += "<li><div class='info row'><div class='col-xs-6 date'>";

					if(count == 1){
						weatherContent += "Heute";
					}else if(count == 2){
						weatherContent += "Morgen";
					}else if(count == 3){
						weatherContent += days[n];
					}

					weatherContent += "</div><div class='col-xs-6 location'>" + day.weather[0].description + "</div></div>";
					weatherContent += "<div class='degree row'><div class='col-xs-6 degree-inner'>" + Math.round(day.temp.day) + "°C</div>";
					weatherContent += "<div class='degree-min-max col-xs-6'>";
					weatherContent += "<div class='degree-max'>" + Math.round(day.temp.max*10)/10 + "°C</div>";
					weatherContent += "<div class='degree-min'>" + Math.round(day.temp.min*10)/10 + "°C</div>";
					weatherContent += "</div></div>";
					//weatherContent += "<div class='weather-icon'><img src='http://openweathermap.org/img/w/" + day.weather[0].icon + ".png'></div>";
					weatherContent += "</li>";
					count++;
				});

				$("#weather").html(weatherContent);
			});
		}
	},
	initClock : function(){
		$(".data-placeholder[data-placeholder-id='current-time']").text(myHomeApp.getCurrentTime());
		var clock = setInterval(function(){
			$(".data-placeholder[data-placeholder-id='current-time']").text(myHomeApp.getCurrentTime());
		},5000);
	},
	calendar : {
		getCalEvents : function(){
			// get all calendar events
			new ical_parser(config.api.calendar.url, function(cal) {
				var events = cal.getFutureEvents();

				events.sort(function(a,b){
					return a.DTSTART-b.DTSTART;
				});

				myHomeApp.calendar.showCalEvents(events, 5);
			});
		},
		showCalEvents : function(events, count){
			// display all calendar events
			events = events.slice(0,count);
			var today = myHomeApp.getDate(0);
			var tomorrow = myHomeApp.getDate(1);
			var tempDate = "";
			var eventContent = "";

			$.each(events, function(i,calEvent){
				var startDateText = "";

				if(tempDate != calEvent.start_date){
					switch(calEvent.start_date){
						case today: startDateText = "Heute"; break;
						case tomorrow: startDateText = "Morgen"; break;
						default: startDateText = calEvent.start_date_long_no_year; break;
					}

					tempDate = calEvent.start_date;
				}

				var location = calEvent.LOCATION !== undefined ? "<div class='col-xs-7 location'>" + calEvent.LOCATION + "</div>" : "";

				eventContent += "<li><div class='info'>";
				eventContent += "<div class='row'><div class='col-xs-5 date'>" + startDateText + " - " + calEvent.start_time + "</div>" + location.replace("Oberwolfach,","");
				eventContent += "</div></div><div class='summary'>" + calEvent.SUMMARY + "</div></li>";
			});
			$("#calendar").html(eventContent);
		}
	},
	getDate : function(offset){
		// get a date with offset (days)
		var date = new Date();
		dateWithOffset = new Date(date);
		dateWithOffset.setDate(date.getDate() + offset);

		var dd = dateWithOffset.getDate();
		var mm = dateWithOffset.getMonth()+1;
		var yyyy = dateWithOffset.getFullYear();

		if(dd < 10){
			dd = '0' + dd;
		}
		if(mm < 10){
			mm = '0' + mm;
		}

		var day = dd + '.' + mm + '.' + yyyy;

		return day;
	},
	hue : {
		getLights : function(){
			// get and display all lights
			$.ajax({
				method: "GET",
				url: config.api.hue.url,
				data: {
					"action":"get-lights"
				}
			}).done(function(lights) {
				if(lights){
					var lightsContent = "";
					$.each(lights, function(index, light){
						var lightState = light.state.on === true ? "on" : "";
						var lightHexColor = colors.CIE1931ToHex(light.state.xy[0], light.state.xy[1], 1);

						lightsContent += "<li class='light " + lightState + "' data-state='" + light.state.on + "' data-id='" + (parseInt(index,10)) + "'>";
						lightsContent += "<span class='toggle'></span>" + light.name;
						lightsContent += "<span data-light-id='" + index + "' data-color='#" + lightHexColor + "' class='light-color-picker'></span>";
						lightsContent += "</li>";

					});
					$("#lights").html(lightsContent);

					myHomeApp.hue.initLightToggle();

					$('.light-color-picker').each(function(){
						var color = $(this).data("color");
						var light = $(this).data("light-id");

						$(this).minicolors({
							defaultValue: color,
							changeDelay: 200,
							position: "bottom right",
							control: "brightness",
							change: function(value, opacity) {
								var val = value.replace("#","");
								var newColor = colors.hexToCIE1931(val);
								myHomeApp.hue.setLightColor(light, newColor);
							}
						});
					});
				}
			});
		},
		initLightToggle : function(){
			$("#lights .light").on("click", ".toggle", function(){
				// toggle lights on and off
				var light = $(this).parent();
				var id = light.data("id");
				var newState = light.attr("data-state") == "true" ? false : true;
				myHomeApp.hue.toggleLight(id, newState);
			});
		},
		getScenes : function(){
			// get and display all scenes
			$.ajax({
				method: "GET",
				url: config.api.hue.url,
				data: {
					"action":"get-scenes"
				}
			}).done(function(scenes) {
				if(scenes){
					hueScenes = scenes;

					$.each(scenes, function(index, scene){
						$("#scenes").append("<li data-id='" + index + "'>" + scene.name.replace("on 0","").replace("on 1","") + "</li>");
					});

					$("#scenes li").click(function(){
						myHomeApp.hue.setScene($(this).data("id"));
					});
				}
			});
		},
		setScene : function(sceneId){
			
			$.ajax({
				method: "GET",
				url: config.api.hue.url,
				data: {
					"action":"set-scene",
					"scene-id": sceneId
				}
			}).done(function(response) {
				setTimeout(function(){
					myHomeApp.hue.getLights();
				},1500);
			});
		},
		toggleLight : function(id, state){
			var light = $("#lights").find(".light[data-id='" + id + "']");

			$.ajax({
				method: "GET",
				url: config.api.hue.url,
				data: {
					"action":"toggle-light",
					"light-state": state,
					"light-id": id
				},
				dataType: "json",
			}).done(function(response){
				if(response[0].success){
					// success
					light.attr("data-state", state).toggleClass("on",state);
				}else{
					// error
					console.log(response[0].error.description);
				}
			});
		},
		setLightColor : function(id, color){
			$.ajax({
				method: "GET",
				url: config.api.hue.url,
				data: {
					"action": "set-color",
					"on":true,
					"light-id": id,
					"x": color[0],
					"y": color[1]
				},
				dataType: "json",
			}).done(function(response){
				//console.log(response);
			});
		}
	},
	news : {
		loadNews : function(){
			$.ajax({
				method: "GET",
				url: config.api.news.url,
				data: {
					feedUrl: config.api.news.feedUrl,
					count: config.api.news.count
				},
				dataType: "json",
			}).done(function(feed){
				var newsfeed = "";
				$.each(feed, function(index, entry){
					newsfeed += "<li><a href='" + entry.link + "' target='_blank'><div class='date'><div class='info'>" + entry.date + "</div></div>";
					newsfeed += "<div class='summary'>" + entry.title + "</div></a></li>";
				});
				$("#news-feed").html(newsfeed);
			});
		}
	}
};

myHomeApp.start();