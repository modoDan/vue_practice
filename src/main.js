import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui'
import MDtemplate from './components/template/index.js'
Vue.use(MDtemplate)
Vue.use(elementUi)
new Vue({
	el:'#app',
	router,
	render:c=>c(App)
})