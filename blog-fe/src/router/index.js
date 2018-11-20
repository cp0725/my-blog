import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/*
// 普通加载方法
import home from '../components/home/home'
import article from '../components/article/article'
import square from '../components/square/square'
import words from '../components/words/words'
import about from '../components/about'
import markdownEdit from '../components/article/markdownEdit'
import articleRead from '../components/article/articleRead'
*/

// 用 webpack2 实现路由按需加载
const home = (resolve) => {
  import('../components/home/home').then(module => {
    resolve(module)
  })
}
const article = (resolve) => {
  import('../components/article/article').then(module => {
    resolve(module)
  })
}
const square = (resolve) => {
  import('../components/square/square').then(module => {
    resolve(module)
  })
}
const words = (resolve) => {
  import('../components/words/words').then(module => {
    resolve(module)
  })
}
const about = (resolve) => {
  import('../components/about').then(module => {
    resolve(module)
  })
}
const markdownEdit = (resolve) => {
  import('../components/article/markdownEdit').then(module => {
    resolve(module)
  })
}
const articleRead = (resolve) => {
  import('../components/article/articleRead').then(module => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component:home
    },
    {
      path: '/article',
      name: 'article',
      component: article
    },
    {
      path: '/markdownEdit',
      name: 'markdownEdit',
      component: markdownEdit
    },
    {
      path: '/articleRead/:id',
      name: 'articleRead',
      component: articleRead      
    },
    {
      path: '/square',
      name: 'square',
      component: square
    },
    {
      path: '/words',
      name: 'words',
      component: words
    },
    {
      path: '/about',
      name: 'about',
      component: about
    }
  ]
})
