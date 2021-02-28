// vendors
import React, { useState, useImperativeHandle, useEffect, useRef, forwardRef, useCallback, useMemo } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import t from 'prop-types'

// css
import './styles.css'

// utils
import useDebounce from './utils/use-debounce'

function InputEmoji ({
  value,
  onChange,
  cleanOnEnter,
  onEnter,
  placeholder,
  onResize,
  onClick,
  onFocus,
  maxLength,
  keepOpenend,
  onKeyDown,
  inputClass,
  disableRecent,
  tabIndex,
  // style
  height,
  borderRadius,
  borderColor,
  fontSize,
  fontFamily
}, ref) {
  const [showPicker, setShowPicker] = useState(false)
  const [allEmojiStyle, setAllEmojiStyle] = useState({})
  const [currentSize, setCurrentSize] = useState(null)

  const textInputRef = useRef(null)
  const cleanedTextRef = useRef('')
  const placeholderRef = useRef(null)
  const mentionRef = useRef(null)

  useImperativeHandle(ref, () => ({
    get value () {
      return cleanedTextRef.current
    },
    set value (value) {
      setValue(value)
    },
    focus: () => {
      textInputRef.current.focus()
    },
    blur: () => {
      replaceAllTextToString()
    },
    setUserMention: (userMention) => {
      handleSetUserMention(userMention)
    }
  }))

  useEffect(() => {
    if (value && value.length > 0) {
      placeholderRef.current.style.opacity = 0
    } else {
      placeholderRef.current.style.opacity = 1
    }
  }, [value])

  const replaceAllTextEmojis = useCallback((text) => {
    let allEmojis = getAllEmojisFromText(text)

    if (allEmojis) {
      allEmojis = [...new Set(allEmojis)] // remove duplicates

      allEmojis.forEach(emoji => {
        const style = allEmojiStyle[emoji]

        if (!style) return

        text = replaceAll(
          text,
          emoji,
          `<img style="${style}" data-emoji="${emoji}" src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />`
        )
      })
    }

    return text
  }, [allEmojiStyle])

  const replaceAllMentions = useCallback((text) => {
    const allUserMentions = getAllMentions(text)

    if (!allUserMentions) {
      return text
    }

    allUserMentions.forEach(userMention => {
      const [ name ] = userMention.match(/(?<=\[).+?(?=\])/g)
      // const [ userId ] = userMention.match(/(?<=\(userId:).+?(?=\))/g)
      text = text.replaceAll(userMention, `<span style="color: #0A91E6;" data-mention="${userMention}">@${name}</span> `)
    })

    return text
  }, [])

  /**
   *
   * @param {string} text
   * @returns {string[] | null}
   */
  function getAllMentions (text) {
    return text.match(/@\[([^\]]+?)\]\(([^)]+?)\)/g)
  }

  const updateHTML = useCallback((nextValue) => {
    nextValue = nextValue || value
    textInputRef.current.innerHTML = replaceAllTextEmojis(nextValue || '')
    textInputRef.current.innerHTML = replaceAllMentions(nextValue || '')
  }, [replaceAllTextEmojis, replaceAllMentions])

  const checkAndEmitResize = useCallback(() => {
    const nextSize = {
      width: textInputRef.current.offsetWidth,
      height: textInputRef.current.offsetHeight
    }

    if (!currentSize ||
      currentSize.width !== nextSize.width ||
      currentSize.height !== nextSize.height) {
      onResize(nextSize)
      setCurrentSize(nextSize)
    }
  }, [currentSize, onResize])

  const emitChange = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange(cleanedTextRef.current)
    }

    if (typeof onResize === 'function') {
      checkAndEmitResize()
    }
  }, [checkAndEmitResize, onChange, onResize])

  useEffect(() => {
    function handleCopy (e) {
      const selectedText = window.getSelection()

      let container = document.createElement('div')

      for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
        container.appendChild(selectedText.getRangeAt(i).cloneContents())
      }

      container = replaceEmojiToString(container)

      e.clipboardData.setData('text', container.innerText)
      e.preventDefault()

      function replaceEmojiToString (container) {
        const images = Array.prototype.slice.call(container.querySelectorAll('img'))

        images.forEach(image => {
          image.outerHTML = image.dataset.emoji
        })

        return container
      }
    }

    function handlePaste (e) {
      e.preventDefault()
      let content
      if (window.clipboardData) {
        content = window.clipboardData.getData('Text')
        content = replaceAllTextEmojis(content)
        if (window.getSelection) {
          var selObj = window.getSelection()
          var selRange = selObj.getRangeAt(0)
          selRange.deleteContents()
          selRange.insertNode(document.createTextNode(content))
        }
      } else if (e.clipboardData) {
        content = e.clipboardData.getData('text/plain')
        content = replaceAllTextEmojis(content)
        document.execCommand('insertHTML', false, content)
      }
    }

    const inputEl = textInputRef.current

    const handleContentEditableInputCopyAndPaste = () => {
      inputEl.addEventListener('copy', handleCopy)
      inputEl.addEventListener('paste', handlePaste)
    }

    handleContentEditableInputCopyAndPaste()

    return () => {
      inputEl.removeEventListener('copy', handleCopy)
      inputEl.removeEventListener('paste', handlePaste)
    }
  }, [replaceAllTextEmojis])

  useEffect(() => {
    const allEmojiButton = Array.prototype.slice.call(document.querySelectorAll('.emoji-mart-category-list > li > button'))

    const allEmojiStyle = {}

    allEmojiButton.forEach(emojiButton => {
      const label = emojiButton.getAttribute('aria-label')
      const [emoji] = label.split(',')

      const emojiSpanEl = emojiButton.querySelector('span')

      const style = replaceAll(emojiSpanEl.style.cssText, '"', "'")

      allEmojiStyle[emoji] = style
    })

    setAllEmojiStyle(allEmojiStyle)
  }, [])

  useEffect(() => {
    updateHTML()
  }, [updateHTML])

  const replaceAllTextToString = useCallback(() => {
    if (!textInputRef.current) {
      cleanedTextRef.current = ''
    }

    const container = document.createElement('div')
    container.innerHTML = textInputRef.current.innerHTML

    const images = Array.prototype.slice.call(container.querySelectorAll('img'))

    images.forEach(image => {
      image.outerHTML = image.dataset.emoji
    })

    const mentions = Array.prototype.slice.call(container.querySelectorAll('[data-mention]'))

    mentions.forEach(mention => {
      mention.outerHTML = mention.dataset.mention
    })

    let text = container.innerText

    // remove all ↵ for safari
    text = text.replace(/\n/ig, '')

    cleanedTextRef.current = text

    checkPlaceholder()

    emitChange()
  }, [emitChange])

  const [ replaceAllTextToStringDebounced ] = useDebounce(replaceAllTextToString, 500)

  useEffect(() => {
    function handleKeydown (event) {
      placeholderRef.current.style.opacity = 0

      if (typeof maxLength !== 'undefined' && event.keyCode !== 8 && totalCharacters() >= maxLength) {
        event.preventDefault()
      }

      if (event.keyCode === 13) {
        event.preventDefault()

        replaceAllTextToString()

        const cleanedText = cleanedTextRef.current

        if (typeof onEnter === 'function') {
          onEnter(cleanedText)
        }

        if (cleanOnEnter) {
          updateHTML('')
        }

        if (typeof onKeyDown === 'function') {
          onKeyDown(event)
        }

        return false
      }

      if (typeof onKeyDown === 'function') {
        onKeyDown(event)
      }
    }

    /**
     *
     * @param {number} keyCode
     */
    function isKeyArrow (keyCode) {
      return keyCode >= 37 && keyCode <= 40
    }

    /**
     *
     * @param {number} keyCode
     */
    function checkMentionStart (keyCode) {
      if (keyCode === 50) {
        const selection = window.getSelection()
        const caretPostion = getCaretPosition()
        const textContent = selection.focusNode.textContent

        if (caretPostion - 1 === 0 || textContent[caretPostion - 2] === ' ') {
          console.log('mention status: start')
          console.log('start mention', {caretPostion, textContent})
          mentionRef.current = {
            startPosition: caretPostion - 1,
            selection,
            endPosition: caretPostion + 1
          }
        }
      }
    }

    function checkMentionStatus () {
      if (mentionRef.current) {
        /** @type {string} */
        const textContent = mentionRef.current.selection.focusNode.textContent
        const caretPostion = getCaretPosition()

        mentionRef.current.endPosition = caretPostion
        const mentionText = textContent.substring(mentionRef.current.startPosition, caretPostion)
        const afterStart = textContent.substring(mentionRef.current.startPosition + 1, caretPostion)

        console.log('start:', mentionRef.current.startPosition, 'current:', caretPostion)
        console.log({afterStart, mentionText})
        if (afterStart[0] === ' ' || afterStart.includes('@') || mentionText.length === 0) {
          mentionRef.current = null
          console.log('mention status: end')
        } else {
          console.log('mention:', mentionRef.current, {afterStart, caretPostion})
          console.log(`mention status: search for "${afterStart}"`)
        }
      }
    }

    /**
     *
     * @param {number} keyCode
     */
    function checkDeleteMetion (keyCode) {
      const selection = window.getSelection()
      const parentEl = selection.focusNode.parentElement
      if (parentEl.dataset.mention && !isKeyArrow(keyCode)) {
        console.log(window.getSelection())
        textInputRef.current.removeChild(parentEl)
      }
    }

    /**
     *
     * @param {import('react').KeyboardEvent<HTMLElement>} event
     */
    function handleMention (event) {
      const keyCode = event.keyCode
      checkMentionStart(keyCode)

      checkMentionStatus()

      checkDeleteMetion(keyCode)
    }

    /**
     *
     * @param {import('react').KeyboardEvent<HTMLElement>} event
     */
    function handleKeyup(event) {
      handleMention(event)
      replaceAllTextToStringDebounced()
    }

    const inputEl = textInputRef.current

    inputEl.addEventListener('keydown', handleKeydown)
    inputEl.addEventListener('keyup', handleKeyup)

    return () => {
      inputEl.removeEventListener('keydown', handleKeydown)
      inputEl.removeEventListener('keyup', handleKeyup)
    }
  }, [onChange, cleanOnEnter, onEnter, updateHTML, replaceAllTextToString, replaceAllTextToStringDebounced, emitChange, maxLength, onKeyDown])

  useEffect(() => {
    function handleFocus() {
      if (typeof onFocus === 'function') {
        onFocus()
      }
    }

    const inputEl = textInputRef.current

    inputEl.addEventListener('focus', handleFocus)

    return () => {
      inputEl.removeEventListener('focus', handleFocus)
    }
  }, [onFocus])

  function getCaretPosition() {
    const editableDiv = textInputRef.current
    var caretPos = 0
    var sel; var range
    if (window.getSelection) {
      sel = window.getSelection()
      if (sel.rangeCount) {
        range = sel.getRangeAt(0)
        if (range.commonAncestorContainer.parentNode === editableDiv) {
          caretPos = range.endOffset
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange()
      if (range.parentElement() === editableDiv) {
        var tempEl = document.createElement('span')
        editableDiv.insertBefore(tempEl, editableDiv.firstChild)
        var tempRange = range.duplicate()
        tempRange.moveToElementText(tempEl)
        tempRange.setEndPoint('EndToEnd', range)
        caretPos = tempRange.text.length
      }
    }
    return caretPos
  }

  function totalCharacters () {
    const text = textInputRef.current.innerText
    const html = textInputRef.current.innerHTML

    const textCount = text.length
    const emojisCount = (html.match(/<img/g) || []).length

    return textCount + emojisCount
  }

  useEffect(() => {
    if (textInputRef.current) {
      setCurrentSize({
        width: textInputRef.current.offsetWidth,
        height: textInputRef.current.offsetHeight
      })
    }
  }, [])

  const excluePicker = useMemo(() => {
    const exclude = []

    if (disableRecent) {
      exclude.push('recent')
    }

    return exclude
  }, [disableRecent])

  function setValue (value) {
    updateHTML(value)
    textInputRef.current.blur()
  }

  function toggleShowPicker () {
    setShowPicker(showPicker => !showPicker)
  }

  function pasteHtmlAtCaret (html) {
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

  function replaceAll (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
  }

  function getImage (emoji) {
    let shortNames = `${emoji.short_names}`

    shortNames = replaceAll(shortNames, ',', ', ')

    const emojiSpanEl = document.querySelector(
      `[aria-label="${emoji.native}, ${shortNames}"] > span`
    )

    if (!emojiSpanEl) return ''

    const style = replaceAll(emojiSpanEl.style.cssText, '"', "'")

    return `<img style="${style}" data-emoji="${emoji.native}" src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />`
  }

  function handleSelectEmoji (emoji) {
    placeholderRef.current.style.opacity = 0

    textInputRef.current.focus()

    pasteHtmlAtCaret(getImage(emoji))

    textInputRef.current.focus()

    replaceAllTextToString()

    emitChange()

    if (!keepOpenend) {
      toggleShowPicker()
    }
  }

  function selectElementContents(start, end) {
    var range = document.createRange()
    // range.selectNodeContents(el)
    var focusNode = window.getSelection().focusNode
    range.setStart(focusNode, start)
    range.setEnd(focusNode, end)
    var sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }

  /**
   *
   * @param {string} metion
   */
  function handleSetUserMention (userMention) {
    placeholderRef.current.style.opacity = 0

    textInputRef.current.focus()

    console.log(mentionRef.current.focusNode)

    selectElementContents(mentionRef.current.startPosition, mentionRef.current.endPosition)

    const [ name ] = userMention.match(/(?<=\[).+?(?=\])/g)

    const mentionHTML = `<span style="color: #0A91E6;" data-mention="${userMention}">@${name}</span> `

    pasteHtmlAtCaret(mentionHTML)

    mentionRef.current = null

    textInputRef.current.focus()

    replaceAllTextToString()

    emitChange()
  }

  function getAllEmojisFromText (text) {
    return text.match(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
    )
  }

  function checkPlaceholder () {
    const text = cleanedTextRef.current

    if (text !== '' && placeholderRef.current.opacity !== 0) {
      placeholderRef.current.style.opacity = 0
    } else {
      placeholderRef.current.style.opacity = 1
    }
  }

  function handleClick () {
    if (typeof onClick === 'function') {
      onClick()
    }
  }

  return (
    <div className='react-emoji'>
      <div
        className='react-emoji-picker--container'
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
              onSelect={handleSelectEmoji}
              exclude={excluePicker}
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
        <div className='react-input-emoji--wrapper' onClick={handleClick}>
          <div
            ref={placeholderRef}
            className='react-input-emoji--placeholder'
          >
            {placeholder}
          </div>
          <div
            ref={textInputRef}
            tabIndex={tabIndex}
            contentEditable
            className={`react-input-emoji--input${inputClass ? ` ${inputClass}` : ''}`}
            onBlur={emitChange}
          />
        </div>
      </div>
      <button onClick={handleSetUserMention}>test</button>
      <button
        className={
          `react-input-emoji--button${
            showPicker ? ' react-input-emoji--button__show' : ''
          }`
        }
        onClick={toggleShowPicker}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10' /><path d='M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0' /></svg>
      </button>
      {showPicker &&
      <div
        className='react-input-emoji--overlay'
        onClick={toggleShowPicker}
      />
      }
    </div>
  )
}

const InputEmojiWithRef = forwardRef(InputEmoji)

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
  tabIndex: t.number,
  // style
  height: t.number,
  borderRadius: t.number,
  borderColor: t.string,
  fontSize: t.number,
  fontFamily: t.string
}

InputEmojiWithRef.defaultProps = {
  height: 30,
  placeholder: 'Type a message',
  borderRadius: 21,
  borderColor: '#EAEAEA',
  fontSize: 15,
  fontFamily: 'sans-serif',
  tabIndex: 0
}

export default InputEmojiWithRef
