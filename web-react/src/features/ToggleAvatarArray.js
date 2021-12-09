import { Divider } from '@mui/material'
import React from 'react'
import AvatarTable from '../pages/Avatars/AvatarTable'

const ToggleAvatarArray = () => {
  return (
    <>
      <Divider sx={{ m: 5 }} />{' '}
      <AvatarTable style={{ textAlign: 'left' }} noHeader toggleCollection />
    </>
  )
}

export default ToggleAvatarArray
