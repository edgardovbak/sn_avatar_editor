# Sn_user_avatar_edit

This is a react component for edit user avatars.
For this package is used [react-cropper](https://github.com/roadmanfong/react-cropper)

# Demo 

A simple demo how to use this component you can find [here](https://github.com/edgardovbak/profil_module)

# !important

To use this package you need to install 

- [atob](https://www.npmjs.com/package/atob) for encode image from base64
- [react-cropper](https://github.com/roadmanfong/react-cropper) component is based on this package
- [react-redux](https://github.com/reactjs/react-redux) 

# How it works

1. Get "userAvatar" from redux store
2. init Cropper 
```
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
```
3. Now we can upload picture or modify downloaded picture
4. to save picture modifications press "Save Image" button
5. this action run the "cropImage" function. In this function we create a rnadom image name (makeid function) and convert canvas to file (b64toBlob function)
6. And send this file to other component

# functions

## useDefaultImage 
Delete all changes

## setEditorRef 
Add image editor to react references
