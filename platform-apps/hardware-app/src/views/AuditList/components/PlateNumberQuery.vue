<template>
  <div class="plate-number-container">
    <el-select
      class="province"
      v-model="plateNumberObj.province"
      filterable
      placeholder="省"
    >
      <el-option
        v-for="(item, index) in provinces"
        :key="index"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <el-select
      class="region"
      v-model="plateNumberObj.region"
      filterable
      placeholder="地区"
    >
      <el-option
        v-for="(item, index) in regions"
        :key="index"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <el-input
      class="five-number"
      v-model="plateNumberObj.numbers"
      placeholder="请输入五位车牌"
      maxlength="5"
      show-word-limit
      @input="onInput"
    />
  </div>
</template>

<script>
const mockProvince =
  "北京（京）,天津（津）,上海（沪）,重庆（渝）,内蒙古自治区（蒙）,维吾尔自治区（新）,西藏自治区（藏）,宁夏回族自治区（宁）,广西壮族自治区（桂）,香港特别行政区（港）,澳门特别行政区（澳）,黑龙江省（黑）,吉林省（吉）,辽宁省（辽）,山西省（晋）,河北省（冀）,青海省（青）,山东省（鲁）,河南省（豫）,江苏省（苏）,安徽省（皖）,浙江省（浙）,福建省（闽）,江西省（赣）,湖南省（湘）,湖北省（鄂）,广东省（粤）,海南省（琼）,甘肃省（甘）,陕西省（陕）,贵州省（黔）,云南省（滇）,四川省（川）".split(
    ","
  );
const mockRegion = "A,B,D,F,S,T,L,Z,X,C,V,B,N,B,N,D,Q,I,E,U,R,W".split(",");
export default {
  name: "PlateNumberQuery",
  props: {
    plateNumber: {
      type: String,
    },
  },
  data() {
    return {
      provinces: [],
      regions: [],
      plateNumberObj: {
        province: "",
        region: "",
        numbers: "",
      },
    };
  },
  watch: {
    plateNumber() {
      const { province, region, numbers } = this.plateNumberObj;
      return province + region + numbers;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.provinces = mockProvince;
      this.regions = mockRegion;
    },
    onInput(value) {
      const reg = /[a-zA-Z]/;
      this.plateNumberObj.numbers = reg.test(value)
        ? value.toString().toUpperCase()
        : value;
    },
  },
};
</script>

<style scoped lang="less">
.plate-number-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.province {
  min-width: 70px;
  margin-right: 8px;
}
.region {
  min-width: 70px;
  margin-right: 8px;
}
.five-number {
  min-width: 155px;
  margin-right: 5px;
}
</style>