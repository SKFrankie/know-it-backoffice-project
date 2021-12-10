import { Typography } from '@mui/material'
import React from 'react'
import EditablePicture from './EditablePicture'
import Flex from '../ui/Flex'
import Popover from '../ui/Popover'
import { UpdateItem } from './modals/CreateNew'

const PictureTable = ({
  headCells = [],
  rows = [],
  id = '',
  pictureId = 'picture',
  tableName = '',
  refetch = null,
  canEdit = false,
  QUERY = null,
  deleteItem,
  toggleCollection = false,
  doUpdate,
  updatedFields,
  defaultValue = [],
  maxHeight = null,
  pictureMapping = null,
  ...props
}) => {
  return (
    <Flex
      style={{
        ...props.style,
        flexWrap: 'wrap',
        maxHeight: maxHeight ? maxHeight : null,
        overflowY: maxHeight ? 'scroll' : null,
      }}
    >
      {rows.map((row, index) => {
        return (
          <PictureRow
            key={index}
            row={row}
            headCells={headCells}
            id={id}
            pictureId={pictureId}
            canEdit={canEdit}
            tableName={tableName}
            refetch={refetch}
            QUERY={QUERY}
            deleteItem={deleteItem}
            toggleCollection={toggleCollection}
            doUpdate={doUpdate}
            updatedFields={updatedFields}
            defaultValue={defaultValue}
            pictureMapping={pictureMapping}
          />
        )
      })}
    </Flex>
  )
}

const PictureRow = ({
  row,
  headCells,
  pictureId,
  canEdit,
  tableName = '',
  QUERY = null,
  refetch,
  id,
  deleteItem,
  toggleCollection,
  doUpdate,
  updatedFields,
  defaultValue = [],
  pictureMapping = null,
}) => {
  const getPictureFromMapping = (picture) => {
    if (!pictureMapping) return picture
    const pictureItem = pictureMapping.find((p) => p.id === picture)
    return pictureItem.picture
  }

  return (
    <Popover
      text={
        toggleCollection
          ? 'Click to add/remove from collection'
          : canEdit && `Click to edit ${tableName}`
      }
      style={{
        maxWidth: 'fit-content',
        position: 'relative',
        margin: '10px',
        cursor: 'pointer',
      }}
    >
      <UpdateItem
        columns={headCells}
        QUERY={QUERY}
        refetch={refetch}
        updatedFields={toggleCollection ? updatedFields : row}
        canEdit={canEdit}
        id={row[id]}
        idKey={id}
        deleteItem={deleteItem}
        toggleItem={toggleCollection}
        doUpdate={doUpdate}
        defaultValue={defaultValue}
        style={{ padding: 0 }}
      >
        {headCells.map((headCell) => {
          return (
            <div key={headCell.id}>
              {headCell.id === pictureId ? (
                <EditablePicture
                  column={headCell}
                  defaultValue={getPictureFromMapping(row[pictureId])}
                />
              ) : (
                <Typography
                  color="textSecondary"
                  fontWeight="500"
                  style={{
                    position: 'absolute',
                    left: headCell.left,
                    top: headCell.top,
                    bottom: headCell.bottom,
                    right: headCell.right,
                    fontSize: '0.7rem',
                  }}
                >
                  {headCell.beforeText} {row[headCell.id]}{' '}
                  {headCell.additionalText}
                </Typography>
              )}
            </div>
          )
        })}
      </UpdateItem>
    </Popover>
  )
}

export default PictureTable
