import React, { Component } from 'react';

let data = {};

class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			playlist: [],
			pos: 0
		}
	}

	componentWillMount() {
		if(!Array.isArray(this.props.playlist)) {
			localStorage.setItem('playlist', JSON.stringify(this.props.playlist));	
			localStorage.setItem('isMyPlaylist', this.props.isMyPlaylist)
		}

		this.setState({
			playlist: JSON.parse(localStorage.getItem('playlist'))
		}, function() {
			this.getTracks();
			this.getPlaylists();
		})
	}

	componentDidMount() {
		let item = document.querySelector('select');
    	window.addEventListener('scroll', this.hideOptionsMenu);
    	document.addEventListener('click', this.hideOptionsMenuOnClick);
    	item.addEventListener('change', (item) => this.addToPlaylist(item));
	}

	componentWillUnmount() {
    	window.removeEventListener('scroll', this.hideOptionsMenu);
    	document.removeEventListener('click', this.hideOptionsMenuOnClick,false);
	}

	getTracks() {
		let trackLists = [];
		let thisVar = this;
		let method = 'GET';
		let userId = localStorage.getItem('isMyPlaylist') === 'true' ? 'wsv1w4yi9ehrneg0i358liouv' : 'spotify';
		let url = 	`https://api.spotify.com/v1/users/${userId}/playlists/${this.state.playlist.id}/tracks`;
		this.fetch(url, method).then(function(response) {
			response.items.map((tracks, i) => {
				if(tracks.track.preview_url != null) {
					trackLists.push(tracks.track);
				}
				return trackLists;
			})
			thisVar.setState({
	  			tracks: trackLists
	  		});
		})
	}

	addToPlaylist(item) {
		let select = document.querySelector('select');
		let playlistId = select.options[select.selectedIndex].value;
		let trackUri = this.props.tracks[this.state.pos - 1].uri;
		let thisVar = this;
		let user_id = 'wsv1w4yi9ehrneg0i358liouv';
		let url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlistId}/tracks?uris=${trackUri}`;
		let method = 'POST';
		this.fetch(url,method).then(function(response) { 
			thisVar.hideOptionsMenu();
			select.value = "";
		})
	}

	removeFromPlaylist() {
		let playlistId = this.state.playlist.id;
		let trackUri = this.state.tracks[this.state.pos - 1].uri;
		let thisVar = this;
		let user_id = 'wsv1w4yi9ehrneg0i358liouv';
		let url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlistId}/tracks?uris=${trackUri}`;
		let method = 'DELETE';
		data =	{
				"tracks": [
						{
						"uri": trackUri
						}
					]
				}
		this.fetch(url, method).then(function(response) { 
			thisVar.hideOptionsMenu();
			thisVar.getTracks();
		})
	}

	getPlaylists() {
		let thisVar = this;
		let url = `https://api.spotify.com/v1/me/playlists`;
		let method = 'GET';
		this.fetch(url, method).then(function(response) { 
			let items = response.items.reverse();
			thisVar.setState({
	  			myPlaylists: items
	  		});
		})
	}

	prevAll(element) {
	    let result = [];
	    while (element === element.previousElementSibling){
	        result.push(element.value);
	    }
	    return result;
	}

	findPos(obj) {
		let curleft = 0;
	    if (obj.offsetParent)
	    do {
	        curleft += obj.offsetLeft;
	    } while (obj === obj.offsetParent);
	    return curleft;
	}

	hideOptionsMenuOnClick(click) {
		let target = click.target;
		if(!target.classList.contains("item") && !target.classList.contains("optionsButton")) {
			let menu = document.querySelector(".optionsMenu");
			if(menu.style.display !== "none") {
				menu.style.display = "none";
			}
		}
	}

	hideOptionsMenu() {
		let menu = document.querySelector(".optionsMenu");
		if(menu.style.display !== "none") {
			menu.style.display = "none";
		}
	}

	showOptionsMenu(pos) {
		this.setState({
			pos: pos
		})
		let songId = this.prevAll(this.refs['row' + pos])[0];
		let computedStyle = getComputedStyle(document.getElementById('optionsMenu'), null);
		let menuWidth = computedStyle.width.replace('px','');
		let menu = document.querySelector(".optionsMenu");
		menu.children[0].setAttribute("value",songId);
		//let scrollTop = document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop); //Distance from top of window to top of document
		let elementOffset = this.refs['row' + pos].getBoundingClientRect().top; //Distance from top of document
		let top =  elementOffset;
		let left = this.findPos(this.refs['row' + pos]);
		menu.style.display = 'inline';
		this.setState({
			top: top,
			left: left,
			menuWidth: menuWidth,
			display: 'inline'
		})
	}

	playSong(trackId, track, tracks, play) {
		this.props.playSong(trackId, track, tracks, play)
	}

	formatTime(milliSeconds) {
		let seconds = Math.round(milliSeconds)/1000
		let time = seconds;
		let minutes = Math.floor(time/60);
		let sec = Math.round((time - (minutes * 60)));
		let extraZero = (sec <  10) ? '0' : '';
		return minutes + ":" + extraZero + sec; 
	}

	fetch(url,method){
		if(method === 'DELETE') {
			return fetch(url, {
	        	method: method,
	        	headers: {
	          	'Accept': 'text/plain',
	          	'Content-Type': 'application/json',
	          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`,
	        },
	        body: JSON.stringify(data)
	      	})
	      	.then((res) => res.text())
	      	.then((response) => {
	      		console.log(response);
	      		return JSON.parse(response);
	      	})
	      	.catch((error) => console.log("an error occurred", error));
	    }
      	else{
	      	return fetch(url, {
	        	method: method,
	        	headers: {
	          	'Accept': 'text/plain',
	          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
	        },
	  		//body: JSON.stringify(data)
	      	})
	      	.then((res) => res.text())
	      	.then((response) => {
	      		return JSON.parse(response);
	      	})
	      	.catch((error) => console.log("an error occurred", error));
	    }
	}


	render() {
		return (

			<div>
				<div className="entityInfo">
					<div className="leftSection">
						{
							this.state.playlist && this.state.playlist.images
							? 
							(<img alt='Album' src={this.state.playlist.images[0].url}/>)
							:
							null
						}					
					</div>
					<div className="rightSection">
						<h2>{this.state.playlist.name}</h2>
						<p>By {this.state.playlist.owner.display_name}</p>
						<p>{this.state.tracks ? this.state.tracks.length : null} Songs</p>
					</div>
				</div>
				<div className="tracklistContainer">
					<ul className="tracklist">
					{this.state.tracks
						?
						this.state.tracks.map((song,i) => {
						if(this.formatTime(song.duration_ms) !== 'NaN:NaN'){
							song.duration_ms = this.formatTime(song.duration_ms)
						}
						return (
							<li key={i} style={song.preview_url ? {'pointerEvents' : ''} : {'pointerEvents' : 'none'}} className='tracklistRow'>
								<div className='trackCount'>
									<img className='play' alt='Play' src={require('../../assets/images/icons/play-white.png')} onClick={ () => this.playSong(song.id,song,this.state.tracks,true)}/>
									<span className='trackNumber'>{++i}</span>
								</div>
								<div className='trackInfo'>
									<span className='trackName'>{song.name}</span>
									<span className='artistName'>{song.artists[0].name}</span>
								</div>
								<div className='trackOptions'>
									<input type="hidden" className='songId'  value={song.id}/>
									<img className='optionsButton' ref={'row' + i} src={require('../../assets/images/icons/more.png')} onClick={() => this.showOptionsMenu(i)} alt='More Options'/>
								</div>
								<div className='trackDuration'>
									<span className='duration'>{song.duration_ms}</span>
								</div>
							</li>
						)
					}) : (<span className='noResults'>There are no tracks in this playlist.</span>) }
					</ul>
				</div>
				<nav id="optionsMenu" className="optionsMenu" style={{"top": this.state.top + "px", "left": this.state.left - this.state.menuWidth + "px", "display": '' }}>
					<input type="hidden" className="songId"/>
					<select className="item playlist">
						<option value="">Add to Playlist</option>
						{
							this.state.myPlaylists ? 
								this.state.myPlaylists.map((myPlaylist,i) => {
								return (
										<option key={i} value={myPlaylist.id}>{myPlaylist.name}</option>
										)
								}):
								null
						}						
					</select>
					<div className="item" onClick={() => this.removeFromPlaylist()}>Remove from Playlist</div>
				</nav>
			</div>

		)
	}
}

export default Playlist;