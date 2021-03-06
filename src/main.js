// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import 'es6-promise/auto'

import Vue from 'vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
// import 'font-awesome/css/font-awesome.css'

import store from './store'
import routes from './routes'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Client from './client'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.use(Client)

Vue.http.options.root = process.env.SERVER_URL+'/api'
Vue.http.options.media = process.env.SERVER_URL
Vue.http.options.server = process.env.SERVER_URL

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (const i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

Vue.http.interceptors.push((request, next) => {
    if (request.method === 'POST') {
      const csrftoken = getCookie('csrftoken')
      request.headers.set('X-CSRFTOKEN', csrftoken)
    }
    request.credentials = true;
    next();
})
Vue.material.inkRipple = false

// TODO: use 'dark' theme on headers when bug in Vue-Material (hue in accent)
// will be fixed
Vue.material.registerTheme({
  'default': {
    primary: 'blue',
    accent: 'blue-grey',
    warn: {
      color: 'blue-grey',
      hue: 800
    }
  },
  'light': {
    primary: 'blue',
    accent: 'blue-grey',
    warn: 'blue-grey'
  },
  // dark: {
  //   primary: 'blue',
  //   accent: {
  //     color: 'blue-grey',
  //     hue: 800
  //   }
  // },
  form: {
    primary: 'blue',
    accent: {
      color: 'blue-grey',
      hue: 800
    },
    warn: 'red'
  }
})

import differenceInMinutes from 'date-fns/difference_in_minutes'
import differenceInHours from 'date-fns/difference_in_hours'
import differenceInDays from 'date-fns/difference_in_days'
import differenceInMonths from 'date-fns/difference_in_months'
import format from 'date-fns/format'

Vue.filter('positive', value => {
  return value > 0? value : ''
})

Vue.filter('timediff', value => {
  const now = new Date()
  const time = new Date(value)

  const days = differenceInDays(now, time)
  if (days < 1) {
    const hours = differenceInHours(now, time)
    if (hours < 1) {
      const minutes = differenceInMinutes(now, time)
      return minutes+' minutes ago'
    }
    return hours+' hours ago'
  }
  if (days > 30) {
    const months = differenceInMonths(now, time)
    return months + (months === 1? ' month ago' : ' months ago')
  }
  return days+' days ago'
})

Vue.filter('todate', value => {
  return format(new Date(value), 'MMM D, YYYY')
})

Vue.filter('capitalize', value => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('capitalize-list', list => {
  if (!list) return ''
  return list.map(item => { return item[0].toUpperCase() + item.slice(1) }).join(', ')
})

Vue.filter('applink', project => {
  const serverUrl = Vue.http.options.server
  const params = project.options? '?'+project.options : ''
  return `${serverUrl}/app${params}#${project.id}`
})

Vue.filter('videolink', value => {
  if (!value) return ''
  if (value.startsWith('http')) {
    return value
  }
  return 'https://www.youtube.com/watch?v='+value
})

Vue.directive('chips-label', {
  inserted: function (el, binding) {
    let labelEl = document.createElement('label')
    labelEl.appendChild(document.createTextNode(binding.value))
    el.querySelector('.md-input-container').appendChild(labelEl)
  }
})

window.app = new Vue({
  el: '#app',
  template: '<transition name="fade"><router-view></router-view></transition>',
  router: new VueRouter({mode: 'history', routes}),
  store,
  beforeCreate () {
    if (window.basscloud_user) {
      if (window.basscloud_user.username) {
        this.$store.commit('updateProfile', window.basscloud_user)
      }
    } else {
      this.$client.loadUserProfile()
    }
  }
})

// document.addEventListener('DOMContentLoaded', function () {
//   window.app.$mount('#app')
// })