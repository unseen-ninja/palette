const copyToClipboard = (content) => navigator.clipboard.writeText(content)

const showIndicator = (hex) => {
  const indicator = document.getElementById('copied'),
        className = 'is-visible'

  indicator.style.setProperty('--copied-swatch-colour', hex)
  indicator.classList.add(className)
  setTimeout(
    () => indicator.classList.remove(className),
    "1000"
  )
}



const clickTrigger = (hex) => {
  copyToClipboard(hex)
  showIndicator(hex)
}
