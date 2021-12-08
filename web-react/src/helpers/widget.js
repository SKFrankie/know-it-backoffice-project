const openWidget = (onSuccess, folder) => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
      uploadPreset: process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET,
      folder: folder,
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result.info.url)
      }
    }
  )
  widget.open()
}

export default openWidget
