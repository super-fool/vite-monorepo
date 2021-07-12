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
            <el-form-item label="用户名称：">
              <el-input v-model="param.nickName"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="handleSearchTabel">查询</el-button>
            <el-button type="primary"
                       size="medium"
                       icon="el-icon-plus"
                       @click="addData">新增用户</el-button>
          </el-form>
        </header>
        <div class="view-content">
          <div class="view-content-table">
            <el-table ref="tableData"
                      :data="tableData"
                      :header-cell-style="{
                background: '#f5f5f5',
                'line-height': '36px',
              }"
                      style="width: 100%">
              <el-table-column prop="nickname"
                               label="用户名称"
                               min-width="100">
              </el-table-column>
              <el-table-column prop="username"
                               label="用户登录账号"
                               min-width="120">
              </el-table-column>
              <el-table-column prop="roleName"
                               label="角色列表"
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
                               width="250">
                <template slot-scope="scope">
                  <el-button type="text"
                             @click="editData(scope.row)">编辑</el-button>
                  <el-button type="text"
                             class="danger-btn"
                             @click="delData(scope.row)">删除</el-button>
                  <el-button type="text"
                             @click="resetPwd(scope.row)">重置密码</el-button>
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
import { getDataList, delData, resetPassword } from '@/api/userManage';
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
        nickName: '',
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
      getDataList(this.param).then((data) => {
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
      this.$confirm('请确认是否删除该用户', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        delData({ userId: row.id, parkId: this.parkLotItem.id }).then(
          (res) => {
            this.$message.success('删除用户成功');
            this.searchData();
          }
        );
      });
    },
    resetPwd(row) {
      this.$confirm('请确认是否重置该用户密码', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        resetPassword({ userId: row.id }).then(() => {
          this.$alert('重置密码成功，重置后密码和登录账号一致', '成功提示', {
            confirmButtonText: '确定',
          });
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
      width: 100%;
      box-sizing: border-box;
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
