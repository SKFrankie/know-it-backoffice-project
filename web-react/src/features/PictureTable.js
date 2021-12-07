import { Box, Typography } from '@mui/material'
import React from 'react'
import EditablePicture from '../components/EditablePicture'
import Flex from '../ui/Flex'

const PictureTable = ({
  headCells = [],
  rows = [],
  id = '',
  pictureId = 'picture',
  // tableName = '',
  // extraColumns = [],
  // refetch = null,
  // count,
  // limit = 50,
  // hasCheckbox = false,
  // canEdit = false,
  // setFields,
  // deleteItem,
}) => {
  return (
    <Flex style={{ flexWrap: 'wrap' }}>
      {rows.map((row, index) => {
        return (
          <PictureRow
            key={index}
            row={row}
            headCells={headCells}
            id={id}
            pictureId={pictureId}
          />
        )
      })}
    </Flex>
  )
}

const PictureRow = ({ row, headCells, id, pictureId }) => {
  return (
    <Box
      key={row[id]}
      style={{ maxWidth: 'fit-content', position: 'relative', margin: '10px' }}
    >
      {headCells.map((headCell) => {
        return (
          <>
            {headCell.id === pictureId ? (
              <EditablePicture
                column={headCell}
                defaultValue={row[pictureId]}
              />
            ) : (
              <Typography
                style={{
                  position: 'absolute',
                  left: headCell.left,
                  top: headCell.top,
                  bottom: headCell.bottom,
                  right: headCell.right,
                }}
              >
                {row[headCell.id]}
              </Typography>
            )}
          </>
        )
      })}
    </Box>
  )
}

export default PictureTable
