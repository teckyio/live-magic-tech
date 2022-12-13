import { Length } from './decorator'

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