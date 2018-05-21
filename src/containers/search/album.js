import React, { Component } from 'react';

class Album extends Component {

	constructor(props) {
		super(props);

		this.state = {
			top: '',
			left: '',
			menuWidth: '',
			display: 'inline',
			myPlaylists: [],
			pos: 0,
			tracks: [],
			album: {}
		}
		this.showOptionsMenu = this.showOptionsMenu.bind(this);
	}

	componentWillMount() {
		if(Object.keys(this.props.album).length > 0) {
			localStorage.setItem('album', JSON.stringify(this.props.album));	
		}

		this.setState({
			album: JSON.parse(localStorage.getItem('album'))
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
		let thisVar = this;
		this.fetch(`https://api.spotify.com/v1/albums/${this.state.album.id}/tracks`).then(function(response) {
			thisVar.setState({
	  			tracks: response.items
	  		});
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

	addToPlaylist(item) {
		let select = document.querySelector('select');
		let playlistId = select.options[select.selectedIndex].value;
		let trackUri = this.state.tracks[this.state.pos - 1].uri;

		let thisVar = this;
		let user_id = 'wsv1w4yi9ehrneg0i358liouv';
		let url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlistId}/tracks?uris=${trackUri}`;
		let method = 'POST';
		this.fetch(url,method).then(function(response) { 
			thisVar.hideOptionsMenu();
			select.value = "";
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

	playSong(trackId, track, tracks, play) {
		this.props.playSong(trackId, track, tracks, play)
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

	fetch(url,method){
		return fetch(url, {
        	method: method,
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
        },
        //body: JSON.stringify(this.state),
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		//console.log(JSON.parse(response).items);
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<div>
				<div className="entityInfo">
					<div className="leftSection">
						{
							this.state.album.images
							? 
							(<img alt='Album' src={this.state.album.images[0].url}/>)
							:
							null
						}					
					</div>
					<div className="rightSection">
						<h2>{this.state.album.name}</h2>
						<p>By {this.state.album.artists[0].name}</p>
						<p>{this.state.tracks ? this.state.tracks.length : null} Songs</p>
					</div>
				</div>
				<div className="tracklistContainer">
					<ul className="tracklist">
					{this.state.tracks
						?
						this.state.tracks.map((song,i) => {
							//console.log(song.id);
						if(this.formatTime(song.duration_ms) !== 'NaN:NaN'){
							song.duration_ms = this.formatTime(song.duration_ms)
						}
						return (
							<li key={i} className='tracklistRow'>
								<div className='trackCount'>
									<img className='play' alt='Play' src={require('../../assets/images/icons/play-white.png')} onClick={ () => this.playSong(song.id,song,this.state.tracks,true, this.state.album)}/>
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
					}) : null }
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
				</nav>
			</div>
		)

	}
}

export default Album;