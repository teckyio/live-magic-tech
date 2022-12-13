import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type FbUser = {
  id?: number | null
  nickname: string
}

export type FbGroup = {
  id?: number | null
  name: string
}

export type FbPost = {
  id?: number | null
  post_time: string
  content: string
  fb_user_id: number
  fb_user?: FbUser
  fb_group_id: number
  fb_group?: FbGroup
}

export type DBProxy = {
  fb_user: FbUser[]
  fb_group: FbGroup[]
  fb_post: FbPost[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    fb_user: [],
    fb_group: [],
    fb_post: [
      /* foreign references */
      ['fb_user', { field: 'fb_user_id', table: 'fb_user' }],
      ['fb_group', { field: 'fb_group_id', table: 'fb_group' }],
    ],
  },
})
