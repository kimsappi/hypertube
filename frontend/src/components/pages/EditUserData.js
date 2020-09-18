import React, { useState, useRef, useCallback } from "react";

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EditUserData = () =>
{
	const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
	const [completedCrop, setCompletedCrop] = useState(null);
	const imgRef = useRef(null);


	const onLoad = useCallback(img => {
		imgRef.current = img;
	  }, []);
	
	return (
		<ReactCrop
			src={"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"}
			onImageLoaded={onLoad}
			crop={crop}
			onChange={c => setCrop(c)}
			onComplete={c => setCompletedCrop(c)}
		/>
	)
}
export default EditUserData;