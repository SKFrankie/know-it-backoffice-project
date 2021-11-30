import React from 'react'
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
        <TableCell />
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
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, tableName } = props

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
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
}

const Table = ({
  headCells = [],
  rows = [],
  tableName = '',
  extraColumns = null,
  refetch = null,
  count,
  limit = 50,
  hasCheckbox = true,
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
      const newSelecteds = rows.map((n) => n.userId)
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
  extraColumns,
  row,
  headCells,
  handleClick,
  index,
  isSelected,
  hasCheckbox = true,
}) => {
  const [open, setOpen] = React.useState(false)
  const isItemSelected = isSelected(row.userId)
  // WARNING checkbox is not really working, maybe pass it in props?
  const labelId = `enhanced-table-checkbox-${index}`

  return (
    <>
      <TableRow hover tabIndex={-1} selected={isItemSelected}>
        {hasCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              onClick={(event) => handleClick(event, row.userId)}
              color="primary"
              aria-checked={isItemSelected}
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
        )}
        {extraColumns && (
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
          <TableCell
            align={headCell.numeric ? 'right' : 'left'}
            key={headCell.id}
          >
            <Typography color="textSecondary">{row[headCell.id]}</Typography>
          </TableCell>
        ))}
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
                    <TableCell key={extraColumn.id}>
                      <Typography color="textSecondary">
                        {extraColumn.child
                          ? row[extraColumn.id]?.[extraColumn.child]
                          : row[extraColumn.id]}
                      </Typography>
                    </TableCell>
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

export default Table
