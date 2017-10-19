import * as templates from './template'

const temp = {}

// eslint-disable-next-line
for (const t in templates) {
  if (Object.prototype.hasOwnProperty.call(templates, t)) {
    if (templates[t].name in temp) throw new Error(`Template ${t} has already defined`)
    temp[templates[t].name] = templates[t]
  }
}

export default temp
