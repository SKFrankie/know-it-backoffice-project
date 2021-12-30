import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Column } from '../ui/Flex'
import EditableField from './EditableField'
import { UpdateItem } from './modals/CreateNew'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import AvatarTable from '../pages/Avatars/AvatarTable'

const CollectionTable = ({
  headCells = [],
  rows = [],
  subRows = 'avatars',
  id = '',
  tableName = '',
  refetch = null,
  canEdit = false,
  QUERY = null,
  deleteItem,
  collectionName = 'name',
  additionalFields,
}) => {
  return (
    <Column style={{ flexWrap: 'wrap' }}>
      {rows.map((row) => {
        return (
          <Collection
            key={row[id]}
            row={row}
            subRows={subRows}
            headCells={headCells}
            id={id}
            canEdit={canEdit}
            tableName={tableName}
            refetch={refetch}
            QUERY={QUERY}
            additionalFields={additionalFields}
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
  subRows,
  headCells,
  canEdit,
  collectionName = 'name',
  QUERY = null,
  refetch,
  id,
  deleteItem,
  additionalFields,
}) => {
  const defaultValue = row[subRows].map((item) => item.avatarId) // only working for avatars, need to be refactored for other collections
  return (
    <Box border="1px solid #7B9497" borderRadius="20px" my={2}>
      <UpdateItem
        columns={headCells}
        QUERY={QUERY}
        refetch={refetch}
        updatedFields={{ ...row, ...additionalFields }}
        canEdit={canEdit}
        id={row[id]}
        idKey={id}
        deleteItem={deleteItem}
        defaultValue={defaultValue}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'baseline',
          alignSelf: 'flex-start',
          width: '100%',
          borderRadius: 'inherit',
        }}
        className="secondary"
      >
        {headCells.map((headCell) => {
          return (
            <Box key={headCell.id}>
              {headCell.id === collectionName ? (
                <Typography
                  color="textSecondary"
                  fontWeight="500"
                  m={3}
                  variant="h6"
                >
                  {row[headCell.id]}
                </Typography>
              ) : (
                <Box sx={{ background: 'white', m: 3, display: 'inline-flex' }}>
                  {row[headCell.id] && (
                    <Typography style={{ paddingRight: '2px' }}>
                      {headCell.label} :{' '}
                    </Typography>
                  )}
                  <EditableField
                    column={headCell}
                    defaultValue={row[headCell.id]}
                  />
                </Box>
              )}
            </Box>
          )
        })}
        {canEdit && (
          <EditIcon
            style={{ position: 'absolute', right: '0', margin: '10px' }}
          />
        )}
      </UpdateItem>
      {/* avatar component should be pass as a prop I guess */}
      <AvatarTable noHeader avatars={row[subRows]} collectionId={row[id]} />
    </Box>
  )
}

export default CollectionTable
