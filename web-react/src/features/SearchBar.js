import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect } from 'react'
import { Input } from '../ui/Form'

const SearchBar = ({
  searchFields = [{ label: 'no fields', id: 'no-fields' }],
  refetch,
  sx,
}) => {
  const [search, setSearch] = React.useState('')
  const [searchBy, setSearchBy] = React.useState(searchFields[0])
  const [menuItems, setMenuItems] = React.useState(searchFields)
  const fieldToSearch = (field) => {
    if (field.id === 'no-fields') return ''
    return `${field.id}_CONTAINS`
  }
  useEffect(() => {
    const tmpSearchFields = searchFields.filter(({ numeric }) => {
      return !numeric
    })

    setMenuItems(tmpSearchFields)
    setSearchBy(tmpSearchFields[0])
  }, [])

  useEffect(() => {
    if (!search) {
      refetch({ filter: null })
      return
    }
    if (refetch && searchBy.id !== 'no-fields') {
      refetch({ filter: { [fieldToSearch(searchBy)]: search } })
    }
  }, [search, searchBy])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchBy = (e) => {
    const tmpSearchBy = menuItems.find((field) => field.id === e.target.value)
    setSearchBy(tmpSearchBy)
  }

  return (
    <Box sx={{ ...sx }}>
      <Input
        placeholder={`Search by ${searchBy.label}`}
        value={search}
        onChange={handleSearch}
        sx={{ width: '30%', borderRadius: '5px' }}
      />
      <FormControl>
        <InputLabel id="select-search">Search by</InputLabel>
        <Select
          labelId="select-search"
          value={searchBy.id}
          label={searchBy.label}
          onChange={handleSearchBy}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ m: 1 }}
        >
          {menuItems.map((menuItem) => (
            <MenuItem key={menuItem.id} value={menuItem.id}>
              {menuItem.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SearchBar
