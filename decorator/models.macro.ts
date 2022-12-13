import { Length } from './decorator'

export function defClass(
  name: string,
  fields: Array<[field: string, type: string, decorator: string]>,
) {
  let code = ''
  code += `export interface I${name} {`
  for (let [field, type] of fields) {
    code += `
  ${field}: ${type}`
  }
  code += `
}`

  code += `
export class ${name} implements I${name} {`

  for (let [field, type, decorator] of fields) {
    code += `
  ${decorator}
  ${field}: ${type}
`
  }

  code += `
  constructor(data: I${name}) {`
  for (let [field, type, decorator] of fields) {
    code += `
    this.${field} = data.${field}`
  }

  code += `
  }
}`

  return code
}

;`import { Length } from './decorator'

` +
  defClass('Post', [
    ['title', 'string', `@Length(10, 20)`],
    ['password', 'string', `@Length(6)`],
  ])
