export function isSingleNode (range) {
  return range.startContainer === range.endContainer
}

export function isTextNode (node) {
  return node.nodeType === Node.TEXT_NODE
}

export function isElementNode (node) {
  return node.nodeType === Node.ELEMENT_NODE
}

export function isBeforeNode (node, otherNode) {
  return node.compareDocumentPosition(otherNode) === document.DOCUMENT_POSITION_PRECEDING
}

export function isAfterNode (node, otherNode) {
  return node.compareDocumentPosition(otherNode) === document.DOCUMENT_POSITION_FOLLOWING
}

export function ifContainClass (node, className) {
  return (node.className || '').split(' ').indexOf(className) !== -1
}

export function addClass (node, ...classNames) {
  let newClassName = node.className
  // eslint-disable-next-line
  for (const className of classNames) {
    if (newClassName.split(' ').indexOf(className) === -1) { newClassName += ` ${className}` }
  }
  node.className = newClassName.replace(/^\s*|\s*$|\s(?=\s+)/g, '')
}

export function removeClass (node, ...classNames) {
  let newClassName = node.className
  newClassName = newClassName.split(' ').filter(name => classNames.indexOf(name) === -1).join(' ')
  node.className = newClassName
}
export function newRange (node, start, end, fn) {
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  fn(range)
}

export function toArray (arry) {
  return Array.prototype.slice.call(arry, 0)
}
