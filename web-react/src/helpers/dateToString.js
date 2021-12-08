const dateToString = (d) => {
  console.log('date', d)
  if (!d) return ''

  const date = new Date(d)
  const stringDate = `${date.getFullYear().toString().padStart(2, '0')}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  console.log(stringDate)
  return stringDate
}

export default dateToString
