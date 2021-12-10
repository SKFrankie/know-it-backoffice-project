import { Divider } from '@mui/material'
import React from 'react'
import AvatarTable from '../pages/Avatars/AvatarTable'

const ToggleAvatarArray = ({ updatedFields, doUpdate, defaultValue = [] }) => {
  return (
    <>
      <Divider sx={{ m: 5 }} />{' '}
      <AvatarTable
        style={{ textAlign: 'left' }}
        noHeader
        toggleCollection
        updatedFields={updatedFields}
        doUpdate={doUpdate}
        defaultValue={defaultValue}
        maxHeight="25vh"
      />
    </>
  )
}

export default ToggleAvatarArray
