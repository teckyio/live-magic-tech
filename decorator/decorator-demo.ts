import { Length, validate } from './decorator'

console.log('def Post class')
export interface IPost {
  title: string
  password: string
}

export class Post implements IPost {
  @Length(10, 20)
  title: string

  @Length(6)
  password: string

  constructor(data: IPost) {
    this.title = data.title
    this.password = data.password
  }
}

console.log('======== instance 1 =========')
console.log('new post instance')
let post = new Post({
  title: 'typescript decorator',
  password: '123456',
})
console.log('after new post:', post)
console.log('======== instance 2 =========')
new Post({ title: 'mock title 2', password: 'mock password 2' })
console.log('======== instance end =========')

validate(post)
console.log('passed validation')
