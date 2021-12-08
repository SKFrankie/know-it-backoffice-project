import React, { useEffect, useState } from 'react'
import { Alert, Typography, AlertTitle } from '@mui/material'
import { CTAButton } from '../../ui/Button'
import { Column } from '../../ui/Flex'
import Form from '../../ui/Form'
import { useMutation } from '@apollo/client'
import Modal from '../../ui/Modal'
import EditableField from '../EditableField'
import Button from '../../ui/Button'

const CreateNew = ({
  name,
  columns,
  QUERY,
  refetch,
  updatedFields = {},
  children = null,
  submitText = 'Create new',
  successText = ' Item created successfully',
}) => {
  const [createNew, { loading }] = useMutation(QUERY, {
    onError(err) {
      console.log(err)
      setError(err)
    },
    onCompleted(data) {
      setData(data)
      if (!Object.keys(updatedFields).length) {
        setFields({})
      }
      refetch()
    },
  })

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const [open, setOpen] = React.useState(false)
  const [fields, setFields] = React.useState(updatedFields)

  useEffect(() => {
    setError(null)
    if (data && Object.keys(fields).length) {
      setData(null)
    }
  }, [fields])

  const handleClose = () => {
    setData(null)
    setError(null)
    setFields(updatedFields)
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
      {children ? (
        <Button onClick={handleOpen}>{children}</Button>
      ) : (
        <Button onClick={handleOpen}>{name}</Button>
      )}
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
                {successText}
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
            <CTAButton type="submit">{submitText}</CTAButton>
          </Form>
        </Column>
      </Modal>
    </>
  )
}

const UpdateItem = ({
  name,
  columns,
  QUERY,
  refetch,
  updatedFields,
  children = null,
  canEdit = false,
}) => {
  if (canEdit) {
    return (
      <CreateNew
        name={name}
        columns={columns}
        QUERY={QUERY}
        refetch={refetch}
        updatedFields={updatedFields}
        submitText="Update item"
        successText=" Item updated successfully"
      >
        {children}
      </CreateNew>
    )
  } else {
    return <>{children}</>
  }
}

export { UpdateItem }
export default CreateNew
