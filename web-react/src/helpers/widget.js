const makeSureItsHttps = (url) => {
  if (url.startsWith('https')) {
    return url
  }
  const httpsUrl = url.replace('http', 'https')
  return httpsUrl
}

const openWidget = (onSuccess, folder) => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
      uploadPreset: process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET,
      folder: folder,
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        const url = makeSureItsHttps(result.info.url)
        onSuccess(url)
      }
    }
  )
  widget.open()
}

export default openWidget
