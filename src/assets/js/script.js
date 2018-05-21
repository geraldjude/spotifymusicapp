let duration;

function formatTime(seconds) {
	let time = Math.round(seconds);
	let minutes = Math.floor(time/60);
	let sec = time - (minutes * 60);

	let extraZero = (sec <  10) ? '0' : '';
	return minutes + ":" + extraZero + sec; 
}

function Audio() {
	this.audio = document.createElement('audio');

	this.setTrack = (track) => {
		this.currentlyPlaying = track;
		this.audio.setAttribute('src', track.preview_url);
		//this.audio.src = require('./' + track.path);
	}

	this.play = () => {
		var playPromise = this.audio.play();
		if (playPromise !== undefined) {
		    playPromise.then(_ => {
		      this.audio.pause();
		      this.audio.play();
		    })
		    .catch(error => {
		    	this.audio.play();
		    });
		}
	}

	this.pause = () => {
		this.audio.pause();
	}

	this.setTime = (seconds) => {
		this.audio.currentTime = parseFloat(seconds);
	}
}

export { Audio, duration, formatTime };