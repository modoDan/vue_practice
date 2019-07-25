import Vue from "vue";

//实现简单的跨组件数据状态共享
export const store = Vue.observable({
    username:''
});

export const mutations = {
    setUserName(username) {
        store.username = username;
    }
};