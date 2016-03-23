<!doctype html>
<html lang="en">
<head>
	<title>myHome</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<!-- non-retina iPhone vor iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon.png" sizes="57x57">
	<!-- non-retina iPad vor iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon-72.png" sizes="72x72">
	<!-- non-retina iPad iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon-76.png" sizes="76x76">
	<!-- retina iPhone vor iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon@2x.png" sizes="114x114">
	<!-- retina iPhone iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon-60@2x.png" sizes="120x120">
	<!-- retina iPad vor iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/icon144.png" sizes="144x144">
	<!-- retina iPad iOS 7 -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon-76@2x.png" sizes="152x152">
	<!-- retina iPad iOS 7 für iPhone 6 Plus -->
	<link rel="apple-touch-icon" href="/css/images/appicons/Icon-60@3x.png" sizes="180x180">

	<!-- iPhone 6 -->
	<link href="/css/images/startupscreen/startup-screen.png" media="(device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">

	<link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/jquery.minicolors.css">
	<link rel="stylesheet" href="css/style.css">
</head>
<body>
	<div class="myhome-wrapper">
		<div id="current-time" class="data-placeholder" data-placeholder-id="current-time"></div>

		<div class="row">

			<div class="col-xs-12 col-sm-12 col-md-8 col-lg-6">
				<div class="desktop-area temperature">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Temperatur</div>
						<div class="content">
							<div class="row">
								<div class="col-sm-4" id="live-temperature"></div>
								<div class="col-sm-8">
									<div class="label">Verlauf</div>
									<ul id="chart-container" style="height:240px;"></ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>		
			
			

			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<div class="desktop-area weather">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Wetter</div>
						<div class="full-width-content">
							<ul id="weather" class="item-list">
								<div class="spinner">
									<div class="bounce1"></div>
									<div class="bounce2"></div>
									<div class="bounce3"></div>
								</div>
							</ul>
						</div>
					</div>		
				</div>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<div class="desktop-area camera">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Kamera</div>
						<div class="content camera-content">
							<div class="red-dot"></div>
							<img src="css/images/floor.jpg">
						</div>
					</div>	
				</div>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<div class="desktop-area light">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Beleuchtung</div>
						<div class="full-width-content">
							<ul id="lights"></ul>

							<ul id="scenes"></ul>
						</div>
					</div>
				</div>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<div class="desktop-area calendar">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Kalender</div>
						<div class="full-width-content">
							<ul id="calendar" class="item-list">
								<div class="spinner">
									<div class="bounce1"></div>
									<div class="bounce2"></div>
									<div class="bounce3"></div>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</div>		

			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<div class="desktop-area news">
					<div class="desktop-area-inner">
						<div class="title"><div class="icon"></div>Nachrichten</div>
						<div class="full-width-content">
							<ul id="news-feed" class="item-list">
								<div class="spinner">
									<div class="bounce1"></div>
									<div class="bounce2"></div>
									<div class="bounce3"></div>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</div>			
		</div>

	</div>
	
	<script src="js/config.js"></script>
	<script src="js/libs/jquery-2.2.1.min.js"></script>
	<script src="js/libs/jquery.minicolors.min.js"></script>
	<script src="js/libs/jquery.canvasjs.min.js"></script>
	<script src="js/libs/ical_parser.js"></script>
	<script src="js/hue.js"></script>
	<script src="js/functions.js"></script>
</body>
</html>