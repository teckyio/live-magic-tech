import { FbPost, proxy } from '../../../db/proxy.js'
import { Link } from '../components/router.js'
import Style from '../components/style.js'
import { castDynamicContext, Context } from '../context.js'
import { o } from '../jsx/jsx.js'
import { renderError } from '../components/error.js'
import { toSqliteTimestamp } from 'better-sqlite3-proxy'

export function extractPostData(post: FbPost) {
  console.log('testing:', post.id)

  return post
}

let style = Style(/* css */ `
.post {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid black;
}
.post button {
}
`)

function CheckPost() {
  let postList = []
  for (let post of proxy.fb_post) {
    if (post.skip_time) continue
    let content = post.content
    if (content.includes('尋學生') || content.includes('尋補習學生')) {
      continue
    }
    if (content.match(/(尋|徵|請).*(老師|導師)/)) {
      continue
    }
    postList.push(
      <div class="post">
        <div>
          <Link no-history href={'/posts/' + post.id + '/skip'}>
            <button>skip this post</button>
          </Link>
        </div>
        {post.content}
      </div>,
    )
  }
  return (
    <div id="checkPost">
      {style}
      <h2>Check Post</h2>
      <h3>List of unclassified posts:</h3>
      {[postList]}
    </div>
  )
}

function skipPost(attrs: {}, _context: Context) {
  let context = castDynamicContext(_context)
  let post_id = context.routerMatch?.params.id
  if (!post_id) {
    return renderError(new Error(`missing post id`), context)
  }
  proxy.fb_post[post_id].skip_time = toSqliteTimestamp(new Date())
  return <CheckPost />
}

export default {
  index: CheckPost,
  skip: skipPost,
}
