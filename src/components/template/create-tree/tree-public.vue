<template>
	<div class="at-tree" ref="atTree">
		<el-scrollbar class="at-tree-scrollbar" ref="treeScrollbar">
			<div class="at-tree-wrapper">
				<ul class="at-tree-nodes">
					<tree-base v-for="child in treeNodes[treeProps.children]" :node="child" :key="child.id" :multiple="multiple" :currentNodeId="currentNodeId" :treeProps="treeProps" :eventHub="eventHub" :query="query" :isQuering="isQuering">
					</tree-base>
				</ul>
			</div>
		</el-scrollbar>
		<div class="ats-create-line"  v-if="creatProps">
			<button class="at-create-button" @click="() => append()">新建文件夹</button>
		</div>
		
	</div>
</template>

<script>
	import Vue from 'vue';
	import treeBase from "./tree-base.vue";
	import {objArrDeepCopy} from "../utils/tools"

	export default {
		name: 'tree',
		components: {
			treeBase,
		},
		props: {
			treeData: {
				type: Array,
				default: []
			},
			treeProps: {
				type: Object,
				default: {
					label: 'label',
					children: 'children'
				}
			},
			multiple: {
				type: Boolean
			},
			creatProps: {
				type: Boolean
			}
		},
		created() {
			this.eventHub.$on('node-click', this.handleNodeClick);
		},
		watch: {
			treeData(val) {
				if(val) {
					this.treeNodes = {
						[this.treeProps.children]: objArrDeepCopy(val, {
							visible: true
						}),
						visible: true
					};
				}
			}
		},
		data() {
			return {
				treeNodes: {
					[this.treeProps.children]: objArrDeepCopy(this.treeData, {
						visible: true
					}),
					visible: true
				},
				currentNodeId: '',
				eventHub: new Vue(),
				isQuering: false,
				query: '',
				checkedItems: [],
				checkedKeys: [],
				slectedData: {},
				slectedNode: '',
			}
		},
		methods: {
			append() {
				var child = document.getElementsByClassName("at-tree-input")[0];
				if(child) {
					child.parentNode.removeChild(child);
				}
				let event = this.slectedNode
				let newNode = document.createElement('input');
				newNode.setAttribute('type', 'text');
				newNode.setAttribute('class', 'at-tree-input');
				newNode.style.marginLeft = this.slectedData.deptLevel * 30 + 'px';
				let childParent = document.createElement('ul');
				childParent.setAttribute('class', 'at-tree-node__children');
				if(!event.target.parentNode.nextElementSibling) {
					event.target.parentNode.parentNode.appendChild(childParent);
				}
				event.target.parentNode.nextElementSibling.appendChild(newNode).value = '新建文件夹';
				event.target.parentNode.nextElementSibling.appendChild(newNode).focus();
				document.getElementsByClassName("at-tree-input")[0].onblur = this.pushData
			},
			pushData: function() { //失焦保存
				this.$emit('setNewTreeNode', {
					node: document.getElementsByClassName("at-tree-input")[0],
					data: this.slectedData
				});
			},
			handleNodeClick(node, event) {
				this.slectedData = node
				this.slectedNode = event
				if(this.multiple) {
					if(!new Set(this.checkedItems).has(node)) {
						this.handleAddItem(node);
						this.setErrorMessage(node);
					} else {
						this.handleDelItem(node, event);
					}
				} else {
					this.currentNodeId = node.id;
					this.setErrorMessage(node);
					this.$emit('setSelectedNode', {
						key: node.id,
						node: node
					});
				}
			},
			handleAddItem(item) {
				this.checkedItems.push(item);
				this.checkedKeys.push(item.id);
				this.$set(item, 'checked', true);
				this.$emit('setSelectedNode', {
					key: this.checkedKeys,
					node: this.checkedItems
				});
			},
			handleDelItem(item, event) {
				this.checkedKeys.splice(this.checkedKeys.indexOf(item.id), 1);
				this.checkedItems.splice(this.checkedItems.indexOf(item), 1);
				this.$set(item, 'checked', false);
				this.$emit('setSelectedNode', {
					key: this.checkedKeys,
					node: this.checkedItems
				});
			},
			setErrorMessage(data){
                this.$emit('errorCallback',data);
           }
		}
	}
</script>

<style lang="scss">
	.at-tree {
		display: inline-block;
		border: 1px solid #d1dbe5;
		margin-top: 15px;
		.at-tree-scrollbar {
			min-width: 400px;
			min-height: 300px;
			z-index: 1001;
			background: #fff;
			/*border: 1px solid #d1dbe5;*/
			.el-scrollbar__view {
				height: 300px;
				position: relative;
			}
		}
		.at-tree-wrapper {
			background-color: #fff;
		}
	}

	.at-tree-input {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid rgb(191, 204, 217);
		box-sizing: border-box;
		color: rgb(31, 46, 61);
		display: block;
		font-size: inherit;
		height: 36px;
		line-height: 1;
		outline: 0;
		padding: 3px;
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	}
	
	.ats-create-line{
		border-top: 1px solid #d1dbe5;
		padding: 6px;
	}
	.at-create-button {
		background: url(./img/plus.png) no-repeat left center;
		text-indent: 15px;
		height: 30px;
		border: 1px solid #d1dbe5;
		/*position: absolute;
		bottom: 0;
    	left: 10px;*/
	}
</style>
