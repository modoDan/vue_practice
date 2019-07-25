<template>
	<div>
		<button :type="type" :class="type" @click="handleClick"
>
			<slot></slot>
		</button> 
		<a href="#" @click="$emit('update:show', !show)">双向绑定，子改变父</a>
	</div>
</template>
<script>
	export default{
		name:'md-button',
		componentName: 'MDButton',
		props:{
			type:{
				type:String,
				default:'button'
			},
			show:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			handleClick(e){
				this.$emit('click',e)
			}
		}
	}
</script>
<style>
	
</style>