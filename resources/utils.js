export const isValidColor = (value) => {
  return /^#[0-9A-F]{6}$/i.test(value)
}

export const getRegularHexValue = (value) => {
  return value.slice(0, -2)
}

export const hasColorsWithoutName = (documentColors) => {
  let result = false

  for (let i = 0; i < documentColors.length; i++) {
    if (!documentColors[i].name || documentColors[i].name.length === 0) {
      result = true
      break
    }
  }

  return result
}
