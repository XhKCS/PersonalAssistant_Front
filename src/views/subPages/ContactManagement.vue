<script setup lang="ts">
import type {Contact} from "@/util/util";
import {onMounted, ref} from "vue";
import Axios from "axios";
import {Refresh, Search} from '@element-plus/icons-vue'
const allContact=ref<Contact[]>([])
const newContact=ref<Contact>({} as Contact)

onMounted(()=>{
  Axios.post("http://localhost:8080/contact/listAll",{},{
    withCredentials:true
  }).then((res :any )=>{
    if(res.status === 200){
      allContact.value=res.data.contactList as Contact[];
    }
    else{

    }
  })
})
</script>

<template>
  <el-container>
    <el-header height="40px" >
      <div style="display:flex">
        <div style="display:inline-flex;white-space:nowrap;">
          <el-text style="width: max-content"> 联系人名称</el-text>
          <el-autocomplete placeholder="请输入联系人名称" style="margin-left: 5%;"
                           :trigger-on-focus="false"
                           value-key="courseName"
          ></el-autocomplete>
        </div>
        <div style="display:inline-flex;white-space:nowrap; margin-left: 1%" >
          <el-text style="width: max-content"> 联系人电话</el-text>
          <el-input placeholder="请输入联系人电话" style="margin-left: 5%; "
          ></el-input>
        </div>
        <div style="margin-left: 1%">
          <el-button type="primary" :icon="Search" bg text  >搜索</el-button>
          <el-button type="info" :icon="Refresh" bg text > 重置</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <p style="margin-top: 20px; margin-bottom: 10px;">
        <el-button type="primary" plain icon="Plus"  class="MomoButton"  >新增</el-button>
        <el-button type="success" plain icon="Edit"  class="MomoButton"  >修改</el-button>
        <el-button type="danger" plain icon="Delete"  class="MomoButton"  >删除</el-button>
        <el-button type="warning" plain icon="Download" class="MomoButton"  >导出</el-button>
      </p>
      <el-table :data="allContact" >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="contactId" label="联系人Id" width="180" />
        <el-table-column prop="contactName" label="联系人名称" width="180" />
        <el-table-column prop="phoneNumber" label="联系人电话" />
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-main>
  </el-container>


</template>

<style scoped>
.MomoButton{
  font-size: 13px; margin: 5px; width: 70px; text-align: center;
}
</style>