<template>
    <li class="at-tree-node"
        :class="{'is-expanded':node.expanded}"
        @click.stop="handleClick(node,$event)">
        <div class="at-tree-node__content"
            v-show="node.visible"
            :style="{ 'padding-left': (node[treeProps.level] - 1) * 16 + 'px' }"
            :class="{'is-current':currentNodeId===node.id,'is-checked':node.checked}">
            <div class="at-tree-node__icon icon">
                <span
                    v-if="node[treeProps.children]&&node[treeProps.children].length"
                    class="at-tree-node__expand-icon icon"
                    :class="{ expanded: node.expanded }">
                </span>
            </div>
            <span
                class="at-tree-node__label"
                :title="handleTitleVisible(node[treeProps.label])">{{node[treeProps.label]}}</span>
        </div>
        <ul class="at-tree-node__children" v-if="node.expanded">
            <tree-base
                v-for="child in node[treeProps.children]"
                :node="child"
                :key="child.id"
                :treeProps="treeProps"
                :currentNodeId="currentNodeId"
                :eventHub="eventHub"
                :query="query"
                :isQuering="isQuering"
                >
            </tree-base>
        </ul>
    </li>
</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'treeBase',
        props: {
            node:{
                type:Object,
                defautl:{}
            },
            treeProps:{},
            multiple:{},
            currentNodeId:{},
            eventHub:{},
            query:{
                type:String
            },
            isQuering:{
                type:Boolean
            }
        },
        data() {
            return {
            }
        },
        methods: {
            handleClick(node,event){
                let targetClass = event.target.getAttribute('class');
                if(node.expanded){
                    this.$set(node,'expanded',false);
                }else{
                    this.$set(node,'expanded',true);
                }
                if(node.nodetype == 2){
                    if(!(targetClass.indexOf('icon')>-1)){
                        this.eventHub.$emit('node-click',node,event);
                    }
                }
            },
            handleTitleVisible(title){
                let titleLen = title.replace(/[^\x00-\xff]/g, '..').length;
                if(titleLen>28){
                    return title;
                }else{
                    return '';
                }
            }
        }
    }
</script>

<style lang="scss">
    .at-tree-node{
        .at-tree-node__content{
            text-indent: 5px;
            line-height: 36px;
            height: 36px;
            cursor: pointer;
            white-space: nowrap;
            &:hover{
                background: rgb(228, 232, 241);
            }
            &.is-current{
                color:rgb(4, 137, 224);
            }
            .at-tree-node__icon{
                display: inline-block;
                width: 22px;
                height: 36px;
                vertical-align: top;
            }
            .at-tree-node__expand-icon{
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: url(./img/right.png) no-repeat left center;
                background-size: 18px 20px;
                transform: rotate(0);
                transition: transform .3s ease-in-out;
                &.expanded{
                    transform: rotate(90deg);
                }
            }
            .at-tree-node__label{
                max-width: 230px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }
        }
        .at-tree-node__content.is-checked .at-tree-node__label{
            /*&::after{
                color: #20a0ff;
                content: "\E608";
                font-family: element-icons;
                right: 10px;
                font-size: 11px;
                position: absolute;
                -webkit-font-smoothing: antialiased;
            }*/
           color:rgb(4, 137, 224);
        }
    }
</style>
