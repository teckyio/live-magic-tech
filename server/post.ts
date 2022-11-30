import { FbPost, proxy } from './proxy'

export function extractPostData(post: FbPost) {
  console.log('testing:', post.id)
  let content = post.content
  if (content.includes('尋學生') || content.includes('尋補習學生')) {
    return
  }
  if (content.match(/(尋|徵|請).*(老師|導師)/)) {
    return
  }
  console.log('???:', content)
}

async function main() {
  for (let post of proxy.fb_post) {
    extractPostData(post)
  }
}
main().catch(e => console.error(e))
