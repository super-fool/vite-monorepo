<template>
  <el-container>
    <el-aside v-if="isAdmin">
      <div class="side-content">
        <div class="search-box">
          <el-input v-model="parkLotInput"
                    placeholder="请输入车场"></el-input>
          <el-button type="primary"
                     size="medium"
                     @click="searchParkLot">查询</el-button>
        </div>
        <ul class="park-lot-list">
          <li v-for="item in parkLotOptions"
              :key="item.id"
              class="ellipsis"
              :class="{ active: param.parkId === item.id }"
              @click="parkLotSelect(item)">
            {{ item.parkName }}
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main>
      <div class="view">
        <header class="view-header">
          <el-form label-width="auto"
                   inline>
            <el-form-item label="角色名称：">
              <el-input v-model="param.roleName"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="handleSearchTabel">查询</el-button>
            <el-button type="primary"
                       size="medium"
                       icon="el-icon-plus"
                       @click="addData">新增角色</el-button>
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
              <el-table-column prop="roleName"
                               label="角色名称"
                               min-width="100">
              </el-table-column>
              <el-table-column prop="description"
                               label="角色描述"
                               min-width="100">
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
                    :parkLotItem="parkLotItem"
                    @form-submit="searchData"></editDialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import editDialog from './components/editDialog';
import { getUserParking } from '@/api/login';
import { getRoleList, delData } from '@/api/roleManage';
import * as vx from 'vuex';
export default {
  components: { editDialog },
  data() {
    return {
      parkLotInput: '',
      parkLotList: [],
      parkLotOptions: [],
      parkLotItem: null,
      param: {
        roleName: '',
        parkId: '',
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
    };
  },
  computed: {
    ...vx.mapGetters(['isAdmin', 'parkLotObj', 'userParkId']),
  },
  created() { },
  mounted() {
    if (this.isAdmin) {
      this.getUserParking();
    } else {
      this.parkLotItem = this.parkLotObj;
      this.param.parkId = this.userParkId;
      this.handleSearchTabel();
    }
  },
  methods: {
    getUserParking() {
      getUserParking().then((data) => {
        const { parkings } = data;
        this.parkLotList = parkings;
        this.parkLotOptions = parkings;
      });
    },
    searchParkLot() {
      if (this.parkLotInput == '') {
        this.parkLotOptions = this.parkLotList;
      }
      this.parkLotOptions = this.parkLotList.filter((item) => {
        return item.parkName.indexOf(this.parkLotInput) > -1;
      });
    },
    parkLotSelect(item) {
      this.parkLotItem = item;
      this.param.parkId = item.id;
      this.handleSearchTabel();
    },
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
    },
    searchData() {
      getRoleList(this.param).then((data) => {
        const { records, total } = data;
        this.tableData = records;
        this.totalCount = total;
      });
    },
    addData() {
      if (!this.parkLotItem) {
        this.$message.warning('请先选择车场');
        return false;
      }
      this.dataItem = null;
      this.addVisible = true;
    },
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.addVisible = true;
    },
    delData(row) {
      this.$confirm('请确认是否删除该角色', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        delData({ roleId: row.id }).then((res) => {
          this.$message.success('删除角色成功');
          this.searchData();
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
  .park-lot-list {
    margin-top: 10px;
    li {
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        background: #c7dbf1;
      }
    }
    .active {
      background: #c7dbf1;
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
