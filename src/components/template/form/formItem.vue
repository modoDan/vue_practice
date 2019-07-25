<template>
	<div>
		<label v-if="label">{{label}}</label>
		<!-- input占位符 -->
		<slot></slot>
		<!-- 错误信息展示 -->
		<p v-if="error" style="color:red">
			{{error}}
		</p>
	</div>
</template>
<script>
	import AsyncValidator from 'async-validator';
	export default{
		name:'md-form-item',
		componentName: 'MDFormItem',
		inject:['form'],
		props:{
			label:{
				type:String,
				default:''
			},
			prop:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				error:''
			}
		},
		mounted(){
			//监听一下检验事件
			this.$on('validate',this.validate)
		},
		methods:{
			validate(){
				//执行具体校验工作
				//1.获取检验规则
				const rules = this.form.rules[this.prop]
				//2.获取数据模型
				const value = this.form.model[this.prop]
				//3.检验对象
				const descriptor = {[this.prop]:rules}
				//4.创建校验器
				const validator = new AsyncValidator(descriptor)
				//5.检验
				validator.validate({[this.prop]:value},errors=>{
					if(errors){
						this.error = errors[0].message
					}else{
						this.error = ''
					}
					this.form.$emit('validate',this.prop)
				})
			}
		}
	}
</script>
<style>
	
</style>