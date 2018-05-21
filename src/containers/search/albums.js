import React, { Component } from 'react';


class Albums extends Component {

	displayAlbumView(albumData) {
		this.props.displayAlbum(albumData);
	}

	render() {
		let thisVar = this;
		return (
			<div>
				<h1 className="pageHeadingBig">New Releases</h1>
			{
				this.props.albumDatas.map((albumData,i) => {
					return (
						<div key={i} className='gridViewItem' onClick={() => thisVar.displayAlbumView(albumData)}>
							<img alt='Album' src={albumData.images[0].url}/>
							<div className='gridViewInfo'>
								{albumData.name}
							</div>
						</div>
					)
				})
			}
			</div>
		)	
	}
}

export default Albums;