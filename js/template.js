// eslint-disable-next-line
export function TEMPLATE_A ({ href, target }) {
  const el = document.createElement('a')
  el.href = href
  el.target = target
  return { el, surround: el }
}

export function TEMPLATE_SUP () {
  const sup = document.createElement('sup')
  return { el: sup, surround: sup }
}

export function TEMPLATE_UL () {
  const ul = document.createElement('ul')
  const li = document.createElement('li')
  ul.appendChild(li)
  return { el: ul, surround: li, multiline: true }
}

export function TEMPLATE_OL () {
  const ol = document.createElement('ol')
  const li = document.createElement('li')
  ol.appendChild(li)
  return { el: ol, surround: li, multiline: true }
}
