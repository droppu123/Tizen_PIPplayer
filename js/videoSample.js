var bigVideo, smallVideo; // html element

// 3. This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var bigPlayer, smallPlayer, cover;

var bigH = 300, bigW = 500, bigID = 'T5g-vxKW1tc';
var smallH = 100, smallW = 150, smallID = 'Dtt0Gp78uuE';

function onYouTubeIframeAPIReady() {
	bigPlayer = new YT.Player('player1', {
		height : bigH,
		width : bigW,
		videoId : bigID,
		playerVars : {
			html5: 1,
			autoplay : 1,
			controls : 2,
			rel : 0, // 재생 끝나고 관련영상
			showinfo : 0,
			enablejsapi : 1, // enable javascript api
			fs : 0 // off full screen
		},
		events : {
			'onReady' : function(event) {
				onPlayerReady(event);
			},
			'onStateChange' : onPlayerStateChange,
			'onError' : onPlayerError
		}
	});

	smallPlayer = new YT.Player('player2', {
		height : smallH,
		width : smallW,
		videoId : smallID,
		playerVars : {
			html5: 1,
			autoplay : 1,
			controls : 2,
			rel : 0,
			showinfo : 0,
			enablejsapi : 1,
			fs : 0 // off full screen
		},
		events : {
			'onReady' : function(event) {
				onPlayerReady(event);
				event.target.mute();
			},
			'onStateChange' : onPlayerStateChange,
			'onError' : onPlayerError
		}
	});

	cover = document.getElementById('cover');
	cover.addEventListener('click', function() {
		//var p1Time = bigPlayer.getCurrentTime().toFixed(2); // 소수점 두 자리
		//var p2Time = smallPlayer.getCurrentTime().toFixed(2);

		//player1.loadVideoById(p2ID, p2Time, "small");
		//player2.loadVideoById(p1ID, p1Time, "small");
		
		togglePlayers();
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	console.log('video ready');
	event.target.setPlaybackQuality('small');
	
	if(event.target.getPlayerState() == -1) {
		console.log('not started');
		reloadVideo(event.target);
	}
}

function onPlayerStateChange(event) {
	var state = event.target.getPlayerState();
	
	console.log(event.target, state);
	// -1: not started
	// 0: finished
	// 1: playing
	// 2: paused
	// 3: buffering
	// 5: video signal
	
	
}

function onPlayerError(event) {
	console.log("error:", event);
}
//--------------------------------------------------------------

function checkState() {
	var sPlayerState = smallPlayer.getPlayerState();
	var bPlayerState = bigPlayer.getPlayerState();
	
	//console.log('small', sPlayerState);
	//console.log('big', bPlayerState);
	
	if(sPlayerState == -1) reloadVideo(smallPlayer);
	else if(sPlayerState == 3) setTimeout(reloadVideo(smallPlayer), 4000);
	
	if(bPlayerState == -1) reloadVideo(bigPlayer);
	else if(bPlayerState == 3) setTimeout(reloadVideo(bigPlayer), 4000);
}

function reloadVideo(e) {
	if(e.getPlayerState() == 3 || e.getPlayerState() == -1) {
		console.log('reload', e);
		e.stopVideo();
		e.playVideo();
	}
}

function togglePlayers() {
	//checkState();
	
	bigPlayer.setSize(150,100);
	smallPlayer.setSize(500,300);
	bigPlayer.mute();
	smallPlayer.unMute();
	
	var temp = smallPlayer;
	smallPlayer = bigPlayer;
	bigPlayer = temp;

	temp = smallVideo;
	smallVideo = bigVideo;
	bigVideo = temp;
	
	smallVideo.style.zIndex = 0;
	bigVideo.style.zIndex = -1;

	temp = smallID;
	smallID = bigID;
	bigID = temp;
}

// for search playlist
function googleApiClientReady() {
	var apiKey = 'YOUR_API_KEY';
	gapi.client.setApiKey(apiKey);
	gapi.client.load('youtube', 'v3', function() {
		console.log('google api ready');
	});
}

function getPlaylist(e) {
	clearList();
	
	var query = $('#search').val();
	if(!query) query = 'kpop';
	
	var request = gapi.client.youtube.search.list({
		part : 'snippet',
		type : 'video',
		order : 'relevance',
		maxResults : 12,
		videoEmbeddable : 'true',
		videoSyndicated : 'true', // 배급된 동영상만
		//videoDefinition: 'standard',	// 표준해상도만 검색
		//videoDuration: 'medium',	// 4~20분, short: 4분 미만
		q : encodeURIComponent(query).replace(/%20/g, "+")
	});

	request.execute(function(res) {
		//console.log(res);
		var results = res.result;
		$.each(results.items, function(idx, item) {
			//console.log(idx, item);
			
			var newImg = document.createElement('img');
			newImg.src = item.snippet.thumbnails.default.url;
			newImg.id = item.id.videoId;
			newImg.className = 'thumb';
			
			$("#listThumbs").append(newImg);
		});
	});
	
	if(listHidden) showListBox();
}

function playVideo(id) {
	smallID = id;
	smallPlayer.loadVideoById(id, 0, "small");	
	togglePlayers();
}

function clearList() {
	document.getElementById('listThumbs').innerHTML = '';
}
// --------------------------------------------------------------

// for box animation
var listHidden = true;
function showListBox() {
	var arrow = document.getElementById('arrow');
	if (listHidden) {
		document.getElementById('playlist').style.top = '200px';
		arrow.style.top = '170px';
		listHidden = false;
	} else {
		document.getElementById('playlist').style.top = '300px';
		arrow.style.top = '270px';
		listHidden = true;
	}
}

var searchHidden = true;
function showSearchBox(e) {
	if (searchHidden) {
		e.style.right = '0px';
		document.getElementById('search').style.right = '15px';
		searchHidden = false;
	} else {
		e.style.right = '-140px';
		document.getElementById('search').style.right = '-125px';
		searchHidden = true;
	}
}
//--------------------------------------------------------------
