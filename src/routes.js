import App from './App'
import Detail from './components/Detail'
import List from './components/List'
import AuthorProjects from './components/AuthorProjects'

export default [
    {
      path: '/',
      component: App,
      children: [{
          name: 'author',
          path: 'author/:id',
          component: AuthorProjects,
          props: true
        }, {
          path: '',
          alias: ['all/', 'favourite/', 'liked/'],
          name: 'list',
          component: List
        }, {
        name: 'detail',
        path: 'detail/:id',
        component: Detail,
        props: true
      }]
    }
]
