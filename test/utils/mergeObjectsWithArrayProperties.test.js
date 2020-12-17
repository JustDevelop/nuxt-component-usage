import mergeObjectsWithArrayProperties from '../../utils/mergeObjectsWithArrayProperties'

const a = {
  a: [1, 2],
  b: [1, 2, 3],
  c: [1]
}
const b = {
  a: [3],
  b: [4, 5],
  d: [1, 2]
}

const expected = {
  a: [1, 2, 3],
  b: [1, 2, 3, 4, 5],
  c: [1],
  d: [1, 2]
}

test('can merge objects and submerge their array properties', () => {
  expect(mergeObjectsWithArrayProperties(a, b))
    .toEqual(expected)
})
