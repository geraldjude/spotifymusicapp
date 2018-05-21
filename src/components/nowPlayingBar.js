import React, { Component } from 'react';
import { Audio, formatTime } from '../assets/js/script.js';
//import Script from 'react-load-script';

//const musicAppDataUrl = process.env.MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://172.16.0.248:80/musicApp/server/';
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';
let audioElement;
let duration;
let mousedown = false;
let repeat = false;
let shuffle = false;
let currentIndex = 0;
//let data;
//let thisVar2;

class NowPlayingBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newPlaylist: [],
			currentPlaylist: [],
			shufflePlaylist: [],
			currentIndex: 0,
			song: {},
			artist: {},
			album: this.props.album,
			displayPlay: '',
			displayPause: 'none',
			duration: '0.00',
			current: '0.00',
			remaining: '0.00',
			progress: '',
			volume: '',
			volumeImage: 'volume.png',
			repeatImage: 'repeat.png',
			shuffleImage: 'shuffle.png',
			track: {}
		}

		//audioElement = new Audio();
	}

	componentWillMount() {
		//this.getSongs();
		audioElement = new Audio();
		this.updateVolumeProgressBar();
	}


	componentDidMount() {
		let thisVar = this;
		audioElement.audio.addEventListener('canplay', function() {
			duration = formatTime(this.duration);
			thisVar.setState({
				duration: duration
			})	
		});

		audioElement.audio.addEventListener("timeupdate", function(){
			if(this.duration) {
				thisVar.updateTimeProgressBar(this);
			}
		});

		audioElement.audio.addEventListener("volumechange", function() {
			thisVar.updateVolumeProgressBar(this);
		});

		audioElement.audio.addEventListener("ended", function() {
			thisVar.nextSong();
		});
	}

	componentDidUpdate() {
		document.onmouseup = function() {
			mousedown = false;
		}
	}


	/*initialiseWebSDK() {
		let thisVar = this;
		let _token = sessionStorage.getItem('spotifyToken');
		window.onSpotifyPlayerAPIReady = () => {
		  const player = new window.Spotify.Player({
		    name: 'Web Playback SDK Template',
		    getOAuthToken: cb => { cb(_token); }
		  });

		  // Error handling
		  player.on('initialization_error', e => console.error(e));
		  player.on('authentication_error', e => console.error(e));
		  player.on('account_error', e => console.error(e));
		  player.on('playback_error', e => console.error(e));

		  // Playback status updates
		  player.on('player_state_changed', state => {
		    console.log(state)
		    //document.getElementById('#current-track').setAttribute('src', state.track_window.current_track.album.images[0].url)
		    //document.getElementById('#current-track-name').innerText(state.track_window.current_track.name)
		    //$('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
		    //$('#current-track-name').text(state.track_window.current_track.name);
		  });

		  // Ready
		  player.on('ready', data => {
		    console.log('Ready with Device ID', data.device_id);
		    
		    // Play a track using our new device ID
		    console.log(thisVar);
		    localStorage.setItem('deviceId',data.device_id);
		    //thisVar2.play(data.device_id);
		  });

		  // Connect to the player!
		  player.connect();
		}
	}*/

	/*play(device_id) {
	  	let thisVar = this;
		let url = `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`;
		let method = 'PUT';
		data =	{
				 "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr" ,
				 "offset": { "position": 5 }
				};
			this.fetch_WebApi(url, method).then(function(response) { 
				console.log(response);
		})
	}*/

	/*fetch_WebApi(url, method){
		console.log(data);
		return fetch(url, {
        	method: method,
        	headers: {
          	'Accept': 'application/json',
          	'Content-Type': 'application/json',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
        },
        body: data
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		return response;
      	})
      	.catch((error) => console.log("an error occurred", error));
	}*/

	/*getSongs(album = null, trackIdIndex = null) {
		let play = false;
		let thisVar = this;
		let trackIds = [];

		if(album !== null) {
			play = true;
		}

		if(this.state.album.id){
			let response = Promise.all([this.fetch(`https://api.spotify.com/v1/albums/${this.state.album.id}/tracks`)]);
			response.then(function(res) {
				res[0].items.map((track,i) => {
					return trackIds.push(track.id)
				})
				thisVar.setState({
		  			newPlaylist: trackIds
		  		});
		  		thisVar.setPlayingTrack(trackIdIndex ? thisVar.state.newPlaylist[trackIdIndex] : thisVar.state.newPlaylist[0],thisVar.state.newPlaylist,play);
			});
		}
	}*/

	setPlayingTrack(trackId, newPlaylist, play) {
		if(shuffle === true) {
			currentIndex = this.state.shufflePlaylist.indexOf(trackId);
		}
		else{
			currentIndex = this.state.currentPlaylist.indexOf(trackId);
			if(currentIndex === -1) {
				currentIndex = this.state.newPlaylist.indexOf(trackId);
			}
		}

		this.pauseSong();

		this.getSong(trackId, play);
	}

	getSong(trackId,play) {
		let thisVar = this;

		this.fetch(`https://api.spotify.com/v1/tracks/${trackId}`).then(function(response){
			thisVar.setState({
				track: response,
				album: response.album
			})

			audioElement.setTrack(response);
			if(play){
	  			thisVar.playSong();
	  		}
		})	
	}

	formatTime(milliSeconds) {
		let seconds = Math.round(milliSeconds)/1000
		let time = seconds;
		let minutes = Math.floor(time/60);
		let sec = Math.round((time - (minutes * 60)));
		let extraZero = (sec <  10) ? '0' : '';
		return minutes + ":" + extraZero + sec; 
	}

	playSong() {
		this.setState({
			'displayPlay': 'none',
			'displayPause': '' 
		})

		audioElement.play();
	}

	pauseSong() {
		this.setState({
			'displayPlay': '',
			'displayPause': 'none' 
		})

		audioElement.pause();
	}	

	previousSong() {
		if(audioElement.audio.currentTime >= 3 || currentIndex === 0) {
			audioElement.setTime(0);
		}
		else {
			/*this.setState({
				'currentIndex': this.state.currentIndex - 1
			})*/
			currentIndex = currentIndex - 1
			this.setPlayingTrack(this.state.currentPlaylist[currentIndex], this.state.currentPlaylist, true);
		}
	}

	nextSong() {
		if(repeat === true) {
			audioElement.setTime(0);
			this.playSong();
			return;
		}

		if(currentIndex === this.state.currentPlaylist.length - 1) {
			currentIndex = 0;
		}
		else {
			currentIndex++
		}

		let trackToPlay = shuffle ? this.state.shufflePlaylist[currentIndex] : this.state.currentPlaylist[currentIndex];
		this.setPlayingTrack(trackToPlay, this.state.currentPlaylist, true);
	}

	setMute() {
		audioElement.audio.muted = !audioElement.audio.muted;
		let imageName = audioElement.audio.muted ? 'volume-mute.png' : 'volume.png';
		this.setState({
			volumeImage: imageName
		})
	}

	setRepeat() {
		repeat = !repeat;
		var imageName = repeat ? "repeat-active.png" : "repeat.png";
		this.setState({
			repeatImage: imageName
		})
	}

	setShuffle() {
		shuffle = !shuffle;
		var imageName = shuffle ? "shuffle-active.png" : "shuffle.png";

		this.setState({
			shuffleImage: imageName
		})

		if(shuffle === true) {
			//Randomize playlist
			this.shuffleArray(this.state.shufflePlaylist);

			currentIndex = this.state.shufflePlaylist.indexOf(audioElement.currentlyPlaying.id)
		}
		else {
			//shuffle has been deactivated
			//go back to regular playlist
			currentIndex = this.state.currentPlaylist.indexOf(audioElement.currentlyPlaying.id)
		}
	}

	shuffleArray(a) {
	    let j, x, i;
	    for (i = a.length; i; i--) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
	    }

	    this.setState({
	    	shufflePlaylist: a
	    })
	}

	updateTimeProgressBar() {
		let progress = audioElement.audio.currentTime / audioElement.audio.duration * 100;
		this.setState({
			current: formatTime(audioElement.audio.currentTime),
			remaining: formatTime(audioElement.audio.duration - audioElement.audio.currentTime),
			progress: progress
		})
	}

	updateVolumeProgressBar() {
		let volume = audioElement.audio.volume * 100;
		this.setState({
			volume: volume
		});
	}

	onMouseDownPlayBackBar() {
		mousedown = true;
	}

	onMouseMovePlayBackBar(e) {
		if(mousedown) {
			this.timeFromOffset(e);
		}
	}

	onMouseUpPlayBackBar(e) {
		this.timeFromOffset(e);
	}

	onMouseDownVolumeBar() {
		mousedown = true;
	}

	onMouseMoveVolumeBar(e) {
		if(mousedown) {
			let computedStyle = getComputedStyle(document.getElementById('volumeBar'), null);
			let width = computedStyle.width.replace('px','');
			let percentage = e.nativeEvent.offsetX / width;
			if(percentage >= 0 && percentage <= 1) {
				audioElement.audio.volume = percentage;
			}
		}
	}

	onMouseUpVolumeBar(e) {
		let computedStyle = getComputedStyle(document.getElementById('volumeBar'), null);
		let width = computedStyle.width.replace('px','');
		let percentage = e.nativeEvent.offsetX / width;
		if(percentage >= 0 && percentage <= 1) {
			audioElement.audio.volume = percentage;
		}
	}

	timeFromOffset(e) {
		let computedStyle = getComputedStyle(document.getElementById('progressBar'), null);
		let width = computedStyle.width.replace('px','');
		let percentage = e.nativeEvent.offsetX / width * 100;
		let seconds = audioElement.audio.duration * (percentage / 100);
		audioElement.setTime(seconds);
	}

	fetch(url) {
		return fetch(url, {
        	method: 'GET',
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
        },
        //body: JSON.stringify(data),
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<div id="nowPlayingBar">
				<div id="nowPlayingLeft">
					<div className="content">
						<span className="albumLink">
							{
								this.state.album && this.state.album.images
								? 
								(<img alt='Album' src={`${this.state.album.images[0].url}`} className="albumArtwork"/>)
								:
								null
							}
						</span>
						<div className="trackInfo">
							<span className="trackName">
								<span>{this.state.track.name ? this.state.track.name : ''}</span>
							</span>
							<span className="artistName">
								<span>{this.state.track.artists ? this.state.track.artists[0].name : ''}</span>
							</span>
						</div>
					</div>
				</div>
				<div id="nowPlayingCenter">
					<div className="content playerControls">
						<div className="buttons">
							<button className="controlButton shuffle" title="Shuffle button" onClick={() => this.setShuffle()}>
								<img src={require(`../assets/images/icons/${this.state.shuffleImage}`)} alt="Shuffle"/>
							</button>
							<button className="controlButton previous" title="Previous button" onClick={() => this.previousSong()}>
								<img src={require('../assets/images/icons/previous.png')} alt="Previous"/>
							</button>
							<button className="controlButton play" title="Play button" style={{'display' : this.state.displayPlay}} onClick={(e) => this.playSong(e)}>
								<img src={require('../assets/images/icons/play.png')} alt="Play"/>
							</button>
							<button className="controlButton pause" title="Pause button" style={{'display' : this.state.displayPause}} onClick={() => this.pauseSong()}>
								<img src={require('../assets/images/icons/pause.png')} alt="Pause"/>
							</button>
							<button className="controlButton next" title="Next button" onClick={() => this.nextSong()}>
								<img src={require('../assets/images/icons/next.png')} alt="Next"/>
							</button>
							<button className="controlButton repeat" title="Repeat button" onClick={() => this.setRepeat()}>
								<img src={require(`../assets/images/icons/${this.state.repeatImage}`)} alt="Repeat"/>
							</button>
						</div>
						<div className="playbackBar">
							<span className="progressTime current">{this.state.current}</span>
							<div id="progressBar" className="progressBar" onMouseUp={(e) => this.onMouseUpPlayBackBar(e)} onMouseDown={() => this.onMouseDownPlayBackBar()} onMouseMove={(e) => this.onMouseMovePlayBackBar(e)}>
								<div className="progressBarBg">
									<div className="progress" style={{'width' : this.state.progress + '%'}}></div>
								</div>
							</div>
							<span className="progressTime remaining">{this.state.remaining === '0.00' ? this.formatTime(this.state.track.duration_ms) : this.state.remaining}</span>
						</div>
					</div>
				</div>
				<div id="nowPlayingRight">
					<div className="volumeBar">
						<button className="controlButton volume" title="Volume button">
							<img src={require(`../assets/images/icons/${this.state.volumeImage}`)} alt="Volume" onClick={() => this.setMute()}/>
						</button>
						<div id="volumeBar" className="progressBar" onMouseUp={(e) => this.onMouseUpVolumeBar(e)} onMouseDown={() => this.onMouseDownVolumeBar()} onMouseMove={(e) => this.onMouseMoveVolumeBar(e)}>
							<div className="progressBarBg">
								<div className="progress" style={{'width' : this.state.volume + '%'}}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NowPlayingBar;