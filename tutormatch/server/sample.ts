import { proxy } from './proxy'

console.log(
  proxy.fb_post.map(post => {
    return {
      post_id: post.id,
      content: post.content,
      user_id: post.fb_user_id,
      nickname: post.fb_user?.nickname,
      group_id: post.fb_group_id,
      group_name: post.fb_group?.name,
    }
  }),
)
