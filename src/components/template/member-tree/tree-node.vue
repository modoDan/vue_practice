<template>
  <li
    class="ats-tree-node"
    :class="{'is-expanded':node.expanded}"
    @click.stop="handleClick(node,$event)"
  >
    <div
      v-show="node.visible"
      :class="{ 'quer-content':this.isQuering,'node-content':!this.isQuering, 'is-current':currentNodeId===node.id,'is-checked':node.checked}"
    >
      <div
        v-if="!this.isQuering"
        :style="{ 'margin-left': (node[treeProps.level] - 1) * .5 + 'rem' }"
        class="ats-tree-node__icon icon"
      >
        <span
          v-if="node[treeProps.children]&&node[treeProps.children].length"
          class="ats-tree-node__expand-icon icon"
          :class="{ expanded: node.expanded }"
        ></span>
      </div>
      <!-- nodetype为1是文件夹  部门 ，2是文件 用户 -->
      <span class="ats-tree-node__label" :title="handleTitleVisible(node[treeProps.label])">
        <i :class="node.nodetype==1?'dep-pic':'user-pic'"></i>
        {{node[treeProps.label]}}
      </span>
      <span
        v-show="this.isQuering"
        class="depart-label"
        :title="handleTitleVisible(node.oadepartmentMessage)"
      >{{node.oadepartmentShow}}</span>
    </div>
    <ul class="ats-tree-node__children" v-if="node.expanded">
      <tree-node
        v-for="(child,index) in node[treeProps.children]"
        :node="child"
        :key="index"
        :treeProps="treeProps"
        :currentNodeId="currentNodeId"
        :query="query"
        :isQuering="isQuering"
      ></tree-node>
    </ul>
  </li>
</template>

<script>
import Bus from "@/common/bus";
export default {
  name: "treeNode",
  props: {
    node: {
      type: Object,
      defautl: {}
    },
    treeProps: {},
    multiple: {},
    currentNodeId: {},
    query: {
      type: String
    },
    isQuering: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick(node, event) {
      let targetClass = event.target.getAttribute("class");
      if (node.expanded) {
        this.$set(node, "expanded", false);
      } else {
        this.$set(node, "expanded", true);
      }
      if (node.type == 2) {
        if (!(targetClass.indexOf("icon") > -1)) {
          Bus.$emit("node-click", node, event);
        }
      }
    },
    handleTitleVisible(title) {
      if (title) {
        // console.log("title",title)
        let titleLen = title.replace(/[^\x00-\xff]/g, "..").length;
        if (titleLen > 28) {
          return title;
        } else {
          return "";
        }
      }
    },
    showlevel(level) {
      return;
    }
  }
};
</script>

<style lang="scss">
.ats-tree-node {
  position: relative;
  .node-content {
    text-indent: 0.15625rem;
    line-height: 1.125rem;
    height: 1.125rem;
    cursor: pointer;
    white-space: nowrap;
    text-align: left;
    &:hover {
      background: rgb(228, 232, 241);
    }
    &.is-current {
      background-color: rgb(4, 137, 224);
      color: #fff;
    }
    .ats-tree-node__icon {
      display: inline-block;
      width: 0.6875rem;
      height: 1.125rem;
      vertical-align: top;
    }
    .ats-tree-node__expand-icon {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      width: 0;
      height: 0;
      margin-left: 0.3125rem;
      border: 0.1875rem solid transparent;
      border-right-width: 0;
      border-left-color: rgb(151, 169, 190);
      border-left-width: 0.21875rem;
      transform: rotate(0);
      transition: transform 0.3s ease-in-out;
      &.expanded {
        transform: rotate(90deg);
      }
    }
    .ats-tree-node__label {
      font-size: 0.4375rem;
      max-width: 7.1875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
    .dep-pic {
      display: inline-block;
      width: 0.78125rem;
      height: 0.9375rem;
      background: url("./img/noopen-files.png") right bottom no-repeat;
      background-size: 0.78125rem;
    }
    .user-pic {
      display: inline-block;
      width: 0.78125rem;
      height: 0.9375rem;
      background: url("./img/usericon.png") right bottom no-repeat;
      background-size: 88%;
    }
  }
  .quer-content {
    text-indent: 0.15625rem;
    line-height: 0.625rem;
    height: 1.5625rem;
    cursor: pointer;
    white-space: nowrap;
    text-align: left;
    &:hover {
      background: rgb(228, 232, 241);
    }
    &.is-current {
      background-color: rgb(4, 137, 224);
      color: #fff;
    }
    .ats-tree-node__icon {
      display: inline-block;
      width: 0.6875rem;
      height: 1.125rem;
      vertical-align: top;
    }
    .ats-tree-node__expand-icon {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      width: 0;
      height: 0;
      margin-left: 0.3125rem;
      border: 0.1875rem solid transparent;
      border-right-width: 0;
      border-left-color: rgb(151, 169, 190);
      border-left-width: 0.21875rem;
      transform: rotate(0);
      transition: transform 0.3s ease-in-out;
      &.expanded {
        transform: rotate(90deg);
      }
    }
    .ats-tree-node__label {
      font-size: 0.4375rem;
      max-width: 7.1875rem;
      text-indent: 0.5rem;
      font-size: 0.4375rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      color: #000000;
    }
    .depart-label {
      font-size: 0.375rem;
      color: #999999;
      max-width: 7.1875rem;
      text-indent: 0.4375rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
  }

  .node-content.is-checked .ats-tree-node__label {
    color: #0a6cc0;
    font-weight: 550;
    &::after {
      color: #0a6cc0;
      content: "\E611";
      font-family: element-icons;
      right: 0.3125rem;
      font-weight: bold;
      font-size: 0.59375rem;
      position: absolute;
      -webkit-font-smoothing: antialiased;
    }
  }
  .quer-content.is-checked .ats-tree-node__label {
    color: #0a6cc0;
    font-weight: 550;
    &::after {
      color: #0a6cc0;
      content: "\E611";
      font-family: element-icons;
      right: 0.3125rem;
      top: 0.34375rem;
      font-weight: bold;
      font-size: 0.59375rem;
      position: absolute;
      -webkit-font-smoothing: antialiased;
    }
  }
}
</style>
