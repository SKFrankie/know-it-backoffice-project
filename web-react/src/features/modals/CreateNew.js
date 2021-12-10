import React, { useEffect, useState } from 'react'
import { Alert, Typography, AlertTitle } from '@mui/material'
import { CTAButton } from '../../ui/Button'
import { Column } from '../../ui/Flex'
import Form from '../../ui/Form'
import { gql, useMutation } from '@apollo/client'
import Modal from '../../ui/Modal'
import EditableField from '../EditableField'
import Button from '../../ui/Button'
import AreYouSure from './AreYouSure'

const DEFAULT_MUTATION = gql`
  mutation DefaultMutation {
    __typename
  }
`
const CreateNew = ({
  name,
  columns,
  QUERY = DEFAULT_MUTATION,
  customMutation = null,
  refetch,
  updatedFields = {},
  children = null,
  submitText = 'Create new',
  successText = ' Item created successfully',
  idKey,
  id,
  deleteItem = null,
  defaultValue = null,
  ...props
}) => {
  const onCompleted = (data) => {
    setData(data)

    if (!Object.keys(updatedFields).length) {
      setFields({})
    }
    refetch()
  }
  const [createNew, { loading }] = useMutation(QUERY, {
    onError(err) {
      console.log(err)
      setError('Be sure you have filled out all the fields and try again.')
    },
    onCompleted,
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
    if (customMutation) {
      customMutation(fields, onCompleted, setError)
    } else {
      createNew({
        variables: fields,
      })
    }
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      {children ? (
        <Button {...props} onClick={handleOpen}>
          {children}
        </Button>
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
                {error}
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
                  defaultValue={defaultValue}
                />
              )
            })}
            <CTAButton type="submit">{submitText}</CTAButton>
            {deleteItem && (
              <DeleteItemButton
                deleteItem={() => {
                  deleteItem({ variables: { [idKey]: id } })
                  setOpen(false)
                }}
              >
                Delete item
              </DeleteItemButton>
            )}
          </Form>
        </Column>
      </Modal>
    </>
  )
}

const DeleteItemButton = ({ children, deleteItem }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <AreYouSure
        open={open}
        setOpen={setOpen}
        onConfirm={deleteItem}
        text={'Are you sure you want to delete this item?'}
      />
      <CTAButton
        onClick={() => {
          setOpen(true)
        }}
        style={{ marginTop: '2vh' }}
        color="error"
        variant="outlined"
      >
        {children}
      </CTAButton>
    </>
  )
}

const UpdateItem = ({
  name = 'Update Item',
  columns,
  QUERY,
  refetch,
  updatedFields,
  children = null,
  canEdit = false,
  idKey,
  id,
  deleteItem,
  toggleItem = false,
  doUpdate,
  defaultValue = null,
  ...props
}) => {
  const [toggle, setToggle] = useState(
    !!defaultValue && defaultValue.includes(id)
  )
  const handleToggle = () => {
    // WARNING the toggle logic only works for avatars, refactoring is needed if you want to use it for other components
    if (!updatedFields.avatarIds) {
      doUpdate('avatarIds', [id])
    } else {
      updatedFields.avatarIds.indexOf(id) === -1
        ? doUpdate('avatarIds', [id, ...updatedFields.avatarIds])
        : doUpdate(
            'avatarIds',
            updatedFields.avatarIds.filter((item) => item !== id)
          )
    }
    setToggle(!toggle)
  }

  useEffect(() => {
    // this is in the case of a submit when creating a new item
    if (!defaultValue && !updatedFields?.avatarIds?.length) {
      setToggle(false)
    }
  }, [updatedFields])

  if (toggleItem) {
    return (
      <Button
        onClick={handleToggle}
        className={toggle ? 'toggledImage' : ''}
        style={{
          ...props.style,
        }}
      >
        {children}
      </Button>
    )
  }
  if (canEdit) {
    return (
      <CreateNew
        name={name}
        columns={columns}
        QUERY={QUERY}
        refetch={refetch}
        updatedFields={updatedFields}
        submitText="Update item"
        successText="Item updated successfully"
        idKey={idKey}
        id={id}
        deleteItem={deleteItem}
        defaultValue={defaultValue}
        {...props}
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
