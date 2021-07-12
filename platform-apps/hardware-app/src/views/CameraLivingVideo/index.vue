<template>
  <div class="video-player-wrapper">
    <header>
      <h3>相机实时视频</h3>
      <ul>
        <li>{{ $moment().format('YYYY-MM-DD HH:mm:ss') }}</li>
        <li>{{ cameraInfo.cameraCode || '-' }}</li>
        <li>{{ cameraInfo.roadParkspace || '-' }}</li>
      </ul>
    </header>
    <div class="video-player"
         ref="playercontainer">
      <div id="vplayer"
           class="player-box"></div>
      <div v-if="isLoading"
           class="out-line">
        <i class="el-icon-loading"></i>相机视频流获取中，请稍等...
      </div>
      <div v-if="outLine"
           class="out-line">
        <i class="el-icon-warning-outline"></i>相机连接中...
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/CameraLivingVideo';
export default {
  data() {
    return {
      cameraCode: '',
      cameraInfo: {},
      player: null,
      isLoading: false,
      outLine: false,
      cameraTimer: null,
      moreStreamTimer: null
    };
  },
  created() { },
  mounted() {
    this.initMain();
    window.onresize = () => {
      let w = this.$refs.playercontainer.clientWidth;
      let h = this.$refs.playercontainer.clientHeight;
      this.player.resize(w, h);
    };
  },
  beforeDestroy() {
    this.player.remove();
    this.cameraTimer && this.clearInterval(this.cameraTimer);
    this.moreStreamTimer && this.clearInterval(this.moreStreamTimer);
  },
  methods: {
    initMain() {
      this.cameraTimer = setInterval(() => {
        const cameraCode = window.localStorage.getItem('livingCode');
        if (cameraCode && this.cameraCode !== cameraCode) {
          this.cameraCode = cameraCode;
          this.getPlayerInfo();
        }
      }, 1500);
    },
    initPlayer(url) {
      this.player = cyberplayer('vplayer').setup({
        width: this.$refs.playercontainer.clientWidth,
        height: this.$refs.playercontainer.clientHeight,
        file: url || 'rtmp://112.5.64.63:9826/live/CA19611098', // <—rtmp直播地址
        autostart: true,
        stretching: 'uniform', //播放器缩放方式(uniform:添加黑边缩放；exactfit:改变宽高比缩到最大；)
        volume: 0, //播放器音量
        controls: false,
        rtmp: {
          reconnecttime: 5, // rtmp直播的重连次数
          bufferlength: 0 // 缓冲多少秒之后开始播放 默认1秒
        },
        ak: 'ab2d7da3f1df4a92835c63a955afbad5'
      });
      // 离线提示
      this.player.onNoLiveStream(() => {
        if (this.player.getState() !== 'playing') {
          //离线显示文案
          this.isLoading = false;
          this.outLine = true;
        }
      });
      //恢复直播
      this.player.onAlive(() => {
        //去除显示文案
        this.outLine = false;
        this.isLoading = false;
      });
      //成功建立连接时触发
      this.player.onConnection(() => {
        this.isLoading = true;
      });
    },

    //获取实时视频信息
    getPlayerInfo() {
      api
        .getCamera({
          cameraCode: this.cameraCode
        })
        .then((res) => {
          this.cameraInfo = res || {};
          this.player && this.player.remove();
          this.moreStreamTimer && clearInterval(this.moreStreamTimer);
          this.cameraInfo.rtmp && this.initPlayer(res.rtmp);
          this.moreStream();
          this.moreStreamTimer = setInterval(() => {
            this.moreStream();
          }, 20 * 1000);
        });
    },
    //视频流保持
    moreStream() {
      api
        .heartbeat({
          deviceId: this.cameraCode
        })
        .then(() => { });
    }
  }
};
</script>
<style scoped lang="less">
.video-player-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    color: #595959;
    h3 {
      font-weight: normal;
      font-size: 24px;
      line-height: 60px;
      margin: 0 30px;
    }
    ul {
      li {
        font-size: 15px;
        height: 20px;
        margin: 20px 0;
        padding: 0 10px;
        line-height: 20px;
        border-right: 1px solid #d9d9d9;
      }
      li:last-of-type {
        border: 0;
      }
      display: flex;
    }
  }
  .video-player {
    box-sizing: border-box;
    height: 100%;
    min-height: 100px;
    padding-top: 60px;
    .player-box {
      height: 100%;
      background-color: #000000;
    }
    .out-line {
      position: absolute;
      text-align: center;
      line-height: 50px;
      width: 300px;
      height: 50px;
      z-index: 10;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      color: #ffffff;
      i {
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
}
</style>
