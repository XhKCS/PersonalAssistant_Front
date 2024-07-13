<script setup lang="ts">
import type {Contact} from "@/util/util";
import {computed, onMounted, ref, watch} from "vue";
import Axios from "axios";
import {ElMessage} from "element-plus";
const allContact=ref<Contact[]>([])
const newContact=ref<Contact>({} as Contact)
const isShow=ref(false)
const addSuccess=ref(false)
const editType=ref(0)
const table=ref()
const canAdd=ref(true)
const canUpdate=ref(false)
const canDelete=ref(false)
const beDeletedList=ref<Contact[]>([] as Contact[])
const nameSearch=ref("")
const numberSearch=ref("")
const contactView=ref<Contact[]>([] as Contact[])

const addContact=()=>{
  editType.value=0;
  isShow.value=true
}
const updateContact=()=>{
  editType.value=1
  isShow.value=true
}

const search=()=>{
  contactView.value = allContact.value.filter(item => {
    return item.contactName.includes(nameSearch.value) && item.phoneNumber.includes(numberSearch.value);
  });
}

const selected=(selection: Contact[])=>{
  beDeletedList.value=selection
  if(selection.length===0){
    canAdd.value=true
    canUpdate.value=false
    canDelete.value=false
  }
  else if(selection.length===1){
    canAdd.value=true
    canUpdate.value=true
    canDelete.value=true
    newContact.value=selection[0];
  }
  else if(selection.length>1){
    canAdd.value=false
    canUpdate.value=false
  }
}
const dialogClosed=()=>{
  table.value.clearSelection()
  newContact.value={} as Contact;
}

const uploadMessage=()=>{
  if(editType.value==0){
    Axios.post("http://localhost:8080/contact/add",newContact.value,{
      withCredentials:true
    }).then(res => {
      if (res.status === 200) {
        if(res.data.isOk){
          ElMessage({
            message:"添加成功",
            type:"success"
          })
          setTimeout(()=>{
            location.reload()
          },1000)

        }
        if(!res.data.isOk){
          ElMessage({
            message:res.data.msg,
            type:"error"
          })
        }
      }
    })
  }
  else if(editType.value==1){
    Axios.post("http://localhost:8080/contact/update",newContact.value,{
      withCredentials:true
    }).then(res => {
      if (res.status === 200) {
        if(res.data.isOk){
          ElMessage({
            message:"修改成功",
            type:"success"
          })
          setTimeout(()=>{
            location.reload()
          },1000)

        }
        if(!res.data.isOk){
          ElMessage({
            message:res.data.msg,
            type:"error"
          })
        }
      }
    })
  }
}

const deleteContact=()=>{
  beDeletedList.value.forEach(e=>{
    Axios.post("http://localhost:8080/contact/deleteById",e,{
      withCredentials:true
    }).then((res)=>{
      if (res.status === 200) {
        if(res.data.isOk){
          ElMessage({
            message:"删除成功",
            type:"success",
            grouping:true
          })
          setTimeout(()=>{
            location.reload()
          },1000)
        }
        else{
          ElMessage({
            message:res.data.msg,
            type:"error",
            grouping:true
          })
        }
      }
    })
  })
}


const judgeType=computed(()=>{
  if(editType.value===0){
    return "新增联系人"
  }
  else if(editType.value===1){
    return "修改联系人"
  }
})
onMounted(()=>{
  Axios.post("http://localhost:8080/contact/listAll",{},{
    withCredentials:true
  }).then((res :any )=>{
    if(res.status === 200){
      allContact.value=res.data.contactList as Contact[];
      contactView.value=res.data.contactList as Contact[];
    }
    else{

    }
  })
})
</script>

<template>
  <el-dialog v-model="isShow" :title=judgeType draggable @close="dialogClosed" >.
    <div style="display: inline-flex" >
      <el-text style="white-space:nowrap;" > 联系人名称</el-text>
      <el-input placeholder="请输入联系人名称" style="margin-left: 2%" v-model="newContact.contactName"  ></el-input>
    </div>
    <div style="display: inline-flex;margin-left: 10%" >
      <el-text style="white-space:nowrap;"> 联系人电话</el-text>
      <el-input placeholder="请输入联系人电话" style="margin-left: 2%" v-model="newContact.phoneNumber"> </el-input>
    </div>
    <div style="display: inline-flex; margin-left: 10%" >
      <el-button @click="uploadMessage"> 确认</el-button>
    </div>
  </el-dialog>
  <el-container>
    <el-header height="40px" >
      <div style="display:flex">
        <div style="display:inline-flex;white-space:nowrap;">
          <el-text style="width: max-content"> 联系人名称</el-text>
          <el-input placeholder="请输入联系人名称" style="margin-left: 5%;" v-model="nameSearch" @input="search"></el-input>
        </div>
        <div style="display:inline-flex;white-space:nowrap; margin-left: 1%"  >
          <el-text style="width: max-content"> 联系人电话</el-text>
          <el-input placeholder="请输入联系人电话" style="margin-left: 5%;" @input="search" v-model="numberSearch"></el-input>
        </div>
      </div>
    </el-header>
    <el-main>
      <p style="margin-top: 20px; margin-bottom: 10px;">
        <el-button type="primary" plain icon="Plus"  class="MomoButton" @click="addContact" :disabled="!canAdd" >新增</el-button>
        <el-button type="success" plain icon="Edit"  class="MomoButton" @click="updateContact" :disabled="!canUpdate" >修改</el-button>
        <el-button type="danger" plain icon="Delete"  class="MomoButton" @click="deleteContact"  >删除</el-button>
      </p>
      <el-table :data="contactView" @selection-change="selected" ref="table" >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="contactId" label="序号" width="180" />
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