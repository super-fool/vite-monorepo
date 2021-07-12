<template>
  <el-dialog class="view-dialog"
             title="地图定位"
             :visible.sync="dialogVisible"
             width="980px"
             append-to-body
             :before-close="handleClose">
    <el-row>
      <el-col :span="16">
        <div class="amap-page-container">
          <el-amap-search-box class="search-box"
                              :search-option="searchOption"
                              :on-search-result="onSearchResult"></el-amap-search-box>
          <el-amap vid="amapDemo"
                   :plugin="plugin"
                   :center="mapCenter"
                   :zoom="12"
                   class="amap-demo"
                   :events="events">
            <el-amap-marker v-for="(marker, index) in markers"
                            :key="index"
                            :position="marker"></el-amap-marker>
          </el-amap>
        </div>
      </el-col>
      <el-col :span="8">
        <el-form ref="editForm"
                 label-position="left"
                 :model="form"
                 :rules="rules"
                 label-width="auto">
          <el-form-item label="经度："
                        prop="lng">
            <el-input v-model="form.lng"
                      placeholder="请输入或选择经纬度"></el-input>
          </el-form-item>
          <el-form-item label="维度："
                        prop="lat">
            <el-input v-model="form.lat"
                      placeholder="请输入或选择经纬度"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/parkingLotManage';
export default {
  props: ['point', 'dialogVisible'],
  data() {
    let self = this;
    return {
      markers: [],
      searchOption: {
        city: '全国',
        citylimit: false,
      },
      form: { lng: '', lat: '' },
      mapCenter: [104.080989, 30.657689],
      plugin: [
        {
          pName: 'Geolocation',
          // events: {
          //   init(o) {
          //     // o 是高德地图定位插件实例
          //     o.getCurrentPosition((status, result) => {
          //       if (result && result.position) {
          //         self.mapCenter = [self.lng, self.lat];
          //         self.$nextTick();
          //       }
          //     });
          //   }
          // }
        },
        {
          pName: 'Geocoder',
          events: {
            async init(o) {
              // o 是高德地图定位插件实例
              let areaName;
              await api
                .getData({
                  parkName: '',
                  parkId: self.$store.getters.userParkId,
                  id: '',
                  stcId: '',
                  current: 1,
                  size: 1,
                })
                .then((res) => {
                  areaName = res.records[0].district;
                });
              o.getLocation(areaName, (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                  if (self.point.longitude && self.point.latitude)
                    self.mapCenter = [
                      self.point.longitude,
                      self.point.latitude,
                    ];
                  else
                    self.mapCenter = [
                      result.geocodes[0].location.lng,
                      result.geocodes[0].location.lat,
                    ];
                  self.$nextTick();
                }
              });
            },
          },
        },
      ],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.form.lng = lng;
          self.form.lat = lat;
          self.markers = [];
          self.markers.push([lng, lat]);
        },
      },
      rules: {
        lng: [
          { required: true, message: '请输入或选择经纬度', trigger: 'blur' },
        ],
        lat: [
          { required: true, message: '请输入或选择经纬度', trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    dialogVisible(val) {
      val &&
        this.$nextTick(() => {
          this.form = {
            lng: this.point.longitude,
            lat: this.point.latitude,
          };
          if (this.point.longitude && this.point.latitude) {
            this.mapCenter = [this.point.longitude, this.point.latitude];
            this.markers = [];
            this.markers.push(this.mapCenter);
          }
        });
    },
  },
  mounted() { },
  methods: {
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.mapCenter = [center.lng, center.lat];
      }
    },
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.point.longitude = this.form.lng;
        this.point.latitude = this.form.lat;
        this.$emit('update:dialogVisible', false);
      });
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>
<style scoped lang="less">
.amap-demo {
  height: 500px;
}

.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}

.amap-page-container {
  position: relative;
}
</style>
