<template>
  <div>
    <div class="ats-tree" ref="atsTree">
      <div class="ats-input" @mouseenter="hovering=true" @mouseleave="hovering=false">
        <div class="ats-input-multiple el-input__inner" v-if="this.multiple">
          <div class="ats-labels">
            <input
              ref="multipleInput"
              type="text"
              :placeholder="placetext"
              v-model="treeSelected"
              :treeinput="treeinput"
              @input="handleFilter"
              @blur="handleAutoComplete"
            >
            <i class="el-icon-search"></i>
          </div>
        </div>
      </div>
      <el-scrollbar class="ats-tree-scrollbar" ref="treeScrollbar">
        <div class="ats-tree-wrapper">
          <ul class="ats-tree-nodes">
            <tree-node
              v-for="(child,index) in treeNodes[treeProps.children]"
              :node="child"
              :key="index"
              :multiple="multiple"
              :currentNodeId="currentNodeId"
              :treeProps="treeProps"
              :query="query"
              :isQuering="isQuering"
            ></tree-node>
          </ul>
        </div>
      </el-scrollbar>
    </div>
    <div class="ats-tag-scrollbar">
      <div class="el-select__nums">
        <p>
          已选择
          <span>&nbsp;{{checkedItems.length}}&nbsp;</span>位用户
          <b class="mark02" v-show="!checkedItems.length">{{userNumsg}}</b>
        </p>
      </div>
      <el-scrollbar class="treeslect-scrollbar">
        <el-tag
          v-for="(item,index) in checkedItems"
          :key="index"
          :closable="item.closable"
          type="primary"
          class="el-tag--primary"
          @close="handleDelItem(item,$event)"
          :title="handleTitleVisible(item[treeProps.label])"
        >{{item[treeProps.label] | showEllips}}</el-tag>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import Bus from "@/common/bus";
import treeNode from "./tree-node";
import debounce from "throttle-debounce/throttle";
import { objArrDeepCopy } from "@/utils/tools";

export default {
  name: "tree-select",
  components: {
    treeNode
  },
  props: {
      checkedIds: {
      type: Array,
      default: []
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    treeData: {
      type: Array,
      default: []
    },
    treeProps: {
      type: Object,
      default: {
        label: "label",
        children: "children"
      }
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    userNumsg: {
      type: String,
      default: ""
    },
    treeinput: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean
    }
  },
  created() {
    Bus.$on("node-click", this.handleNodeClick);
  },
  destroyed() {
    Bus.$off("node-click", this.handleNodeClick);
  },
  updated() {
    this.isDefault = true;
  },
  computed: {
    checkedItems: function() {
      //   console.log('返回值',this.getcheckedUsers(this.treeNodes));
      let checkedUsers = this.getcheckedUsers(this.treeNodes);
      checkedUsers.forEach((item)=>{
          if(this.checkedIds.includes(item.id)&&!this.isDelete){
              this.$set(item,'closable',false)
          }else{
              this.$set(item,'closable',true)
          }
      })
      return checkedUsers;
    }
  },
  watch: {
    //侦听父组件传treeinput值变化重新初始化搜索条件
    treeinput(val) {
      this.treeSelected = "";
      this.isQuering = false;
      console.log("观察变化", this.isQuering);
    },
    //侦听treeData值变化，当点击编辑时初始选中值变化设置treeData中对应id为checked状态，再次进入弹框后，需更新该treeData值，深拷贝成一个对象树
    treeData(val) {
      //    console.log('左侧的树this.treeData')
      if (val) {
        this.treeNodes = {
          [this.treeProps.children]: objArrDeepCopy(val, {
            visible: true
          }),
          visible: true
        };
      }
    },
    checkedKeys(val) {
      if (val.length) {
        this.placetext = "";
      } else {
        this.placetext = this.placeholder;
      }
      if (this.multiple) {
        setTimeout(
          function() {
            this.resetTreeTop();
          }.bind(this),
          400
        );
        if (!this.isDefault) {
          this.setInputFocus();
        }
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
      placetext: this.placeholder,
      currentNodeId: "",
      currentSelected: "",
      treeSelected: "",
      isQuering: false,
      query: "",
      checkedKeys: [],
      isDefault: true,
      error: {
        message: "",
        data: ""
      },
      hovering: false
    };
  },
  methods: {
    //递归左侧树中是true的 push到数组绑定到右侧选中组
    getcheckedUsers(node) {
      let self = this;
      let childNodes = node[self.treeProps.children];
      var checkedUserList = [];
      if (Array.isArray(childNodes)) {
        childNodes.forEach(item => {
          if (item.nodetype == 2 && item.checked == true) {
            checkedUserList.push({
              id: item.id,
              name: item.name
            });
          }
          if (Array.isArray(item.childDepts)) {
            checkedUserList = checkedUserList.concat(
              this.getcheckedUsers(item)
            );
            return checkedUserList;
          }
        });
        return checkedUserList;
      }
    },
    //点击左侧树的某一节点时，只触发改变改节点左侧的checked状态true和false
    handleNodeClick(node, event) {
      if (event) {
        this.isDefault = false;
      }
      if (node.checked) {
        this.$set(node, "checked", false);
      } else {
        this.$set(node, "checked", true);
      }
      if (node.nodetype == 1) {
        this.handleAllNode(node);
      }
      this.cancleAllNode(node, this.treeNodes);
      this.$emit("setSelectedId", this.checkedItems);
    },
    cancleAllNode(node, treeNodes) {
      //点击子节点，取消选中父节点
      let self = this;
    //   console.log("treeNodes", treeNodes);

      let childNodes = treeNodes[self.treeProps.children];
      let parentNode = false;
      var find_parent = function(data) {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].id == node.pid) {
              parentNode = data[i];
              let ischecked = parentNode.childDepts.every(item => item.checked);
              self.$set(parentNode, "checked", ischecked);
              return;
            } else if (data[i].childDepts) {
              find_parent(data[i].childDepts);
            }
          }
        }
      };
      find_parent(childNodes);
    },
    handleAllNode(node) {
      //点击父节点，选中所有子节点
      let self = this;
      let childNodes = node[self.treeProps.children];
      if (Array.isArray(childNodes)) {
        childNodes.forEach(item => {
          if (node.checked) {
            this.$set(item, "checked", true);
          } else {
            this.$set(item, "checked", false);
          }
          if (Array.isArray(item.childDepts)) {
            this.handleAllNode(item);
          }
        });
      }
    },
    handleFilter: debounce(1000, function() {
      this.isQuering = true;
      if (this.isQuering) {
        this.query = this.treeSelected;
        this.treeFilterMethod(this.treeNodes);
      }
    }),
    treeFilterMethod(node) {
      let self = this;
      let childNodes = node[self.treeProps.children];
      // 循环树中所有是否包含搜索的name，包含则把child改成可见，否则为false
      if (Array.isArray(childNodes)) {
        childNodes.forEach(child => {
          child.visible =
            child[self.treeProps.label]
              .toLowerCase()
              .indexOf(self.query.toLowerCase()) > -1;
          self.treeFilterMethod(child);
        });
        //判断节点为false且包含子节点时，循环子节点中的child为true的，则将其他外部节点置为false
        if (!node.visible && childNodes.length) {
          let allHidden = true;
          childNodes.forEach(child => {
            if (child.visible) allHidden = false;
          });
          node.visible = allHidden === false;
        }
        //node.visible根据当前为true则展开当前节点，来显示数据, 所有节点均为展开的，当为部门时，则不展示部门
        // if (node.visible){
        if (self.query !== "") {
          if (node.nodetype == 1) {
            this.$set(node, "visible", false);
          }
          this.isQuering = true;
          this.$set(node, "expanded", true);
        } else {
          this.isQuering = false;
          this.$set(node, "expanded", false);
        }
        // }
      }
    },
    handleAutoComplete() {
      setTimeout(
        function() {
          this.query = "";
          if (this.currentNodeId) {
            this.treeSelected = this.currentSelected;
          }
        }.bind(this),
        250
      );
    },
    handleDelItem(item, event) {
      if (event) {
        this.isDefault = false;
      }
      let self = this;
      let treeNodes = this.treeNodes;
      self.CancelTreeItem(item.id, treeNodes);
      this.$emit("setSelectedId", this.checkedItems); 
    },
    //点击选中人员的关闭按钮时，遍历左侧树结构 模拟操作左侧树中该id值
    CancelTreeItem(id, treeNodes) {
      let self = this;
      let childNodes = treeNodes[self.treeProps.children];
      if (Array.isArray(childNodes)) {
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i].id == id) {
            self.handleNodeClick(childNodes[i]);
            break;
          } else {
            self.CancelTreeItem(id, childNodes[i]);
          }
        }
      }
    },
    resetTreeTop() {
      // console.log("111111");
      this.$nextTick(function() {
        let inputMultiple = this.$refs.atsTree.querySelector(
          ".ats-input-multiple"
        );
        let treeScrollbar = this.$refs.atsTree.querySelector(
          ".ats-tree-scrollbar"
        );
        let inputMultipleHeight = inputMultiple.offsetHeight;

        treeScrollbar.style.top = inputMultipleHeight + 5 + "px";
      });
    },
    setInputFocus() {
      let multipleInput = this.$refs.multipleInput;

      multipleInput.focus();
    },
    handleTitleVisible(str) {
      if (!str) return "";
      let tempLen = 0;

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2;
        } else {
          tempLen += 1;
        }
      }
      if (tempLen >= 8) {
        return str;
      } else {
        return "";
      }
    }
  },
  filters: {
    // 截取前18个字节
    showEllips(str) {
      if (!str) return "";
      let tempLen = 0;

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2;
        } else {
          tempLen += 1;
        }
        if (tempLen >= 8) {
          str = str.substring(0, i) + "...";
          break;
        }
      }
      return str;
    }
  }
};
</script>

<style lang="scss">
.ats-tree {
//   display: inline-block;
  position: relative;
  .ats-input {
    position: relative;
    .el-icon-caret-bottom {
      cursor: pointer;
      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }
  }
  .el-input__inner {
    width: 11.25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 0.125rem;
    border: 1px solid #cacaca;
    box-sizing: border-box;
    color: rgb(31, 46, 61);
    display: block;
    font-size: 0.4375rem;
    height: 1.125rem;
    line-height: 1;
    outline: 0;
    padding: 0.09375rem 0.3125rem;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ats-input-multiple {
    height: auto;
  }
  .ats-input-multiple input {
    line-height: 1rem;
    height: 0.875rem;
    box-sizing: border-box;
    outline: none;
    border: 0;
    position: relative;
    right: 1.09375rem;
    left: 0;
    width: 10rem;
    font-size: 0.375rem;
  }
  .ats-input-multiple .ats-labels {
    position: relative;
    i.el-icon-search {
      position: absolute;
      right: 0.5rem;
      top: -0.09375rem;
      border-left: 1px solid #cacaca;
      height: 2.1875rem;
    }
    .el-icon-search:before {
      content: "\E619";
      font-size: 0.65625rem;
      right: -0.71875rem;
      color: #707070;
      top: 0.125rem;
      position: absolute;
    }
  }

  .ats-input-multiple {
    position: relative;
    height: 1.25rem;
    top: 0.3125rem;
    transform: none;
    width: 9.375rem;
    &:hover {
      cursor: pointer;
    }
  }
  .ats-input-multiple {
    max-width: 9.28125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
  .ats-input-multiple input:focus {
    outline: none;
  }
  .ats-tree-scrollbar {
    top: 1.1rem;
    width: 9.28125rem;
    min-height: 9.375rem;
    position: absolute;
    z-index: 1001;
    background: #fff;
    border: 1px solid #cacaca;
    .el-scrollbar__view {
      height: 15.625rem;
    }
    transition: all 0.1s linear;
  }
  .ats-tree-wrapper {
    background-color: #fff;
  }
}

.ats-tag-scrollbar {
  margin-left: 9.9375rem;
  color: #0a6cc0;
  width: 9.09375rem;
  height: 15.625rem;
}

.treeslect-scrollbar.el-scrollbar {
  top: -1%;
  width: 9.375rem;
  min-height: 9.375rem;
  z-index: 1001;
  background: #fff;
  border: 1px solid #cacaca;
  text-align: left;
  .el-scrollbar__view {
    height: 15.685rem;
  }
  transition: all 0.1s linear;
  span.el-tag.el-tag--primary.el-tag--primary {
    margin: 0.15625rem;
    font-weight: 550;
  }
  .el-tag {
    background-color: #f4faff;
    border: 1px solid #d6ecff;
    color: #0a6cc0;
    height: 1.09375rem;
    line-height: 0.9375rem;
    font-size: 0.4375rem;
  }
}

.el-select__nums {
  position: absolute;
  height: 1.5625rem;
  line-height: 0.875rem;
  z-index: 1;
  top: 8%;
  border: 1px solid #cacaca;
  border-radius: 0.09375rem;
  color: #333;
  font-size: 0.40625rem;
  width: 9.375rem;
  transform: translateY(-50%);
  text-align: left;
  p {
    span {
      color: #0a6cc0;
      font-weight: bold;
    }
  }
}

</style>
