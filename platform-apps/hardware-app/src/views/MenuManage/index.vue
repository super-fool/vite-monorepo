<template>
  <el-container>
    <el-aside>
      <div class="side-content">
        <el-tree ref="menulTree"
                 @node-click="treeNodeClick"
                 :data="treeData"
                 :props="treeProps"
                 node-key="id"
                 default-expand-all>
        </el-tree>
      </div>
    </el-aside>
    <el-main>
      <div class="view">
        <header class="view-header">
          <el-form label-width="auto"
                   inline>
            <el-form-item label="节点名称：">
              <el-input v-model="param.menuName"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="handleSearchTabel">查询</el-button>
            <el-button type="primary"
                       size="medium"
                       icon="el-icon-plus"
                       @click="addData">新增菜单</el-button>
          </el-form>
        </header>
        <div class="view-content">
          <div class="view-content-table">
            <el-table :data="tableData"
                      :header-cell-style="{
                background: '#f5f5f5',
                'line-height': '36px',
              }"
                      style="width: 100%">
              <el-table-column prop="menuName"
                               label="节点名称"
                               min-width="100">
              </el-table-column>
              <el-table-column prop="pname"
                               label="上级节点"
                               min-width="100">
              </el-table-column>
              <el-table-column label="节点类型"
                               min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.menuType | getMenuType }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime"
                               label="创建时间"
                               min-width="170">
              </el-table-column>
              <el-table-column prop="updateTime"
                               label="更新时间"
                               min-width="170">
              </el-table-column>
              <el-table-column label="操作"
                               fixed="right"
                               width="200">
                <template slot-scope="scope">
                  <el-button type="text"
                             class="mr-5"
                             @click="editData(scope.row)">编辑</el-button>
                  <el-button type="text"
                             class="danger-btn"
                             @click="delData(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination background
                         layout="prev, pager, next"
                         :page-sizes="[5, 10, 20]"
                         :page-size="param.size"
                         :current-page.sync="param.current"
                         :total="totalCount"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </div>
        <editDialog :dialogVisible.sync="addVisible"
                    :data-item="dataItem"
                    :treeItem="treeItem"
                    @form-submit="updateData"></editDialog>
        <el-dialog :visible.sync="treeDialogVisible"
                   width="400px">
          <el-button @click="treeEdit">编辑菜单</el-button>
          <el-button type="danger"
                     @click="treeDel">删除菜单</el-button>
          <el-button type="primary"
                     @click="treeAdd">新增下级菜单</el-button>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import editDialog from './components/editDialog';
import { getMenuTree, getMenuList, delData } from '@/api/menuManage';
export default {
  components: { editDialog },
  data() {
    return {
      treeDialogVisible: false,
      treeProps: {
        label: 'menuName',
        children: 'childMenus',
      },
      treeData: null,
      treeItem: null,
      param: {
        menuName: '',
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
    };
  },
  filters: {
    getMenuType(v) {
      let text = '';
      switch (v) {
        case 0:
          text = '文件夹';
          break;
        case 1:
          text = '页面';
          break;
        case 2:
          text = '按钮';
          break;
        default:
          text = '-';
          break;
      }
      return text;
    },
  },
  watch: {
    treeDialogVisible: function(val) {
      if (!val) {
        this.treeItem = null;
      }
    },
  },
  created() { },
  mounted() {
    this.getMenuTree();
    this.searchData();
  },
  methods: {
    getMenuTree() {
      getMenuTree({
        parkId: '',
      }).then((data) => {
        this.treeData = data;
      });
    },
    treeNodeClick(item) {
      console.log(item);
      this.treeItem = item;
      this.treeDialogVisible = true;
    },
    treeEdit() {
      this.editData(this.treeItem);
    },
    treeAdd() {
      this.addData(this.treeItem);
    },
    treeDel() {
      this.delData(this.treeItem);
    },
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
    },
    updateData() {
      this.getMenuTree();
      this.searchData();
      this.treeDialogVisible = false;
    },
    searchData() {
      getMenuList(this.param).then((data) => {
        const { records, total } = data;
        this.tableData = records;
        this.totalCount = total;
      });
    },
    addData() {
      this.dataItem = null;
      this.addVisible = true;
    },
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.addVisible = true;
    },
    delData(row) {
      this.$confirm(
        '请确认是否删除该节点，删除后 ，该节点将无法再显示',
        '确认提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).then(() => {
        delData({ menuId: row.id }).then((res) => {
          this.$message.success('删除节点成功');
          this.updateData();
        });
      });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    handleSizeChange(val) {
      this.param.current = 1;
      this.param.size = val;
      this.searchData();
    },
  },
};
</script>
<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-main {
  padding: 0;
}
.el-aside {
  width: 300px;
  margin: 20px 0 20px 20px;
  background-color: #ffffff;
  .side-content {
    padding: 20px 10px;
    .search-box {
      display: flex;
    }
    .el-button {
      margin-left: 5px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
.road-sel-form {
  padding: 0 30px;
}
</style>
