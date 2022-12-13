export let markers = new Map<Constructor, Rules>()

type Constructor = Function
type Rules = Rule<object>[]

interface Rule<T extends object> {
  validate(target: T): string | void
}

function getConstructorRules(constructor: Constructor) {
  let rules = markers.get(constructor)
  if (!rules) {
    rules = []
    markers.set(constructor, rules)
  }
  return rules
}

export function Length(min: number, max?: number) {
  console.log('call Length()', { min, max })
  return function <T extends object>(target: T, propertyKey: keyof T) {
    let constructor = target.constructor

    let fields = getConstructorRules(constructor)

    fields.push({
      validate(target: T) {
        console.log('running Length rule:', {
          target,
          propertyKey,
          options: { min, max },
        })
        let value = target[propertyKey]

        if (value == null) {
          return `invalid property ${String(
            propertyKey,
          )} expect an object with length, got null`
        }
        if (typeof value != 'object' && typeof value != 'string') {
          return (
            'invalid property ' +
            String(propertyKey) +
            ' expect a string or object with length, got ' +
            typeof value
          )
        }
        if (typeof value != 'string' && !('length' in value)) {
          return "missing property 'length'"
        }
        let length = (value as any).length
        if (typeof length !== 'number') {
          return (
            "invalid property 'length', expect number, got " + typeof length
          )
        }
        if (length < min) {
          return (
            'invalid property ' +
            String(propertyKey) +
            ' require at least length of ' +
            min +
            ' but got ' +
            length
          )
        }
        if (typeof max == 'number' && length > max) {
          return (
            'invalid property ' +
            String(propertyKey) +
            ' require at most length of ' +
            min +
            ' but got ' +
            length
          )
        }
      },
    })

    console.log('call inner function,', {
      target: target,
      targetClass: target.constructor,
      propertyKey,
    })
  }
}

export function validate(target: object): void {
  console.log('validate:', target)
  let constructor = target.constructor
  let rules = getConstructorRules(constructor)
  let errors: string[] = []
  for (let rule of rules) {
    let error = rule.validate(target)
    if (error !== undefined) {
      errors.push(error)
    }
  }
  if (errors.length > 0) {
    throw new InvalidError(errors)
  }
}

export class InvalidError extends Error {
  constructor(public errors: string[]) {
    super(JSON.stringify(errors))
  }
}
