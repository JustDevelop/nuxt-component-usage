const mergeObjectsWithArrayProperties = (a, b) => {
  let newObj = a

  Object.keys(b)
    .forEach((property) => {
      if (Object.keys(a)
        .includes(property)) {
        newObj = { ...newObj, [property]: [...a[property], ...b[property]] }
      } else {
        newObj = { ...newObj, [property]: b[property] }
      }
    })

  return newObj
}

module.exports = mergeObjectsWithArrayProperties
