<template>
  <div class="plate-number-container">
    <el-select
      class="province"
      popper-class="province-popper"
      v-model="plateNumberObj.province"
      filterable
      clearable
      placeholder="省"
    >
      <el-option
        class="province-item"
        v-for="({ type = '' }, index) in provinces"
        :key="index"
        :label="type"
        :value="type"
      >
      </el-option>
    </el-select>
    <el-input
      class="five-number"
      v-model="plateNumberObj.numbers"
      placeholder="请输入七位车牌"
      maxlength="7"
      show-word-limit
      @input="onInput"
    />
  </div>
</template>

<script>
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
      plateNumberObj: {
        province: "",
        numbers: "",
      },
    };
  },
  watch: {
    plateNumberObj: {
      handler(newValue) {
        const { province, numbers } = newValue;
        this.$emit("update:plateNumber", province + numbers);
      },
      deep: true,
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const plateChar = this.$store.getters.dicList.PlateChar;
      this.provinces = plateChar;
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

<style lang="less">
.province-popper {
  max-width: 400px;
  max-height: 300px;
  .el-scrollbar__view {
    display: flex;
    background-color: #f6f6f6;
    flex-wrap: wrap;
  }
}
</style>

<style scoped lang="less">
.plate-number-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.province {
  max-width: 70px;
  margin-right: 5px;
}

.province-item {
  background-color: #fff;
  font-size: 16px;
  margin: 3px;
  border: 2px solid #c4c7ce;
  border-radius: 5px;
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

