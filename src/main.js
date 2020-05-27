import Vue from 'vue'
import App from './App'
import HttpPost from './utils/httpRequest'
import DateTimeNow from './utils/getDateTime'

Vue.config.productionTip = false
Vue.prototype.$net=HttpPost;
Vue.prototype.$dateNow = DateTimeNow;
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这部分相当于原生小程序的 app.json
  config: {
    pages: [
      '^pages/index/main',
      'pages/position/main',
      "pages/login/main",
      "pages/chatroom/main",
      "pages/music/main"
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '第一个小程序',
      navigationBarTextStyle: 'black'
    }
  }
}