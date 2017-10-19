/**
 * node.js
 *
 * For the purpose of stylizing the selected range, wrap the node of the range
 * by <span>, and then attach the className to the <span>(or detach when remove style).
 *
 */

import { isSingleNode, isTextNode, isElementNode,
  isBeforeNode, isAfterNode, ifContainClass,
  addClass, removeClass, newRange, toArray } from './node_utils'

const INLINE_TAG_NAME = {
  img: true,
  input: true
}

const INLINE_TAG = 'span'
const SO_ENDITOR_TAG_INLINE = 'so_editor_tag_inline'

const NO_INHERIT_STYLE = 'no-inherit-style'

export default function addEffect (range, className) {
  if (judgeIfEffected(range, className)) {
    detachClassRange(range, className)
  } else {
    attachClassRange(range, className)
  }
}

function attachClassRange (range, className) {
  preHandleRange(range, className, wrap)
}

function detachClassRange (range, className) {
  preHandleRange(range, className, unwrap)
}

function judgeIfEffected (range, className) {
  let result = true
  preHandleRange(range, className, (otherRange, classNameCopy, end) => {
    const node = end === undefined ? otherRange.startContainer : otherRange.endContainer
    if (isTextNode(node)) {
      result = result &&
      isHandledElement(node.parentNode) &&
      ifContainClass(node.parentNode, classNameCopy)
    } else if (isElementNode(node)) {
      if (INLINE_TAG_NAME[node.localName.toLowerCase()]) {
        const offset = end === undefined ? 0 : otherRange.endOffset - 1
        result = result &&
        isHandledElement(node.childNodes[offset]) &&
        ifContainClass(node.childNodes[offset], classNameCopy)
      }
    }
  })
  return !!result
}

function preHandleRange (range, className, fn) {
  if (isSingleNode(range)) {
    fn(range, className)
  } else { // For the multiple nodes of selected range, do wrap one node by one node
    // 1. Plain the nodes of commonAncestorContainer which contain the all selected nodes
    const { commonAncestorContainer, startContainer, endContainer } = range
    let totalNodes = [...toArray(commonAncestorContainer.childNodes)]
    // eslint-disable-next-line
    const plainedNodes = []
    let i = 0
    while (i < totalNodes.length) {
      // Store the node, but should filter the blank text node
      if (!isTextNode(totalNodes[i]) || totalNodes[i].length !== 0) {
        plainedNodes.push(totalNodes[i])
      }
      if (totalNodes[i].childNodes.length !== 0) {
        // eslint-disable-next-line
        totalNodes = totalNodes.concat(toArray(totalNodes[i].childNodes))
      }
      i += 1
    }

    // 2. Select the nodes which is in the selected range
    const selectedNodes = plainedNodes.filter(n =>
      isAfterNode(startContainer, n) && isBeforeNode(endContainer, n))
    selectedNodes.unshift(startContainer)
    selectedNodes.push(endContainer)

    // 3. Handle the selectedNodes one by one as handle the single node,
    // but the range should be divided for every node
    // eslint-disable-next-line
    for (const n of selectedNodes) {
      if (n === startContainer) {
        if (isTextNode(n)) {
          newRange(n, range.startOffset, n.length, (createdRange) => {
            fn(createdRange, className)
          })
        } else if (isElementNode(n)) {
          fn(range, className)
        }
      } else if (n === endContainer) {
        if (isTextNode(n)) {
          newRange(n, 0, range.endOffset, (createdRange) => {
            fn(createdRange, className)
          })
        } else if (isElementNode(n)) {
          fn(range, className, true)
        }
      } else if (isTextNode(n)) {
        newRange(n, 0, n.length, (createdRange) => {
          fn(createdRange, className)
        })
      } else if (isElementNode(n)) {
        const createdRange = document.createRange()
        createdRange.selectNode(n)
        fn(createdRange, className)
      }
    }
  }
}

/**
 * [wrap Create an element and wrap the range]
 * @param  {[type]} range                 [The range for wrapping]
 * @param  {String} className             [The className of being attach]
 * @return {[type]}                       [description]
 */
function wrap (range, className, end) {
  const node = end === undefined ? range.startContainer : range.endContainer
  if (isTextNode(node)) {
    handleTextRange(range, className, node)
  } else if (isElementNode(node)) {
    if (end === undefined) {
      handleElementRange(node, range.startOffset, className)
    } else if (end) {
      handleElementRange(node, range.endOffset - 1, className)
    }
  }
}

function unwrap (range, className, end) {
  const node = end === undefined ? range.startContainer : range.endContainer
  if (isTextNode(node)) {
    handleTextRangeRemoval(range, className, node)
  } else if (isElementNode(node)) {
    // handleElementRangeRemoval(node, range.startOffset, className)
    if (end === undefined) {
      handleElementRangeRemoval(node, range.startOffset, className)
    } else if (end) {
      handleElementRangeRemoval(node, range.endOffset - 1, className)
    }
  }
}

function handleTextRange (range, className, node) {
  // If there is a HanldedElement as parentNode, and satisfy with the reuse condition,
  // should reuse the HandledElement(marked by data-so-editor-tag)
  if (shouldReuseEle(range)) {
    addClass(node.parentNode, className) // The parentNode of node is exactly the HanldedElement
    return
  }

  // Create HandledElement when there is no HandledElement that could be reused.
  const inheritClassName = node.parentNode.className || ''
  const el = document.createElement(INLINE_TAG)
  // Initiate the element start
  if (inheritClassName.split(' ').indexOf(NO_INHERIT_STYLE) === -1) {
    addClass(el, NO_INHERIT_STYLE, inheritClassName, className)
  } else {
    addClass(el, inheritClassName, className)
  }
  initHandledElementInline(el)
  // Initiate the element end

  // wrap the range
  range.surroundContents(el)
}

function handleTextRangeRemoval (range, className, node) {
  if (shouldReuseEle(range)) {
    removeClass(node.parentNode, className)
    return
  }

  if (isHandledElement(node.parentNode)) {
    const parent = node.parentNode
    const inheritClassName = parent.className || ''
    const spliter1 = range.startOffset
    const spliter2 = range.endOffset - range.startOffset
    const splitedNodePart1 = node.splitText(spliter1)
    const splitedNodePart2 = splitedNodePart1.splitText(spliter2)
    const part1Ele = document.createElement(INLINE_TAG)
    const part2Ele = document.createElement(INLINE_TAG)
    const part3Ele = document.createElement(INLINE_TAG)
    addClass(part1Ele, inheritClassName)
    addClass(part2Ele, inheritClassName.split(' ').filter(name => name !== className).join(' '))
    addClass(part3Ele, inheritClassName)
    initHandledElementInline(part1Ele)
    initHandledElementInline(part2Ele)
    initHandledElementInline(part3Ele)
    const childNodes = [...toArray(parent.childNodes)]
    for (let i = 0, len = childNodes.length; i < len; i += 1) {
      if (isBeforeNode(node, childNodes[i]) || node === childNodes[i]) {
        childNodes[i].length !== 0 && part1Ele.appendChild(childNodes[i])
      } else if (isAfterNode(splitedNodePart2, childNodes[i]) ||
      splitedNodePart2 === childNodes[i]) {
        childNodes[i].length !== 0 && part3Ele.appendChild(childNodes[i])
      } else {
        part2Ele.appendChild(childNodes[i])
      }
    }
    const frag = document.createDocumentFragment()
    part1Ele.childNodes.length !== 0 && frag.appendChild(part1Ele)
    part2Ele.childNodes.length !== 0 && frag.appendChild(part2Ele)
    part3Ele.childNodes.length !== 0 && frag.appendChild(part3Ele)
    const temp = parent.parentNode
    parent.parentNode.replaceChild(frag, parent)
    temp.normalize()

    // Better Implement but has some bug
    // const parent = node.parentNode
    // const inheritClassName = parent.className || ''
    // const newspan = document.createElement(INLINE_TAG)
    // const content = range.extractContents()
    // newspan.appendChild(content)
    // addClass(newspan, inheritClassName.split(' ').filter(name => name !== className).join(' '))
    // range.insertNode(newspan)
  } else {
    throw new Error('Can\'t remove the class of This element that is not HandledElement.')
  }
}

function handleElementRange (node, offset, className) {
  const el = node.childNodes[offset]
  // Only handle some specific element.

  if (INLINE_TAG_NAME[el.localName.toLowerCase()]) {
    initHandledElementInline(el)
    addClass(el, className)
  }
}

function handleElementRangeRemoval (node, offset, className) {
  const el = node.childNodes[offset]
  if (isHandledElement(el)) {
    removeClass(el, className)
  }
}

/**
 * The following are Utils function
 */

function isHandledElement (el) {
  return el.dataset.soEditorTag === SO_ENDITOR_TAG_INLINE
}

function initHandledElementInline (el) {
  el.dataset.soEditorTag = SO_ENDITOR_TAG_INLINE
}

function shouldReuseEle (range) {
  if (!isSingleNode(range)) return false
  const node = range.startContainer
  if (isTextNode(node)) {
    return node.parentNode.dataset.soEditorTag === SO_ENDITOR_TAG_INLINE &&
    node.parentNode.childNodes.length === 1 &&
    range.startOffset === 0 &&
    range.endOffset === node.length
  }
  throw new Error('Selected Range is Not Text, So should not Call this function')
}
