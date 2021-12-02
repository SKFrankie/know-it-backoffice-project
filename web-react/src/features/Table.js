import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import MUITable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { Input } from '../ui/Form'
import Popover from '../ui/Popover'
import AreYouSure from './modals/AreYouSure'

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    hasCheckbox = true,
    hasCollapse = false,
    canEdit = false,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {hasCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        )}
        {hasCollapse && <TableCell />}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={
              orderBy === headCell.id ? order.toLowerCase() : false
            }
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order.toLowerCase() : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'DESC' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {canEdit && <TableCell />}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
  orderBy: PropTypes.string,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.arrayOf(String).isRequired,
  hasCheckbox: PropTypes.bool,
  hasCollapse: PropTypes.bool,
  canEdit: PropTypes.bool,
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, tableName, deleteItems } = props
  const [areYouSure, setAreYouSure] = useState(false)

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableName}
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => {
              setAreYouSure(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      <AreYouSure
        open={areYouSure}
        setOpen={setAreYouSure}
        onConfirm={deleteItems}
        text={'Are you sure you want to delete these items?'}
      />
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
  deleteItems: PropTypes.func,
}

const Table = ({
  headCells = [],
  rows = [],
  tableName = '',
  extraColumns = [],
  refetch = null,
  count,
  limit = 50,
  hasCheckbox = true,
  canEdit = false,
  setFields,
  deleteItem,
  id = '',
}) => {
  const [order, setOrder] = React.useState('ASC')
  const [orderBy, setOrderBy] = React.useState(null)
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(limit)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'ASC'
    const tmpOrder = isAsc ? 'DESC' : 'ASC'
    setOrder(tmpOrder)
    setOrderBy(property)
    setPage(0)
    refetch({
      limit: rowsPerPage,
      offset: 0,
      orderBy: { [property]: tmpOrder },
    })
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n[id])
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    const tmpOrderBy = orderBy ? { [orderBy]: order } : null
    // duplicate refetch needs to be fixed like in searchbar with useeffect
    refetch({
      limit: rowsPerPage,
      offset: rowsPerPage * newPage,
      orderBy: tmpOrderBy,
    })
  }

  const handleChangeRowsPerPage = (event) => {
    const tmpRowsPerPage = parseInt(event.target.value, 10)
    const tmpOrderBy = orderBy ? { [orderBy]: order } : null
    setRowsPerPage(tmpRowsPerPage)
    setPage(0)
    refetch({
      limit: tmpRowsPerPage,
      offset: 0,
      orderBy: tmpOrderBy,
    })
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const deleteSelected = () => {
    for (const item of selected) {
      deleteItem({ variables: { [id]: item } })
    }
    setSelected([])
  }

  return (
    <Box sx={{ width: '100%', m: 1 }}>
      {!count && <Typography variant="h6">No {tableName} found</Typography>}
      {count && (
        <Paper
          sx={{
            width: '100%',
            mb: 2,
            borderRadius: '13px',
            border: '1px solid #7B9497',
          }}
        >
          <EnhancedTableToolbar
            numSelected={selected.length}
            tableName={tableName}
            deleteItems={deleteSelected}
          />
          <TableContainer>
            <MUITable sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
                hasCheckbox={hasCheckbox}
                hasCollapse={extraColumns.length > 0}
                canEdit={canEdit}
              />
              <TableBody>
                {rows.length &&
                  rows.map((row, index) => {
                    return (
                      <Row
                        headCells={headCells}
                        key={index}
                        row={row}
                        index={index}
                        isSelected={isSelected}
                        handleClick={handleClick}
                        extraColumns={extraColumns}
                        hasCheckbox={hasCheckbox}
                        canEdit={canEdit}
                        setFields={setFields}
                        id={id}
                      />
                    )
                  })}
              </TableBody>
            </MUITable>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[1, 10, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  )
}

const Row = ({
  extraColumns = [],
  row,
  headCells,
  handleClick,
  index,
  isSelected,
  hasCheckbox = true,
  canEdit = false,
  setFields,
  id,
}) => {
  const [open, setOpen] = React.useState(false)
  const isItemSelected = isSelected(row[id])
  const labelId = `enhanced-table-checkbox-${index}`
  const [isEditing, setIsEditing] = useState(false)

  const [updatedFields, setUpdatedFields] = useState({})

  const updateFields = () => {
    setFields({ variables: { [id]: row[id], ...updatedFields } })
    setIsEditing(false)
    setUpdatedFields({})
  }
  const cancelUpdateFields = () => {
    setUpdatedFields({})
    setIsEditing(false)
  }

  return (
    <>
      <TableRow hover tabIndex={-1} selected={isItemSelected}>
        {hasCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              onClick={(event) => handleClick(event, row[id])}
              color="primary"
              aria-checked={isItemSelected}
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
        )}
        {!!extraColumns.length && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <Cell
            editMode={isEditing}
            key={headCell.id}
            cell={headCell}
            row={row}
            setUpdatedFields={setUpdatedFields}
            updatedFields={updatedFields}
          />
        ))}
        {canEdit && !isEditing && (
          <TableCell padding="normal">
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>
          </TableCell>
        )}
        {isEditing && (
          <TableCell padding="normal">
            <Popover text="Save changes">
              <IconButton
                aria-label="valid"
                size="small"
                sx={{ color: 'green' }}
                onClick={updateFields}
              >
                <DoneOutlinedIcon />
              </IconButton>
            </Popover>
            <Popover text="Cancel changes">
              <IconButton
                aria-label="cancel"
                size="small"
                onClick={cancelUpdateFields}
                sx={{ color: 'red' }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Popover>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MUITable size="small">
              <TableHead>
                <TableRow>
                  {extraColumns.map((extraColumn) => (
                    <TableCell key={extraColumn.id}>
                      {extraColumn.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {extraColumns.map((extraColumn) => (
                    <Cell key={extraColumn.id} cell={extraColumn} row={row} />
                  ))}
                </TableRow>
              </TableBody>
            </MUITable>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Cell = ({
  cell,
  row,
  setUpdatedFields,
  updatedFields = {},
  editMode = false,
}) => {
  const value = cell.child ? row[cell.id]?.[cell.child] : row[cell.id]
  return (
    <TableCell align={cell.numeric ? 'right' : 'left'} key={cell.id}>
      {editMode && cell.editable ? (
        <Input
          onChange={(e) => {
            setUpdatedFields({ ...updatedFields, [cell.id]: e.target.value })
          }}
          value={updatedFields[cell.id] || value || ''}
        />
      ) : (
        <Typography color="textSecondary">
          {cell.datetime && value ? new Date(value).toLocaleString() : value}
        </Typography>
      )}
    </TableCell>
  )
}

export default Table
