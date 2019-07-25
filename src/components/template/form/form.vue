<template>
	<form @submit.prevent="onSubmit">
		<!-- form-item占位符 -->
		<slot></slot>
	</form>
</template>
<script>
	import AsyncValidator from 'async-validator';
	export default{
		name:'md-form',
		componentName: 'MDForm',
		provide(){//把表单实例作为参数传递下去,子代可以直接使用
			return{
				form:this
			}
		},
		props:{
			model:{
				type:Object,
				default:''
			},
			rules:{
				type:Object,
				default:''
			}
		},
		mounted(){
			//监听一下检验事件
			this.$on('validate',this.validate)
		},
		methods:{
			validate(prop){
				const rules = this.rules[prop]
				const value = this.model[prop]
			},
			onSubmit(e){
				return false;
			}
		}
	}
</script>
<style>
	
</style>