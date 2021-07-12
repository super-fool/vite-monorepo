<template>
  <div class="view">
    <header class="view-header pb-24">
      <span class="view-header-count">待巡检相机数量：{{ waitPatrolCameraNumber }}</span>
      <el-button type="primary"
                 @click="liveVideoHandel">打开实时视频</el-button>
    </header>
    <section class="view-content">
      <div class="view-content-main">
        <div class="view-content-main-item"
             v-for="(item,index) in tableData"
             :key="index">
          <div class="view-content-main-item-triangle"
               :class="item.CameraStrategyResult == 3? 'yellow':'green'">
            <div class="view-content-main-item-triangle-text ">{{item.patrolStatus == 3? '待巡检':'正常'}}</div>
          </div>
          <div class="view-content-main-item-one">
            <div class="view-content-main-item-one-icon"></div>
            <div class="view-content-main-item-one-text">
              <div class="flex mb-5">
                <div class="font-18 bold mr-8 over-text">{{item.cameraCode}}</div>
                <div class="center font-14 p-8"
                     :class="item.emptyParkingSpace > 0? 'unfull':'full'">{{item.emptyParkingSpace>0? '剩余'+ item.emptyParkingSpace+'个车位':'车位已满'}}</div>
              </div>
              <div class="font-14 mb-16">{{item.bindingRoadAndSpace || '暂无数据'}}</div>
            </div>
          </div>
          <div class="view-content-main-item-two font-14">
            <span>上次巡检时间：</span>
            <span>{{item.lastPollingTime}}</span>
          </div>
          <div class="view-content-main-item-three">
            <div class="flex font-14"
                 v-for="(tag,key) in item.patrolReason"
                 :key="key">
              <span class="view-content-main-item-three-tag">{{tag.reason}}</span>
            </div>
          </div>
          <div class="view-content-main-item-four">
            <el-button type="primary"
                       plain
                       @click="toOnSiteIns(item.cameraCode)">巡检</el-button>
          </div>
        </div>

      </div>
      <footer class="view-content-footer">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="params.current"
                       :page-sizes="[12, 24, 36, 48]"
                       :page-size="params.size"
                       layout="total, sizes, prev, pager, next"
                       :total="totalCount">
        </el-pagination>
      </footer>
    </section>
  </div>
</template>

<script>
import * as api from '@/api/audit';
export default {

  created() {
    if (this.isSingle) this.params.parkId = this.$store.getters.userParkId;
    this.searchData();
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    }
  },
  data() {
    return {
      totalCount: 0,
      tableData: [],
      params: {
        current: 1,
        size: 12
      },
      waitPatrolCameraNumber: 0
    }
  },
  methods: {
    liveVideoHandel() {
      const url = window.location.origin + '/#/CameraLivingVideo';
      window.open(url);
    },
    handleSizeChange(val) {
      this.params.size = val
      this.searchData()
    },
    handleCurrentChange(val) {
      this.params.current = val
      this.searchData()
    },
    searchData() {
      api.getPatrolAuditList(this.params).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
        this.waitPatrolCameraNumber = res.waitPatrolCameraNumber
      });
    },
    toOnSiteIns(code) {
      this.$router.push({
        path: '/OnSiteInspection',
        query: {
          cameraCode: code,
          areaIndex: ''
        }
      });
    }
  }
}
</script>
<style scoped lang="less">
.view {
  &-header {
    &-count {
      font-size: 18px;
      font-weight: bold;
      margin-right: 15px;
    }
  }
  &-content {
    background-color: #fff;
    height: 80%;
    // overflow-y: scroll;
    padding: 24px;
    display: flex;
    flex-direction: column;
    &-main {
      height: calc(100% - 40px);
      overflow-y: scroll;
      display: flex;
      flex-wrap: wrap;
      &-item {
        flex-shrink: 0;
        position: relative;
        width: 327px;
        height: 190px;
        border-radius: 1px;
        border: 1px solid #e8ecf0;
        margin-right: 30px;
        margin-bottom: 24px;
        padding: 16px;
        color: #595959;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &-triangle {
          &-text {
            position: relative;
            z-index: 3;
            transform: rotate(45deg);
            line-height: 16px;
          }
        }
        &-one {
          display: flex;
          border-bottom: 1px solid #e8ecf0;
          &-icon {
            width: 32px;
            height: 32px;
            background: url('../../assets/image/camera_icon.png');
            background-size: 100%;
            margin-right: 16px;
          }
          &-text {
            line-height: 24px;
          }
        }
        &-two {
          font-weight: 400;
          line-height: 12px;
          padding: 16px 0;
        }
        &-three {
          height: 38px;
          overflow-y: scroll;
          margin-bottom: 8px;
          &-tag {
            background: #f4f6fc;
            margin-right: 8px;
            padding: 0 8px;
            line-height: 28px;
            color: #ff8718;
          }
        }
        &-four {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    &-footer {
      height: 40px;
      flex-shrink: 0;
    }
  }
  .pb-24 {
    padding-bottom: 24px;
  }
  .yellow,
  .green {
    position: absolute;
    right: 0;
    top: 14px;
    color: #fff;
    text-align: center;
    &:after {
      transform: rotate(45deg);
      position: absolute;
      z-index: 1;
      right: -44px;
      top: -59px;
      content: '';
      display: block;
      width: 0;
      height: 0;
      border: 44px solid transparent;
      // border-bottom-color: #ffbf18;
    }
  }
  .yellow {
    &:after {
      border-bottom-color: #ffbf18;
    }
  }
  .green {
    color: rgba(12, 220, 30, 1);
    &:after {
      border-bottom-color: #e1f8de;
    }
  }
  .full {
    border-radius: 2px;
    border: 1px solid #ffe6e5;
    color: #ed2121;
    line-height: 20px;
  }
  .unfull {
    border-radius: 2px;
    border: 1px solid #d0f1cc;
    color: #0cdc1e;
  }
  .over-text {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>