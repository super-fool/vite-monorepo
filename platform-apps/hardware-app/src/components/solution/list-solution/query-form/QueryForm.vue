<template>
  <el-form
    class="query-form"
    label-width="auto"
    size="mini"
    inline
    label-suffix=": "
    :model="queryFormData"
    ><el-form-item
      :key="value.fieldName"
      v-for="value in queryFields"
      :label="value.displayName"
    >
      <el-input
        v-if="value.type === 'String'"
        clearable
        placeholder="请输入"
        v-model="queryFormData[value.fieldName]"
      />
      <el-select
        v-else-if="value.type === 'Boolean'"
        v-model="queryFormData[value.fieldName]"
      >
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-select
        v-else-if="value.type === 'Refer'"
        placeholder="请选择"
        :multiple="value.isMultiSelect"
        @change="selectChange($event,value)"
        v-model="multiData[value.fieldName]"
      >
        <el-option v-if="!value.isMultiSelect" label="全部" :value="null"></el-option>
        <el-option
          v-for="item in dicList[value.refer]"
          :key="item.code"
          :label="item.type"
          :value="item.code"
        ></el-option>
      </el-select>
      <el-date-picker
        v-else-if="value.type === 'RangeDate'"
        v-model="queryFormData[value.fieldName]"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "QueryForm",
  props: {
    queryFields: {
      type: Array,
    },
    queryFormData: {
      type: Object,
    },
  },
  data() {
    return {
      dicList: {},
      multiData:{}
    };
  },
  created() {
    this.dicList = this.$store.getters.dicList;
    console.log(this.queryFormData);
  },
  methods: {
    testChange(value) {
      console.log(value);
    },
    selectChange(val,{isMultiSelect,fieldName}){
      try{
        if(isMultiSelect){
          let selctStr = val.length? val.join(',') : ''
          this.queryFormData[fieldName] = selctStr
        }else{
          this.queryFormData[fieldName] = val
        }
      }catch(err){
        console.log('警告：请检查配置是否有错')
      }
    }
  },
};
</script>

<style lang="less" scoped>
.query-form {
  padding: 24px 24px 6px;
  background-color: #ffffff;
}
</style>