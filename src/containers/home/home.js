import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import NowPlayingBar from '../../components/nowPlayingBar.js';
import NavBar from '../../components/navBar.js';
import Albums from '../search/albums.js';
import Album from '../search/album.js';
import Browse from '../browse/browse.js';
import Playlists from '../browse/playlists.js';
import Playlist from '../browse/playlist.js';
import Search from '../search/search.js';
import Artist from '../search/artist.js';
import Yourmusic from '../browse/yourmusic.js';
import Settings from '../settings/settings.js';
import UpdateDetails from '../settings/updatedetails.js';
import { Audio } from '../../assets/js/script.js';
import '../../assets/css/style.css';

//const musicAppDataUrl = process.env.MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://172.16.1.43:80/musicApp/server/';
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';
let audioElement;

class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			albumDatas: [],
			displayNowPlayingBar: false,
			showAlbums: true,
			showAlbum: false,
			album: {},
			albumId: '',
			previousAlbumId: '',
			playlists: [],
			playlist: [],
			tracks:[],
			heading: '',
			artistId: '',
			artistName: '',
			isMyPlaylist: false,
			categoryName: ''
 		};
 		this.nowPlayingBar = React.createRef();
	}

	componentWillMount() {
		this.getNewReleases();
		//this.initialiseWebSDK();
		audioElement = new Audio();  	
	}

	componentDidMount() {
		let thisVar = this;
		audioElement.audio.addEventListener('currentTime', function(response) {
			console.log(response);
			if(response > 0){
				thisVar.setState({
					displayNowPlayingBar: true
				})
			}
			else{
				thisVar.setState({
					displayNowPlayingBar: false
				})
			}	
		});
	}

	handleMouseEvent(e) {
		e.preventDefault();
	}

	handleScriptLoad = () => {
	  return new Promise(resolve => {
	    if (window.Spotify) {
	      resolve();
	    } else {
	      window.onSpotifyWebPlaybackSDKReady = resolve;
	    }
	  });
	}

	getNewReleases() {
		let thisVar = this;
		let url = "https://api.spotify.com/v1/browse/new-releases?country=AU&offset=0&limit=12";
		this.fetch(url).then(function(response) { 
			thisVar.setState({
	  			albumDatas: response.albums.items
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

	/*playSong(trackId, track, tracks, play) {
		let trackIds=[];

		tracks.map((track,i) => {
			return trackIds.push(track.id);
		});

		this.setState({
			displayNowPlayingBar: true
		}, function() {
			if(this.state.previousAlbumId === this.state.albumId){
				this.nowPlayingBar.current.state.album = track.album;
				this.nowPlayingBar.current.state.newPlaylist = trackIds;
				this.nowPlayingBar.current.setPlayingTrack(trackId,trackIds,play);
			}
			else{
				this.setState({
					previousAlbumId: this.state.albumId
				});
				this.nowPlayingBar.current.state.album = this.state.album;
				this.nowPlayingBar.current.getRandSongs(this.state.album, trackIds.indexOf(trackId));	
			}
		})
	}*/

	playSong(trackId, track, tracks, play) {
		let trackIds=[];
		this.setState({
			album: track.album ? track.album : this.state.album,
			albumId: track.album ? track.album.id : this.state.album.id,
			displayNowPlayingBar: true
		}, function () {
			tracks.map((track,i) => {
				return trackIds.push(track.id);
			});
			this.nowPlayingBar.current.state.album = this.state.album;
			this.nowPlayingBar.current.state.newPlaylist = trackIds;
			if(this.nowPlayingBar.current.state.newPlaylist !== this.nowPlayingBar.current.state.currentPlaylist) {
				this.nowPlayingBar.current.state.currentPlaylist = this.nowPlayingBar.current.state.newPlaylist;
				this.nowPlayingBar.current.state.shufflePlaylist = this.nowPlayingBar.current.state.currentPlaylist.slice();
				this.nowPlayingBar.current.shuffleArray(this.nowPlayingBar.current.state.shufflePlaylist);
			}
			this.nowPlayingBar.current.setPlayingTrack(trackId,trackIds,play);
		})
	}



	displayPlaylists(playlists, categoryName) {
		this.setState({
			playlists: playlists,
			heading: 'Playlists',
			categoryName: categoryName
		})
		this.props.history.push('/home/browse/playlists');
	}

	displayPlaylist(playlist, isMyPlaylist) {
		this.setState({
			playlist: playlist,
			heading: playlist.name,
			isMyPlaylist: isMyPlaylist ? true : false
		})

		this.props.history.push('/home/browse/playlists/playlist');
	}

	displayArtist(artistId, artistName) {
		this.setState({
			artistId: artistId,
			artistName: artistName
		})

		this.props.history.push('/home/artist');
	}

	displayAlbumView(albumData) {
		this.setState({
			showAlbums: false,
			showAlbum: true,
			album: albumData,
			albumId: albumData.id
		})

		this.props.history.push('/home/album');
	}

	displayAlbumsView() {
		this.setState({
			showAlbums: true,
			showAlbum: false,
			displayNowPlayingBar: true
		})

		this.props.history.push('/home');
	}

	selectPage() {
		switch(this.props.history.location.pathname) {
			case '/home':
				return <Albums displayAlbum={(albumData) => this.displayAlbumView(albumData)} albumDatas={this.state.albumDatas}/>
			case '/home/album':
				return <Album displayAlbums={() => this.displayAlbumsView()} playSong={(trackId, track, tracks, play) => this.playSong(trackId, track, tracks, play)} album={this.state.album}/>
			case '/home/browse':
				return <Browse displayPlaylists={(playlists, categoryName) => this.displayPlaylists(playlists, categoryName)}/>	
			case '/home/browse/playlists':
				return <Playlists displayPlaylist={(playlist, isMyPlaylist) => this.displayPlaylist(playlist, isMyPlaylist)} categoryName={this.state.categoryName} playlists={this.state.playlists}/>						
			case '/home/browse/playlists/playlist':
				return <Playlist playSong={(trackId, track, tracks, play) => this.playSong(trackId, track, tracks, play)} playlist={this.state.playlist} isMyPlaylist={this.state.isMyPlaylist}/>	
			case '/home/search':
				return <Search displayArtist={(artistId, artistName) => this.displayArtist(artistId, artistName)} displayAlbum={(albumData) => this.displayAlbumView(albumData)} playSong={(trackId, track, tracks, play) => this.playSong(trackId, track, tracks, play)}/>
			case '/home/artist':
				return <Artist displayAlbum={(albumData) => this.displayAlbumView(albumData)} playSong={(trackId, track, tracks, play) => this.playSong(trackId, track, tracks, play)} artistName={this.state.artistName} artistId={this.state.artistId}/>				
			case '/home/yourmusic':
				return <Yourmusic displayPlaylist={(playlist,isMyPlaylist) => this.displayPlaylist(playlist,isMyPlaylist)}/>
			case '/home/settings':
				return <Settings history={this.props.history}/>		
			case '/home/settings/updatedetails':
				return <UpdateDetails/>		
			default:
				return <Albums/>
		}
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
		return(
			<div id="mainContainer">
				<div id="topContainer">
					<div id="navBarContainer">
						<NavBar history={this.props.history}/>
					</div>
					<div id="mainViewContainer">
						<div id="mainContent">
							<div className="gridViewContainer">
								{
									this.selectPage()
								}
							</div>
						</div>
					</div>
				</div>
					{
						this.state.displayNowPlayingBar ?
							<div id="nowPlayingBarContainer">
								<NowPlayingBar ref={this.nowPlayingBar} style={{'display': this.state.displayNowPlayingBar}} album={this.state.album}/>
							</div>	:
						null
					}			
				</div>
			)
		}
	}

export default Home;