import React ,{useState} from 'react';

import ReactPanZoom from 'react-image-pan-zoom-rotate';


const AttachmentImageViewer = ({imageSrc, width, height}) => {
   
  return (
    <div style={{ width: width || '100%', height: height || '100%', position: 'relative' }}>

<ReactPanZoom

      image={imageSrc}
      width={width}
      height = {height}
    controlsPosition="left"
    />

  </div>
  )
}

export default AttachmentImageViewer;
