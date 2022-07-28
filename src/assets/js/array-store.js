import storage from 'good-storage'

export function remove(key, compare) {
  const items = storage.get(key, [])
  delateFromArray(items, compare)
  storage.set(key, items)
  return items
}

function delateFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)//slice
  }
}

function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function save(item, key, compare, maxLen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key,[])
}