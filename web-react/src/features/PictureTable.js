import React from 'react'
import EditablePicture from '../components/EditablePicture'

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
  return rows.map((row, index) => {
    return (
      <PictureRow
        key={index}
        row={row}
        headCells={headCells}
        id={id}
        pictureId={pictureId}
      />
    )
  })
}

const PictureRow = ({ row, headCells, id, pictureId }) => {
  return headCells.map((headCell) => {
    return (
      <>
        {headCell.id === pictureId ? (
          <EditablePicture column={headCell} defaultValue={row[pictureId]} />
        ) : (
          <p key={row[id]}>{row[headCell.id]}</p>
        )}
      </>
    )
  })
}

export default PictureTable
