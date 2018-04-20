import * as React							from 'react';
import { connect }              			from 'react-redux';
import Cropper 								from 'react-cropper';
import 'cropperjs/dist/cropper.css';

// save config 
const DATA = require('../config.json');

// save config 
const atob = require('atob');

// default picture 
// const defaultAvatar = require('../images/default_avater.svg');

export interface Props {
	userAvatar: string;
	onUpdate: Function;
}

export interface State {
	src: string;
	cropResult: any;
	rotate: number;
}

class UserAvatar extends React.Component<Props, State> {

	cropper: Cropper;

	constructor(props: Props) {
		super(props);
		this.state = {
			src: DATA.domain + this.props.userAvatar,
			cropResult: null,
			rotate: 3,
		};
		this.cropImage = 		this.cropImage.bind(this);
		this.onChangeImage = 	this.onChangeImage.bind(this);
		this.useDefaultImage = 	this.useDefaultImage.bind(this);
		this._crop = 			this._crop.bind(this);
		this.rotateImageR = 	this.rotateImageR.bind(this);
		this.rotateImageL = 	this.rotateImageL.bind(this);
		this.b64toBlob = 		this.b64toBlob.bind(this);
		this.makeid = 			this.makeid.bind(this);
	}

	onChangeImage = (e: any) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
		  	files = e.dataTransfer.files;
		} else if (e.target) {
		  	files = e.target.files;
		}
		const reader = new FileReader();
		reader.onload = () => {
			this.setState({ 
				src: reader.result,
			});
		};
		reader.readAsDataURL(files[0]);
	}

	makeid = () => {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let index = 0; index < 5; index++) {
			text += possible.charAt(Math.floor( Math.random() * possible.length) );
		}
		return text;
	}

	b64toBlob = (b64Data: string, sliceSize?: number) => {
								sliceSize = sliceSize || 512;
								
								let block = b64Data.split(';');
								let dataType = block[0].split(':')[1];
								let realData = block[1].split(',')[1];
								let filename = this.makeid() + '.' + dataType.split('/')[1];

								let byteCharacters = atob(realData);
								let byteArrays = [];

								for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
									let slice = byteCharacters.slice(offset, offset + sliceSize);

									let byteNumbers = new Array(slice.length);
									for (let i = 0; i < slice.length; i++) {
										byteNumbers[i] = slice.charCodeAt(i);
									}

									let byteArray = new Uint8Array(byteNumbers);

									byteArrays.push(byteArray);
								}
								console.log(dataType);
								let blob = new Blob(byteArrays, {type: dataType});
								let newAvatar = new File([blob], filename);
								return newAvatar;
	}

	cropImage = () => {
		if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
			return; 
		}
		if (this.cropper.getCroppedCanvas() !== null) {
			this.setState({ 
				cropResult: this.cropper.getCroppedCanvas().toDataURL(),
			});
		}
		let blobImg = this.b64toBlob(this.state.cropResult);
		this.props.onUpdate(blobImg);
	}

	// set image to gefault 
	useDefaultImage() {
		this.setState({ src: DATA.domain + this.props.userAvatar });
		this.cropper.reset();
	}

	// save image in base64 every time when something is changed
	_crop = () => {
		var dataUrl = this.cropper.getCroppedCanvas().toDataURL();
		this.setState({ cropResult: dataUrl });
	}

	// rotate image to right 
	rotateImageR = (e: any) => {
		this.cropper.rotate(this.state.rotate);
	}

	// rotate image to left 
	rotateImageL = (e: any) => {
		this.cropper.rotate(-this.state.rotate);
	}

	// set cropper to the references
	setEditorRef = (cropper: any) => {
		if (cropper) {
		   this.cropper = cropper;
	   	}
	}

	render () {
		
		return (
			<div className="user__avatar">
				<div className="user__avatar--blocks">
					<div>
						<h1>Original Image</h1>
						<Cropper
							ref={(ref: any) => this.setEditorRef(ref)}
							src={this.state.src}
							preview=".user__avatar--preview"
							aspectRatio={1 / 1}
							guides={false}
							crop={this._crop} 
							className="user__avatar--editor"
							rotatable={true}
						/>
						<input type="file" onChange={this.onChangeImage} />
					</div>
					<div>
						<h1>Preview</h1>
						<div className="user__avatar--preview" />
					</div>
				</div>	

				<button 
					onClick={this.rotateImageR} 
					onKeyDown={this.rotateImageR} 
					className="sn_btn"
				>
					Rotate to Right
				</button>

				<button 
					onClick={this.rotateImageL} 
					onKeyDown={this.rotateImageL} 
					className="sn_btn"
				>
					Rotate to Left
				</button>
				<button onClick={this.useDefaultImage} className="sn_btn">
					Undo Changes
				</button>
				<button onClick={this.cropImage} className="sn_btn">
					Save Image
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		userAvatar : state.user.user.Avatar._deferred
	};
};

export default connect(
	mapStateToProps
)(UserAvatar);
