<template>
    <el-tabs v-model="activePath" type="card" @tab-click="handleClick(activePath)">
        <el-tab-pane :label="item.name" :name="item.path" v-for="(item,index) in tabsList" :key="index" :disabled="!item.path">
            <span slot="label" v-if="!index"><img src="../../../../assets/img/title_icon.png" style="margin-right: 5px">{{item.name}}</span>
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Watch
    } from 'vue-property-decorator';

    @Component
    export default class Tabs extends Vue {
        activePath: string = '/diversity/data/totalData'
        @Watch('$route', { immediate: true, deep: true })
        private routeChanged(val: any, oldVal: any) {
           this.activePath = val.path
        //    if(/^(?!.*diversity)/.test(val.path)){
            if(val.path.replace(/(?:\/\w+\/)(.*)(?:\/\w+)/g,'$1') === 'diversity'){
               //匹配到路由不包含diversity连续字符，表示是报表路由
               this.tabsList = this.tabsDiversity
           }else{
               this.tabsList = this.tabsReport
           }
        }
        tabsList:any = []
        tabsDiversity = [{ 
                name: '数据总表',
                path:'/nonadmin/diversity/totalData'
            },
            {
                name: '差异数据',
                path:'/nonadmin/diversity/diversityData'
            },
            {
                name: '一致数据',
                path:'/nonadmin/diversity/consistentData'
            }
        ]
        tabsReport = [{ 
                name: '日报表',
                path:'/nonadmin/report/dayReport'
            },
            {
                name: '周报表',
                path:''
            },
            {
                name: '月报表',
                path:''
            },
            {
                name: '年报表',
                path:''
            }
        ]
        //methods
        handleClick(tab: any, event: object) {
            //切换标签页
            this.$router.push(tab)
        }
    }
</script>

<style scoped lang="scss">

</style>