import express from 'express'
import cors from 'cors'
import { print } from 'listening-on'
import { array, date, id, object, ParseResult, string } from 'cast.ts'
import { proxy } from './proxy'

let app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let createPostBodyParser = object({
  group_id: id(),
  posts: array(
    object({
      post_id: id(),
      user_id: id(),
      nickname: string({ trim: true, minLength: 3 }),
      content: string({ trim: true, minLength: 10 }),
      post_time: date(),
    }),
  ),
})

app.post('/posts/fb', (req, res) => {
  let body: ParseResult<typeof createPostBodyParser>
  try {
    body = createPostBodyParser.parse(req.body)
  } catch (error) {
    console.log(error)
    res.status(400)
    res.json({ error: String(error) })
    return
  }

  if (!(body.group_id in proxy.fb_group)) {
    res.status(400)
    res.json({ error: 'this group is not whitelisted' })
    return
  }

  for (let post of body.posts) {
    if (!(post.user_id in proxy.fb_user)) {
      proxy.fb_user[post.user_id] = {
        nickname: post.nickname,
      }
    }
    if (post.post_id in proxy.fb_post) continue
    proxy.fb_post[post.post_id] = {
      post_time: post.post_time.toISOString(),
      fb_group_id: body.group_id,
      fb_user_id: post.user_id,
      content: post.content,
    }
  }
})

app.get('/posts', (req, res) => {
  res.json({
    posts: proxy.fb_post.map(post => ({
      post_id: post.id,
      content: post.content,
      user_id: post.fb_user_id,
      nickname: post.fb_user?.nickname,
      group_id: post.fb_group_id,
      group_name: post.fb_group?.name,
      post_time: post.post_time,
    })),
  })
})

let port = 8100
app.listen(port, () => {
  print(port)
})
