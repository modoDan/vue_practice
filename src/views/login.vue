<template>
	<div id="login">
		{{model.username}}
		<md-form :model="model" :rules="rules" ref="mdLoginform">
			<md-form-item label="用户名" prop="username">
				<md-input v-model="model.username"></md-input>
			</md-form-item>
			<md-form-item label="密码" prop="password">
				<md-input type="password" v-model="model.password"></md-input>
			</md-form-item>
			<md-form-item>
				<md-button type="primary" :show.sync="show" @click="submitForm('mdLoginform')">{{show ? '确定' : '取消'}}</md-button>
			</md-form-item>
		</md-form>
	</div>
</template>
<script> 
	import { store, mutations } from "../store";
	export default{
		data(){
			return{
				show:true,
				model:{
					username:'modo',
					password:''
				},
				rules:{
					username:[{
						required:true,
						message:'请输入用户名'
					}],
					password:[{
						required:true,
						message:'请输入密码'
					}]
				}
			}
		},
		mounted(){
			console.log(this)
		},
		methods:{
			setUserName:mutations.setUserName,
			submitForm(formName){
				// console.log(this.$refs.mdLoginform)
				// this.$refs[formName].validate(valid => {

				// })
				this.setUserName(this.model.username)
				this.$router.push({
					name:'slotView'
				})
			}
		}
	}
</script>
<style lang="scss">
	#login{
		//color:$button-hover
	}
</style>