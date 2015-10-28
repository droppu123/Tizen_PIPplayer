//Initialize function
function init() {
	console.log("init() called");
	
	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if(e.keyName == "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (error) {
				console.error("getCurrentApplication(): " + error.message);
			}
		}
	});
	
	var list = document.getElementById('playlist');
	list.addEventListener('click', function(e) {
		showListBox();
		if(e.srcElement.className == "thumb") {
			//console.log(e.srcElement.id);
			playVideo(e.srcElement.id);
		}
	});
	
	bigVideo = document.getElementById('player1');
	smallVideo = document.getElementById('player2');
	
	//onYouTubeIframeAPIReady();
	googleApiClientReady();
	
	window.setInterval(checkState, 5000);

	//screen.lockOrientation('landscape-primary');
}