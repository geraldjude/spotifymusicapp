import React, { Component }  from 'react';

class Artist extends Component {
	constructor(props) {
		super(props);

		this.state = {
			albums: [],
			tracks: [],
			artistId: '',
			artistName: ''
		}
	}

	componentWillMount() {
		if(this.props.artistId !== '') {
			localStorage.setItem('artistId',this.props.artistId);
		}

		if(this.props.artistName !== '') {
			localStorage.setItem('artistName',this.props.artistName);
		} 

		this.setState({
			artistId: localStorage.getItem('artistId'),
			artistName: localStorage.getItem('artistName')
		}, function() {
			this.getArtistTracks();
			this.getArtistAlbums();
		})
	}

	getArtistTracks() {
		let thisVar = this;
		let artistUrl = `https://api.spotify.com/v1/artists/${this.state.artistId}/top-tracks?country=AU`;
		this.fetch(artistUrl).then(function(response) {
				thisVar.setState({
					tracks: response.tracks
				})
			})
	}

	getArtistAlbums() {
		let thisVar = this;
		let albumUrl = `https://api.spotify.com/v1/artists/${this.state.artistId}/albums`;
		this.fetch(albumUrl).then(function(response) {
				thisVar.setState({
					albums: response.items,
				})
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

	playSong(trackId, track, tracks, play) {
		this.props.playSong(trackId, track, tracks, play)
	}

	displayAlbumView(albumData) {
		this.props.displayAlbum(albumData);
	}

	fetch(url){
		return fetch(url, {
        	method: 'GET',
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
				<div className="entityInfo borderBottom">
					<div className="centerSection">
						<div className="artistInfo">
							<h1 className="artistName">{this.state.artistName}</h1>
						</div>
					</div>
				</div>
				{
					this.state.tracks.length > 0 ?
					<div className="tracklistContainer borderBottom">
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
													<img alt="More Options" className='optionsButton' src={require('../../assets/images/icons/more.png')}/>
												</div>
												<div className='trackDuration'>
													<span className='duration'>{track.duration_ms}</span>
												</div>
											</li>
											)
								})
							}
						</ul>
					</div>:
					null
				}
				{
					this.state.albums ?
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
			</div>

		)
	}
}

export default Artist;