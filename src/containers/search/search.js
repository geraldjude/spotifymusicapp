import React, { Component } from 'react';

let timer;

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
			artists: [],
			albums: [],
			tracks: [],
			myPlaylists:[],
			top: '',
			left: '',
			menuWidth: '',
			pos: 0
		}
	}

	componentWillMount() {
		this.getPlaylists();
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

	getSearchValue(e) {
		this.setState({
			searchValue: e.target.value
		})
	}

	search() {
		let thisVar = this;
		clearTimeout(timer);
		let url = `https://api.spotify.com/v1/search?q=${encodeURI(thisVar.state.searchValue)}&type=album%2Cartist%2Ctrack`;
		let method = 'GET'
		timer = setTimeout(function() {
			thisVar.fetch(url, method).then(function(response) {
				thisVar.setState({
					albums: response.albums.items,
					artists: response.artists.items,
					tracks: response.tracks.items
				})
			})
		},2000)
	}

	formatTime(milliSeconds) {
		let seconds = Math.round(milliSeconds)/1000
		let time = seconds;
		let minutes = Math.floor(time/60);
		let sec = Math.round((time - (minutes * 60)));

		let extraZero = (sec <  10) ? '0' : '';
		return minutes + ":" + extraZero + sec; 
	}

	playSong(trackId, track, tracks, play) {
		this.props.playSong(trackId, track, tracks, play)
	}

	displayAlbumView(albumData) {
		this.props.displayAlbum(albumData);
	}

	displayArtist(artistId, artistName) {
		this.props.displayArtist(artistId, artistName);
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
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<div>
				<div className="searchContainer">
					<h4>Search for an artist, album or song</h4>
					<input type="text" className="searchInput" value={this.state.searchValue} onChange={(e) => this.getSearchValue(e)} onKeyUp={() => this.search()} placeholder="Start typing..."/>
				</div>
				{
					this.state.tracks.length > 0 ?
					(<div className="tracklistContainer borderBottom">
						<h2>SONGS</h2>
						<ul className="tracklist">
							{
								this.state.tracks.map((track,i) => {
								if(this.formatTime(track.duration_ms) !== 'NaN:NaN'){
									track.duration_ms = this.formatTime(track.duration_ms)
								}
									return (
											<li key={i} className='tracklistRow'>
												<div className='trackCount'>
													<img alt="Play" className='play' src={require('../../assets/images/icons/play-white.png')} onClick={() => this.playSong(track.id,track,this.state.tracks,true)}/>
													<span className='trackNumber'>{++i}</span>
												</div>
												<div className='trackInfo'>
													<span className='trackName'>{track.name}</span>
													<span className='artistName'>{track.artists.name}</span>
												</div>
												<div className='trackOptions'>
													<input type="hidden" className='songId'  value={track.id}/>
													<img className='optionsButton' ref={'row' + i} src={require('../../assets/images/icons/more.png')} onClick={() => this.showOptionsMenu(i)} alt='More Options'/>
												</div>
												<div className='trackDuration'>
													<span className='duration'>{track.duration_ms}</span>
												</div>
											</li>
											)
								})
							}
						</ul>
					</div>):
					null
				}
				{
					this.state.artists.length > 0 ?
					(<div className="artistsContainer borderBottom">
						<h2>ARTISTS</h2>
						{
							this.state.artists.map((artist,i) => {
								return (
											<div key={i} className='searchResultRow'>
												<div className='artistName'>
													<span onClick={() => this.displayArtist(artist.id, artist.name)}>{artist.name}</span>
												</div>
											</div>
										)
							})
						}
					</div>):
					null
				}
				{
					this.state.albums.length > 0 ?
					(<div className="gridViewContainer">
						<h2>ALBUMS</h2>
						{
							this.state.albums.map((album,i) => {
								return (
										<div key={i} className='gridViewItem'>
											<span onClick={() => this.displayAlbumView(album)}>
												<img alt="Album" src={album.images[0].url}/>
												<div className='gridViewInfo'>{album.name}</div>
											</span>
										</div>
										)
							})
						}	
					</div>) :
					null
				}
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

export default Search;