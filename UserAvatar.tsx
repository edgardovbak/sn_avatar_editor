import * as React							from 'react';
import { connect }              			from 'react-redux';
import AvatarEditor 						from 'react-avatar-editor';
import Loader 								from './Loader';
import Dropzone 							from 'react-dropzone';
import 'cropperjs/dist/cropper.css';

// save config 
const DATA = require('../config.json');

// save config 
const atob = require('atob');

export interface AvatarPath {
	Path: string;
}

export interface Props {
	userAvatar: AvatarPath;
	onUpdate: Function;
}

export interface Point {
	x: number;
	y: number;
}

export interface IsChangedType {
	isChanged?: boolean;
	newImage?: any;
}

export interface State {
	rotate: number;
	image: any;
	allowZoomOut: boolean;
	position: Point;
	scale: number;
	borderRadius: number;
	preview: any;
	width: number;
	height: number;
	imageUpdates: IsChangedType;
}

class UserAvatar extends React.Component<Props, State> {

	editor: AvatarEditor;

	constructor(props: Props) {
		super(props);
		this.state = {
			image: !this.props.userAvatar ? DATA.domain + DATA.avatar + '/user.png' : DATA.domain + this.props.userAvatar.Path,
			allowZoomOut: false,
			position: { x: 0.5, y: 0.5 },
			scale: 1,
			rotate: 0,
			borderRadius: 0,
			preview: null,
			width: 250,
			height: 250,
			imageUpdates: {
				newImage: undefined,
				isChanged: false,
			}
		};
		this.useDefaultImage = 	this.useDefaultImage.bind(this);
		this.handleRotate = 	this.handleRotate.bind(this);
		this.handleSave = 		this.handleSave.bind(this);
		this.b64toBlob = 		this.b64toBlob.bind(this);
		this.makeid = 			this.makeid.bind(this);
		this.imageChange = 		this.imageChange.bind(this);
		this.loadSuccess = 		this.loadSuccess.bind(this);
	}

	// generate random names
	makeid = () => {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let index = 0; index < 7; index++) {
			text += possible.charAt(Math.floor( Math.random() * possible.length) );
		}
		return text;
	}

	// convert base64 to file
	b64toBlob = (b64Data: string = '', sliceSize?: number) => {
		sliceSize = sliceSize || 512;
		if ( b64Data !== null) {
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
			let blob = new Blob(byteArrays, {type: dataType});
			let newAvatar = new File([blob], filename);
			return newAvatar;
		} else {
			return '';
		}
	}

	// set image to gefault 
	useDefaultImage() {
		this.setState({ image: !this.props.userAvatar ? DATA.domain + DATA.avatar + '/user.png' : DATA.domain + this.props.userAvatar.Path });
		// this.cropper.reset();
	}

	// rotate image to right 
	handleRotate = (e: any) => {
		this.setState({
			rotate: parseFloat(e.target.value),
		});
	}

	// set cropper to the references
	setEditorRef = (editor: any) => {
		if (editor) {
		   this.editor = editor;
	   	}
	}

	// add image with dropp
	handleDrop = (acceptedFiles: any) => {
		this.setState({ image: acceptedFiles[0] });
	}

	// get zoom value fron range
	handleScale = (e: any) => {
		const scale = parseFloat(e.target.value);
		this.setState({ scale });
	}

	// detect all changes on image ( zoom, rotate )
	imageChange = () => {
		this.setState({ 
			imageUpdates : {
				isChanged: true,
		}});
	}	

	imageReady = (e: any) => {
		// console.log(this.editor.getImage().toDataURL());
	}

	// add nev image
	handleNewImage = (e: any) => {
		// this function is only fo fix bug with canvas 
		// when image is uploaded from different domain

		// create a new image, and canvas
		let img = new Image(),
			canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = function () {
			// get uploaded image 
			img.src = reader.result;
		};
		// set permissions
		img.crossOrigin = 'anonymous';
		var that = this;
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			// draw on canvas uploaded image 
			!ctx ? console.log('error') : ctx.drawImage(img, 0, 0);
			// and convert to base64
			let base64URL = canvas.toDataURL();
			that.setState({ image: base64URL});
		};
	}

	// callback after editor is initialized and image is loaded
	loadSuccess = (imgInfo: any) => {
		console.log('Load success');
	}

	// save changes
	handleSave = () => {
		// is image is changed (add new, zoom, rotate)
		if ( this.state.imageUpdates.isChanged) {
			// convert to file
			let imageFile = this.b64toBlob(this.editor.getImageScaledToCanvas().toDataURL());

			this.setState({ imageUpdates : {
				isChanged: true,
				newImage: imageFile
			}}, () => {
				// add to EdutProfile component
				this.props.onUpdate(this.state.imageUpdates);
			});
		}
	}

	render () {
		// if user is not updated then show loader
		if ( !this.props.userAvatar ) {
			console.log(this.state.image);
			return (<Loader/>);
		} else {
			return (
				<div className="user__avatar">
					<div className="user__avatar--blocks">
						<div>
							<h2>Original Image</h2>
							<Dropzone
								onDrop={this.handleDrop}
								disableClick={true}
								multiple={false}
								style={{marginBottom: '35px' }}
							>	
								<div>
									<AvatarEditor
										ref={(ref: any) => this.setEditorRef(ref)}
										image={this.state.image}
										width={this.state.width}
										height={this.state.height}
										borderRadius={this.state.borderRadius}
										color={[0, 0, 0, 0.6]} // RGBA
										rotate={this.state.rotate}
										scale={this.state.scale}
										onImageReady={this.imageReady}
										onLoadSuccess={this.loadSuccess}
										onDropFile={this.loadSuccess}
										onImageChange={this.imageChange}
									/>
								</div>
							</Dropzone>
							<div>
								<button
									name="save"
									onClick={this.handleSave}
								>
									Save Avatar
								</button>
							</div>
							<div>
								<label htmlFor="newImage">New File:</label>
        						<input name="newImage" id="newImage" type="file" onChange={this.handleNewImage} />
							</div>
							<div>
								<label htmlFor="scale">Zoom:</label>
								<input 
									name="scale"
									id="scale"
									type="range"
									onChange={this.handleScale}
									min="0"
									max="2"
									step="0.01"
									defaultValue="1"
								/>
							</div>
							<div>
								<label htmlFor="rotate">Rotate:</label>
								<input 
									name="rotate"
									id="rotate"
									type="range"
									onChange={this.handleRotate}
									min="0"
									max="360"
									step="0.1"
									defaultValue="0"
								/>
							</div>
						</div>
						
					</div>	
				</div>
			);
		}
	}
}

const mapStateToProps = (state: any) => {
	return {
		userAvatar : state.user.user.AvatarImageRef
	};
};

export default connect(
	mapStateToProps
)(UserAvatar);
