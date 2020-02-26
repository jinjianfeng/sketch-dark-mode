import $ from './jquery'
import {
  isValidColor,
  getRegularHexValue,
  hasColorsWithoutName
} from './utils'

const $colorsList = $('.js-colors-list')
const $errorMessage = $('.js-error-message')
const $cancelButton = $('.js-cancel-button')
const $saveButton = $('.js-save-button')

const interceptClickEvent = (event) => {
  const target = event.target.closest('a')

  if (target && target.getAttribute('target') === '_blank') {
    event.preventDefault()
    window.postMessage('externalLinkClicked', target.href)
  }
}

const handleDarkThemeColorsChanges = () => {
  const $darkThemeColors = $('.js-color-theme-input-dark')

  $darkThemeColors.on('change paste keyup', function () {
    const colorValue = $(this).val()
    const $colorPreview = $(this).parent().find('.js-color-theme-preview-dark')

    if (isValidColor(colorValue)) {
      $colorPreview
        .removeClass('empty')
        .css('background-color', colorValue)
    } else {
      $colorPreview
        .addClass('empty')
        .css('background-color', 'transparent')
    }
  })
}

window.createPaletteUI = (documentColors, savedDarkThemeColors) => {
  if (documentColors.length > 0 && !hasColorsWithoutName(documentColors)) {
    const $colorThemePrototype = $('.js-color-theme-prototype')

    documentColors.forEach((documentColor) => {
      const $colorThemeInstance = $colorThemePrototype
        .first()
        .clone()
        .appendTo('.js-colors-list')
        .removeClass('js-color-theme-prototype')
        .addClass('js-color-theme')
        .attr('data-name', documentColor.name)

      $colorThemeInstance
        .find('.js-color-theme-name')
        .text(documentColor.name)

      const colorValue = getRegularHexValue(documentColor.color)

      $colorThemeInstance
        .find('.js-color-theme-input-light')
        .val(colorValue)

      $colorThemeInstance
        .find('.js-color-theme-preview-light')
        .css('background-color', colorValue)
    })

    if (savedDarkThemeColors && savedDarkThemeColors.length > 0) {
      savedDarkThemeColors.forEach((savedDarkThemeColor) => {
        const $darkColorTheme = $colorsList.find(
          `[data-name="${savedDarkThemeColor.name}"]`
        )

        if ($darkColorTheme.length > 0) {
          const colorValue = getRegularHexValue(savedDarkThemeColor.color)

          if (isValidColor(colorValue)) {
            $darkColorTheme
              .find('.js-color-theme-input-dark')
              .val(colorValue)

            $darkColorTheme
              .find('.js-color-theme-preview-dark')
              .removeClass('empty')
              .css('background-color', colorValue)
          }
        }
      })
    }

    $colorThemePrototype.remove()
    $colorsList.css('opacity', 1)
    handleDarkThemeColorsChanges()
  } else {
    $colorsList.hide()
    $errorMessage.show()
    $saveButton.attr('disabled', true)
  }
}

$cancelButton.click(() => {
  window.postMessage('closeWindow')
})

$saveButton.click(() => {
  const $colorThemes = $('.js-color-theme')
  const darkThemeColors = []

  $colorThemes.each(function () {
    const colorName = $(this).find('.js-color-theme-name').text()
    const colorValue = $(this).find('.js-color-theme-input-dark').val()

    if (isValidColor(colorValue)) {
      darkThemeColors.push({
        type: 'ColorAsset',
        name: colorName,
        color: `${colorValue}ff`
      })
    }
  })

  window.postMessage('saveDarkThemePalette', darkThemeColors)
})

// listen for link click events at the document level
document.addEventListener('click', interceptClickEvent)

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  // e.preventDefault()
})
