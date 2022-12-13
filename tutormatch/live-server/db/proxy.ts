import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type Method = {
  id?: number | null
  method: string
}

export type Url = {
  id?: number | null
  url: string
}

export type UserAgent = {
  id?: number | null
  user_agent: string
}

export type RequestLog = {
  id?: number | null
  method_id: number
  method?: Method
  url_id: number
  url?: Url
  user_agent_id: number | null
  user_agent?: UserAgent
  timestamp: number
}

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
  skip_time: string | null
}

export type DBProxy = {
  method: Method[]
  url: Url[]
  user_agent: UserAgent[]
  request_log: RequestLog[]
  fb_user: FbUser[]
  fb_group: FbGroup[]
  fb_post: FbPost[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    method: [],
    url: [],
    user_agent: [],
    request_log: [
      /* foreign references */
      ['method', { field: 'method_id', table: 'method' }],
      ['url', { field: 'url_id', table: 'url' }],
      ['user_agent', { field: 'user_agent_id', table: 'user_agent' }],
    ],
    fb_user: [],
    fb_group: [],
    fb_post: [
      /* foreign references */
      ['fb_user', { field: 'fb_user_id', table: 'fb_user' }],
      ['fb_group', { field: 'fb_group_id', table: 'fb_group' }],
    ],
  },
})
