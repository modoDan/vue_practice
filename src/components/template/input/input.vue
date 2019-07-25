<template>
	<div>
		<input :type="type" :value="value" @input="onInput" @blur="onBlur">
		<!-- <input v-model='value'> -->
	</div>
</template>
<script>
	export default{
		name:'md-input',
		componentName: 'MDInput',
		// v-model 默认情况下只会接受 value 属性和响应 input 事件，但可以定制自己的专属v-model
		model: {
		    prop: 'value',
		    event: 'input'
		},
		props:{
			value:{
				type:String,
				default:''
			},
			type:{
				type:String,
				default:'text'
			}
		},
		methods:{
			onInput(e){
				//派发事件，通知父组件输入值变化
				this.$emit('input',e.target.value)
			},
			onBlur(){
				//通知父组件检验
				this.$parent.$emit('validate')
			}
		}
	}
</script>
<style>
	
</style>