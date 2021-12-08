import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Column } from '../ui/Flex'
import EditableField from './EditableField'
import { UpdateItem } from './modals/CreateNew'

const CollectionTable = ({
  headCells = [],
  rows = [],
  id = '',
  tableName = '',
  refetch = null,
  canEdit = false,
  QUERY = null,
  deleteItem,
  collectionName = 'name',
}) => {
  return (
    <Column style={{ flexWrap: 'wrap' }}>
      {rows.map((row, index) => {
        return (
          <Collection
            key={index}
            row={row}
            headCells={headCells}
            id={id}
            canEdit={canEdit}
            tableName={tableName}
            refetch={refetch}
            QUERY={QUERY}
            deleteItem={deleteItem}
            collectionName={collectionName}
          />
        )
      })}
    </Column>
  )
}

const Collection = ({
  row,
  headCells,
  canEdit,
  collectionName = 'name',
  QUERY = null,
  refetch,
  id,
  deleteItem,
}) => {
  return (
    <UpdateItem
      columns={headCells}
      QUERY={QUERY}
      refetch={refetch}
      updatedFields={row}
      canEdit={canEdit}
      id={row[id]}
      idKey={id}
      deleteItem={deleteItem}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        alignSelf: 'flex-start',
        width: '100%',
      }}
    >
      {headCells.map((headCell) => {
        return (
          <Box key={headCell.id}>
            {headCell.id === collectionName ? (
              <Typography m={3} variant="h6">
                {row[headCell.id]}
              </Typography>
            ) : (
              <Box sx={{ m: 3, display: 'inline-flex' }}>
                <Typography>{headCell.label} :</Typography>
                <EditableField
                  column={headCell}
                  defaultValue={row[headCell.id]}
                />
              </Box>
            )}
          </Box>
        )
      })}
    </UpdateItem>
  )
}

export default CollectionTable
