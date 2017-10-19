import templates from './template_index'

import { isTextNode, toArray } from './node_utils'

const SO_EDITOR_IDENTITY = 'so-editor-identity'
const SO_TEMPLATE_ID = 'so_template_id'

export function wrapInlineTemplate (range, templateName, templateParams) {
  if (range.collapsed) return
  const templated = findTemplate(range, templateName)
  if (templated) {
    // remove template
    const frag = document.createDocumentFragment()
    // eslint-disable-next-line
    for (const n of toArray(templated.childNodes)) {
      if (!isTextNode(n) || n.length !== 0) {
        frag.appendChild(n)
      }
    }
    const parent = templated.parentNode
    parent.replaceChild(frag, templated)
    parent.normalize()
  } else {
    // wrap by template
    const { el, surround } = templates[templateName].call(null, templateParams)
    initHandledTemplate(el, templateName)
    const content = range.extractContents()
    surround.appendChild(content)
    range.insertNode(surround)
    range.startContainer.parentNode.normalize()
  }
}

export function wrapBlockTemplate (range, templateName, templateParams) {
  const templated = findTemplate(range, templateName)
  // dfs remove
  function removeTemplate (el) {
    if (el.children && el.children.length !== 0) {
      // eslint-disable-next-line
      for (const c of toArray(el.children)) {
        removeTemplate(c)
      }
    }
    if (el.dataset.handedIdentifier === templateName) {
      const createdRange = document.createRange()
      createdRange.setStartBefore(el.firstChild)
      createdRange.setEndAfter(el.lastChild)
      const content = createdRange.extractContents()
      el.parentNode.replaceChild(content, el)
    }
  }
  if (templated) {
    removeTemplate(templated)
    return
  }
  const { el, surround, multiline } = templates[templateName].call(null, templateParams)
  initHandledTemplate(el, templateName)

  // find the line
  const lines = getLines(range)
  const createdRange = document.createRange()
  createdRange.setStartBefore(lines[0])
  createdRange.setEndAfter(lines[lines.length - 1])
  if (multiline) { // surpport wrap multiple lines
    createdRange.extractContents()
    surround.appendChild(lines.shift())
    // eslint-disable-next-line
    for (const n of lines) {
      const sur = surround.cloneNode(false)
      sur.appendChild(n)
      el.appendChild(sur)
    }
    createdRange.insertNode(el)
  } else {
    const content = createdRange.extractContents()
    surround.appendChild(content)
    createdRange.insertNode(el)
  }
}

function initHandledTemplate (el, templateName) {
  el.dataset.handedIdentifier = templateName
  el.dataset.soTemplateId = SO_TEMPLATE_ID
  if (el.children && el.children.length > 0) {
    // eslint-disable-next-line
    for (const e of el.children) {
      initHandledTemplate(e, templateName)
    }
  }
}

function findTemplate (range, templateName) {
  const { startContainer, endContainer } = range
  let el = isTextNode(startContainer) ? startContainer.parentNode : startContainer
  let rel = null
  loop(el)
  if (rel) return rel
  el = isTextNode(endContainer) ? endContainer.parentNode : endContainer
  loop(el)
  return rel

  function loop () {
    while (true) {
      if (el.dataset.handedIdentifier === templateName) {
        rel = el
      } else if (el.dataset.soEditorIdentity === SO_EDITOR_IDENTITY) {
        break
      }
      el = el.parentNode
    }
  }
}

function getLines (range) {
  const { startContainer, endContainer } = range
  let sel = startContainer
  let eel = endContainer

  sel = loop(sel)
  eel = loop(eel)

  const lines = []
  if (sel === eel) {
    lines.push(sel)
    return lines
  }
  let cur = sel
  while (cur !== eel.nextSibling) {
    lines.push(cur)
    cur = cur.nextSibling
  }
  return lines

  function loop (el) {
    let rel = el
    let limit = 1000
    while (rel.parentNode.dataset.soEditorIdentity !== SO_EDITOR_IDENTITY) {
      rel = rel.parentNode
      if (limit-- < 0) break // eslint-disable-line
    }
    return rel
  }
}

export default undefined
