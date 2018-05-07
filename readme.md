# Sn_user_avatar_edit

This is a react component for edit user avatars.
For this package is used [react-cropper](https://github.com/roadmanfong/react-cropper)

# Demo 

A simple demo how to use this component you can find [here](https://github.com/edgardovbak/profil_module)

![Preview](https://github.com/edgardovbak/sn_avatar_editor/blob/master/image/desctop.png)

# !important

To use this package you need to install 

- [atob](https://www.npmjs.com/package/atob) for encode image from base64
- [react-avatar-editor](https://github.com/mosch/react-avatar-editor) component is based on this package
- [react-dropzone](https://github.com/react-dropzone/react-dropzone) drag and drop function for upload images

# How it works

1. Get "userAvatar" from redux store
2. init Editor 
```
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
```
3. Now we can upload picture or modify downloaded picture
4. to save picture modifications press "Save Avatar" button
This action create file from editor that we can send it to SN.
5. How send request for saving picture you can find [here](https://github.com/edgardovbak/profil_module/blob/GetUserInfo/User_avatar/src/components/EditProfil.tsx)

# functions

## makeid 
Generate a custom name for new images

## b64toBlob 
Convert base64 format to File

## useDefaultImage
Remove all modifications from avatar

## handleRotate
Detect rotating actions

## handleDrop 
Drag and drop option for uploading images

## handleScale
Detect zoom actions

## setEditorRef 
Add avatar editor to references

## imageChange
Detect all changes on image ( zoom, rotate ... )

## handleNewImage 
Detect new added image

## handleSave 
Save modifications and send file with image to another component

