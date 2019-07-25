import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login'
import slotView from './views/slot/'

Vue.use(Router)
const routes = [{
	path:'/',
	redirect:'/login'
},{
	path:'/login',
	name:'login',
	component:Login
},{
	path:'/slotView',
	name:'slotView',
	component:slotView
}]
export default new Router({
	mode:'hash',
	routes
})
