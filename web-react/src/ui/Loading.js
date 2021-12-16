import { CircularProgress } from '@mui/material'
import React from 'react'

const Loading = () => {
  return (
    <CircularProgress
      style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        zIndex: '999',
      }}
    />
  )
}

export default Loading
