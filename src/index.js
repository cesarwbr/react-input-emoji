// vendors
import React, { Component } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import t from 'prop-types'
import debounce from 'lodash/debounce'

import './styles.css'

export default class InputEmoji extends Component {
  state = {
    html: '',
    showPicker: false,
    allEmojiStyle: {},
    currentSize: null
  }

  constructor (props) {
    super(props)

    this.textInput = React.createRef()

    if (typeof props.onChange === 'function') {
      this.onChangeDebounced = debounce(this.emitOnChange, 100)
    }
  }

  get value () {
    return this.replaceAllTextEmojiToString()
  }

  set value (value) {
    this.setValue(value)
  }

  focus () {
    this.textInput.current.focus()
  }

  componentDidMount () {
    this.handleContentEditableInputCopyAndPaste()

    this.getAllEmojiStyle()

    this.updateHTML()

    this.listenKeydown()

    this.listenFocus()

    this.setCurrentSize()
  }

  setCurrentSize = () => {
    if (!this.textInput.current) {
      return
    }

    this.setState({
      currentSize: {
        width: this.textInput.current.offsetWidth,
        height: this.textInput.current.offsetHeight
      }
    })
  }

  checkAndEmitResize = () => {
    const { onResize } = this.props
    const { currentSize } = this.state

    const nextSize = {
      width: this.textInput.current.offsetWidth,
      height: this.textInput.current.offsetHeight
    }

    if (!this.state.currentSize ||
      currentSize.width !== nextSize.width ||
      currentSize.height !== nextSize.height) {
      onResize(nextSize)
      this.setState({currentSize: nextSize})
    }
  }

  listenKeydown = () => {
    const { cleanOnEnter, onChange, onEnter } = this.props

    if (cleanOnEnter) {
      this.textInput.current.addEventListener('keydown', event => {
        if (event.keyCode === 13) {
          event.preventDefault()
          return false
        }
      })
      this.textInput.current.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
          const cleanedText = this.replaceAllTextEmojiToString()
          if (typeof onEnter === 'function') {
            onEnter(cleanedText)
          }

          if (typeof onChange === 'function') {
            onChange(cleanedText)
          }

          this.updateHTML('')
        }
      })
    }
  }

  setValue = (value) => {
    this.updateHTML(value)
    this.textInput.current.blur()
  }

  updateHTML = (value = this.props.value) => {
    this.setState({ html: value })
    this.textInput.current.innerHTML = this.replaceAllTextEmojis(value || '')
  }

  emitOnChange = () => {
    this.props.onChange(this.replaceAllTextEmojiToString())
  }

  getAllEmojiStyle = () => {
    const allEmojiButton = document.querySelectorAll('.emoji-mart-category-list > li > button')

    const allEmojiStyle = {}

    allEmojiButton.forEach(emojiButton => {
      const label = emojiButton.getAttribute('aria-label')
      const [emoji] = label.split(',')

      const emojiSpanEl = emojiButton.querySelector('span')

      const style = this.replaceAll(emojiSpanEl.style.cssText, '"', "'")

      allEmojiStyle[emoji] = style
    })

    this.setState({ allEmojiStyle })
  }

  toggleShowPicker = () => {
    this.setState({ showPicker: !this.state.showPicker })
  }

  emitChange = () => {
    const { onChange, onResize, maxLength } = this.props

    if (typeof maxLength !== 'undefined' && Number.isInteger(maxLength)) {
      const totalCharacters = [...this.replaceAllTextEmojiToString()].length

      if (totalCharacters > maxLength) {
        this.textInput.current.innerHTML = ''
        this.pasteHtmlAtCaret(this.state.html)
        return
      }
    }

    const html = this.textInput.current.innerHTML

    this.setState({ html })

    if (typeof onChange === 'function') {
      this.onChangeDebounced(html)
    }

    if (typeof onResize === 'function') {
      this.checkAndEmitResize()
    }
  }

  replaceAllTextEmojiToString = () => {
    if (!this.textInput.current) {
      return ''
    }

    const container = document.createElement('div')
    container.innerHTML = this.textInput.current.innerHTML

    const images = container.querySelectorAll('img')

    images.forEach(image => {
      image.outerHTML = image.dataset.emoji
    })

    let text = container.innerText

    // remove all ↵ for safari
    text = text.replace(/\n/ig, '')

    return text
  }

  pasteHtmlAtCaret = (html) => {
    let sel, range
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0)
        range.deleteContents()

        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        const el = document.createElement('div')
        el.innerHTML = html
        const frag = document.createDocumentFragment(); var node; var lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    } else if (document.selection && document.selection.type !== 'Control') {
      // IE < 9
      document.selection.createRange().pasteHTML(html)
    }
  }

  replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace)
  }

  getImage = (emoji) => {
    let shortNames = `${emoji.short_names}`

    shortNames = this.replaceAll(shortNames, ',', ', ')

    const emojiSpanEl = document.querySelector(
      `[aria-label="${emoji.native}, ${shortNames}"] > span`
    )

    if (!emojiSpanEl) return ''

    const style = this.replaceAll(emojiSpanEl.style.cssText, '"', "'")

    return `<img style="${style}" data-emoji="${emoji.native}" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />`
  }

  replaceAllTextEmojis = (text) => {
    let allEmojis = this.getAllEmojisFromText(text)

    if (allEmojis) {
      allEmojis = [...new Set(allEmojis)] // remove duplicates
      const { allEmojiStyle } = this.state
      allEmojis.forEach(emoji => {
        const style = allEmojiStyle[emoji]

        if (!style) return

        text = this.replaceAll(
          text,
          emoji,
          `<img style="${style}" data-emoji="${emoji}" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />`
        )
      })
    }

    return text
  }

  handleSelectEmoji = (emoji) => {
    const { keepOpenend } = this.props

    this.textInput.current.focus()

    this.pasteHtmlAtCaret(this.getImage(emoji))

    this.textInput.current.focus()

    this.emitChange()

    if (!keepOpenend) {
      this.toggleShowPicker()
    }
  }

  getAllEmojisFromText = (text) => {
    return text.match(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
    )
  }

  handleContentEditableInputCopyAndPaste = () => {
    const self = this
    this.textInput.current.addEventListener('copy', function (e) {
      const selectedText = window.getSelection()

      let container = document.createElement('div')

      for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
        container.appendChild(selectedText.getRangeAt(i).cloneContents())
      }

      container = replaceEmojiToString(container)

      e.clipboardData.setData('text', container.innerText)
      e.preventDefault()

      function replaceEmojiToString (container) {
        const images = container.querySelectorAll('img')

        images.forEach(image => {
          image.outerHTML = image.dataset.emoji
        })

        return container
      }
    })

    // Paste fix for contenteditable
    this.textInput.current.addEventListener('paste', function (e) {
      e.preventDefault()
      let content
      if (window.clipboardData) {
        content = window.clipboardData.getData('Text')
        content = self.replaceAllTextEmojis(content)
        if (window.getSelection) {
          var selObj = window.getSelection()
          var selRange = selObj.getRangeAt(0)
          selRange.deleteContents()
          selRange.insertNode(document.createTextNode(content))
        }
      } else if (e.clipboardData) {
        content = e.clipboardData.getData('text/plain')
        content = self.replaceAllTextEmojis(content)
        document.execCommand('insertHTML', false, content)
      }
    })
  }

  checkIsEmpty = () => {
    const text = this.replaceAllTextEmojiToString()

    return text === ''
  }

  handleClick = () => {
    const { onClick } = this.props

    if (typeof onClick === 'function') {
      onClick()
    }
  }

  listenFocus = () => {
    this.textInput.current.addEventListener('focus', () => {
      const { onFocus } = this.props

      if (typeof onFocus === 'function') {
        onFocus()
      }
    })
  }

  handleKeyDown = (event) => {
    const { onKeyDown } = this.props

    if (typeof onKeyDown === 'function') {
      onKeyDown(event)
    }
  }

  getExcludePicker = () => {
    const { disableRecent } = this.props

    const exclude = []

    if (disableRecent) {
      exclude.push('recent')
    }

    return exclude
  }

  render () {
    const {
      height = 40,
      placeholder = 'Type a message',
      borderRadius = 21,
      borderColor = '#EAEAEA',
      fontSize = 15,
      fontFamily = 'sans-serif',
      inputClass
    } = this.props
    const { showPicker } = this.state

    return (
      <div className='react-emoji'>
        <div
          className='react-emoji-picker--container'
          onClick={this.handleContainerClick}
        >
          <div className={
            `react-emoji-picker--wrapper${
              showPicker ? ' react-emoji-picker--wrapper__show' : ''
            }`
          }>
            <div
              className={
                `react-emoji-picker${
                  showPicker ? ' react-emoji-picker__show' : ''
                }`
              }
            >
              <Picker
                showPreview={false}
                showSkinTones={false}
                set='apple'
                onSelect={this.handleSelectEmoji}
                exclude={this.getExcludePicker()}
              />
            </div>
          </div>
        </div>
        <div
          className='react-input-emoji--container'
          style={{
            borderRadius,
            borderColor,
            fontSize,
            fontFamily
          }}
        >
          <div className='react-input-emoji--wrapper' onClick={this.handleClick}>
            <div
              className='react-input-emoji--placeholder'
              style={{
                visibility: !this.checkIsEmpty() ? 'hidden' : 'visible'
              }}
            >
              {placeholder}
            </div>
            <div
              ref={this.textInput}
              contentEditable
              className={`react-input-emoji--input${inputClass ? ` ${inputClass}` : ''}`}
              onInput={this.emitChange}
              onBlur={this.emitChange}
              onKeyDown={this.handleKeyDown}
              style={{
                paddingTop: `${(height - 20) / 2}px`,
                paddingBottom: `${(height - 20) / 2}px`,
                minHeight: `${height}px`
              }}
            />
          </div>
        </div>
        <button
          className={
            `react-input-emoji--button${
              showPicker ? ' react-input-emoji--button__show' : ''
            }`
          }
          onClick={this.toggleShowPicker}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10' /><path d='M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0' /></svg>
        </button>
        {showPicker &&
          <div
            className='react-input-emoji--overlay'
            onClick={this.toggleShowPicker}
          />
        }
      </div>
    )
  }
}

InputEmoji.propTypes = {
  value: t.string,
  onChange: t.func,
  cleanOnEnter: t.bool,
  onEnter: t.func,
  placeholder: t.string,
  onResize: t.func,
  onClick: t.func,
  onFocus: t.func,
  maxLength: t.number,
  keepOpenend: t.bool,
  onKeyDown: t.func,
  inputClass: t.string,
  disableRecent: t.bool,
  // style
  height: t.number,
  borderRadius: t.number,
  borderColor: t.number,
  fontSize: t.number,
  fontFamily: t.string
}
