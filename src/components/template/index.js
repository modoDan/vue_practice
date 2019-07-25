import Vue from 'vue'
window.Vue = Vue

import Input from './input/index.js';
import FormItem from './form-item/index.js';
import Form from './form/index.js';
import Button from './button/index.js';

const components = [
	Input,
	FormItem,
	Form,
	Button
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
	//安装组件
  install(window.Vue);
}

export default {
	Input
}