<template>
    <tree-select v-if="hackReset" :treeData="treeData" :treeProps="treeProps" v-model="treeSelectArr" :multiple="true"
        :treeinput="treeinput" :checkedIds="checkedIds" :isDelete="isDelete" placeholder="请输入用户名" :userNumsg="userNumsg" @errorCallback="showTreeError"
        @setSelectedId="setSelectedId"></tree-select>
</template>
<script>
    import Service from "@/service";
    import treeSelect from "./tree-select";
    export default {
        name: "member-tree",
        data() {
            return {
                treeSelectArr: [],
                treeData: [],
                treeProps: {
                    label: "name",
                    children: "childDepts",
                    level: "deptLevel"
                },
                treeinput: false,
                userNumsg: "",
                hackReset: true,
                memberInfos: false,
                checkedIds:[]
            };
        },
        props: {
            selectedIds: Array,
            isDelete: Boolean
        },
        watch:{
            treeData(val){
                //避免首次进来treeData还没生成
                if(this.selectedIds.length>0){
                    this.setChecked()
                }
            },
            selectedIds(val){
                // console.log('val',val)
                this.setChecked()
            }
        },
        components: {
            treeSelect
        },
        created(){
            this.getUserList()
        },
        methods: {
            reload() {
                this.hackReset = false;
                this.$nextTick(() => {
                    this.hackReset = true;
                });
                // this.getUserList()
            },
            setSelectedId(val) {
                if (val instanceof Array) {
                    this.treeSelectArr = val;
                    this.$emit('selected-user', val)
                }
            },
            showTreeError(error) {
                Message.info(error.message);
            },
            //编辑时，默认选中的用户
            setChecked: function () {
                this.treeSelectArr = this.selectedIds
                let SelectedIds = this.treeSelectArr.map(item => item.id);
                SelectedIds = SelectedIds.map(Number)
                this.checkedIds = SelectedIds
                // console.log(SelectedIds,this.treeData)
                var refoldData = function (data) {
                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            if (SelectedIds.includes(item.id)) {
                                item.checked = true;
                                // console.log(item.id)
                            } else {
                                item.checked = false;
                            }
                            if (Array.isArray(item.childDepts)) {
                                refoldData(item.childDepts);
                            }
                            return item;
                        });
                    }
                };
                refoldData(this.treeData);
            },
            //用户列表
            getUserList: function () {
                Service.UserListV2Service().then(result => {
                    var managerList = result.data.userList;
                    var level = 0;
                    var pid = 0;
                    var refoldData = function (data, level, pid) {
                        level++;
                        if (Array.isArray(data)) {
                            data.forEach(item => {
                                if (Array.isArray(item.userList) && item.userList.length > 0) {
                                    item.childDepts = JSON.parse(JSON.stringify(item.userList));
                                }
                                item.deptLevel = level;
                                item.pid = pid;
                                item.nodetype = item.type == 2 ? 2 : 1;
                                item.type = 2;
                                delete item.userList;

                                if (Array.isArray(item.childDepts)) {
                                    refoldData(item.childDepts, level, item.id);
                                }
                                return item;
                            });
                        }
                    };
                    refoldData(managerList, level, pid);
                    this.treeData = managerList;
                    // 设置右侧checked列表
                    // if(this.selectedIds){
                    //     this.setChecked()
                    // }
                });
            }
        }
    }
</script>
<style lang="scss">

</style>