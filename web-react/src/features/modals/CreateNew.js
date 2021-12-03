import React, { useEffect, useState } from 'react'
import { Button, Alert, Typography, AlertTitle } from '@mui/material'
import { CTAButton } from '../../ui/Button'
import { Column } from '../../ui/Flex'
import Form from '../../ui/Form'
import { useMutation } from '@apollo/client'
import Modal from '../../ui/Modal'
import EditableField from '../EditableField'

const CreateNew = ({ name, columns, QUERY, refetch }) => {
  const [createNew, { loading }] = useMutation(QUERY, {
    onError(err) {
      console.log(err)
      setError(err)
    },
    onCompleted(data) {
      setData(data)
      setFields({})
      refetch()
    },
  })

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const [open, setOpen] = React.useState(false)
  const [fields, setFields] = React.useState({})

  useEffect(() => {
    setError(null)
    if (data && Object.keys(fields).length) {
      setData(null)
    }
  }, [fields])

  const handleClose = () => {
    setData(null)
    setError(null)
    setFields({})
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    createNew({
      variables: fields,
    })
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleOpen}>{name}</Button>
      <Modal open={open} setOpen={setOpen} onClose={handleClose}>
        <Column
          sx={{
            textAlign: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" color="textPrimary">
            {name}
          </Typography>
          <Form onSubmit={handleSubmit} style={{ margin: '5%', width: '100%' }}>
            {error && !loading && (
              <Alert sx={{ m: 1 }} severity="error">
                <AlertTitle>Error</AlertTitle>
                Be sure you have filled out all the fields and try again.
              </Alert>
            )}
            {data && (
              <Alert sx={{ m: 1 }} severity="success">
                <AlertTitle>Success</AlertTitle>
                Item created successfully
              </Alert>
            )}
            {columns.map((column) => {
              return (
                <EditableField
                  editMode={true}
                  key={column.id}
                  column={column}
                  setUpdatedFields={setFields}
                  required={column.required}
                  updatedFields={fields}
                />
              )
            })}
            <CTAButton type="submit">Create new</CTAButton>
          </Form>
        </Column>
      </Modal>
    </>
  )
}

export default CreateNew
