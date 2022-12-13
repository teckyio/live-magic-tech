// ==UserScript==
// @name         tutormatch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  collect tutorial matching posts
// @author       You
// @match        https://www.facebook.com/groups/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  function sleep(ms) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, ms)
    })
  }

  function randomSleep() {
    let ms = Math.random() * 1500 + 1000
    return sleep(ms)
  }

  let group_id = location.pathname.match(/\/groups\/(\d+)/)[1]

  console.log({ group_id })

  async function main() {
    console.log('running main()...')

    for (;;) {
      let posts = document.querySelectorAll('[role="article"]')
      if (posts.length > 0) break
      await sleep(500)
    }

    let style = document.createElement('style')
    style.textContent = /* css */ `
[hidden] {
	display: none !important;
}
`
    document.body.appendChild(style)

    document.querySelector(
      '[aria-label="群組導覽"][role="navigation"]',
    ).hidden = true

    // document.querySelector(
    //   '[data-pagelet="GroupFeed"]',
    // ).parentElement.nextSibling.hidden = true

    async function expandAll() {
      console.log('start to expand more')
      let buttons = document.querySelectorAll('[role="button"]')
      for (let button of buttons) {
        if (button.textContent != '查看更多') {
          continue
        }
        button.scrollIntoView({ behavior: 'auto' })
        await sleep(500)
        button.click()
        await randomSleep()
      }
      console.log('finished expand more')
    }
    await expandAll()

    document
      .querySelectorAll(
        '[data-visualcompletion] [role="article"], [data-visualcompletion][role="article"]',
      )
      .forEach(div => {
        div._skip = true
      })

    let postContainers = document.querySelectorAll('[role="article"]')
    console.log('num posts:', postContainers.length)

    let posts = []
    for (let post of postContainers) {
      if (post._skip) continue
      let userA = Array.from(
        post.querySelectorAll(
          `a[role="link"][href*="/groups/${group_id}/user/"]`,
        ),
      ).find(a => a.querySelector('strong span')?.textContent)
      if (!userA) continue

      let nickname = userA.querySelector('strong span')?.textContent
      let user_id = userA.href.match(/\/groups\/\d+\/user\/(\d+)/)?.[1]
      let content = post.querySelector('[data-ad-preview="message"]')?.innerText

      let timeA = Array.from(
        post.querySelectorAll(`a[href*="/groups/${group_id}/posts/"]`),
      ).find(a => a.querySelector('span'))
      if (!timeA) continue
      let post_id = timeA.href.match(/\/posts\/(\d+)/)?.[1]
      if (!post_id) continue
      // TODO
      let post_time = new Date().toISOString()

      if (nickname && user_id && content && post_id && post_time) {
        posts.push({ nickname, user_id, content, post_id, post_time })
      } else {
        console.debug('missing data', {
          post,
          nickname,
          user_id,
          content,
          post_id,
          post_time,
        })
      }
    }
    console.log(posts)

    fetch('https://localhost:8100/posts/fb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_id,
        posts: posts,
      }),
    })
  }

  main()
})()
