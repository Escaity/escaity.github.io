export const dealLabel = (label) => {
  if (!label || (Array.isArray(label) && label.length === 0)) {
    return []
  } else if (typeof label === 'string') {
    let arr = label.split(',')
    return [...arr]
  } else if (Array.isArray(label)) {
    return [...label]
  }
  return []
}
