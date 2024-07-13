<style scoped>

</style>

<template>
  <el-container>
    <el-main>
      <!-- 搜索框 -->
      <div style="margin-top: 0;">
        <label style="font-size: 14px; font-weight: bolder; margin-right: 15px;">标题</label>
        <el-input placeholder="请输入标题"  type="text" style="width: 150px; font-size: 14px; font-weight: bolder; margin-right: 20px;"
          v-model="search_title"></el-input>
        <label style="font-size: 14px; font-weight: bolder; margin-right: 15px;">创建时间</label>
        <el-date-picker
            v-model="search_createTime"
            value-format="YYYY-MM-DD"
            value-on-clear=""
            placeholder="选择日期"
        >
        </el-date-picker>

        <el-button type="primary" plain icon="Search"  @click="search" style="font-size: 14px; margin-left: 40px;">搜索</el-button>
        <el-button type="info" plain icon="Refresh"  @click="resetSearch" style="font-size: 14px; margin-left: 20px;">重置</el-button>
      </div>

      <!-- 一排按钮 -->
      <p style="margin-top: 20px; margin-bottom: 10px;">
        <el-button type="primary" plain icon="Plus"  @click="start_addDaily" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
        <el-button type="success" plain icon="Edit"  @click="start_updateDaily(selectedDailyRecord)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
        <el-button type="danger" plain icon="Delete"  @click="deleteSelectedDailyRecords"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
        <el-button type="warning" plain icon="Download"  @click="exportExcel"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>

      </p>

      <el-table
          v-bind:data="showData"
          height="550px"
          style="width: 100%; "
          @selection-change="handleSelectionChange"
          @select="handleSelect"
      >
        <el-table-column type="selection"  label="选择">
        </el-table-column>
        <el-table-column
            prop="dailyId"
            label="编号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="content"
            label="内容"
            width="300"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column label="详情" width="120" fixed="right">
          <template #default="scope">
            <el-button  plain icon="View" @click="start_viewDailyDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="190" fixed="right">
          <template #default="scope">
            <label @click="start_updateDaily(scope.row)"
                   style="font-size: 15px; color: #007bff; margin-left: -10px; margin-right: 30px;" ><el-icon> <Edit /> </el-icon> 修改</label>
            <label @click="deleteSingleDailyRecord(scope.row)"
                   style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog v-model="addDaily_dialogFormVisible" title="添加备忘录" style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="add_dailyForm" :rules="add_dailyRules">
          <el-form-item label="标题" prop="title" label-width="120px">
            <el-input type="text" v-model="add_dailyForm.title" style="width: 300px;" placeholder="请输入标题"  clearable></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content" label-width="120px">
            <el-input type="textarea" v-model="add_dailyForm.content" :rows="4" placeholder="请输入内容" style="width: 600px; " clearable></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_addDaily" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_addDaily">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改备忘录" v-model="updateDaily_dialogFormVisible"  style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="edit_dailyForm" :rules="edit_dailyRules">
          <el-form-item label="标题" prop="height" label-width="120px">
            <el-input type="text" v-model="edit_dailyForm.title" style="width: 300px;" placeholder="请输入标题"  clearable></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="weight" label-width="120px">
            <el-input type="textarea" v-model="edit_dailyForm.content" :rows="4" placeholder="请输入内容" style="width: 600px; " clearable ></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_updateDaily" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_updateDaily">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="查看备忘录详情" v-model="viewDetails_dialogVisible"  style="width: 60%; height: 600px; overflow-y: auto;"
                 draggable  overflow >
        <el-card shadow="hover">
          <p style="margin: 40px;">
            <label style="font-size: 18px; font-weight: bolder; margin-right: 15px;">标题：</label>
            <label style="font-size: 18px;">{{selectedDailyRecord.title}}</label>
          </p>
          <p style="margin: 40px;">
            <label style="font-size: 18px; font-weight: bolder; margin-right: 15px;">内容：</label>
            <div style="font-size: 17px; margin-left: 15px; margin-right: 30px; margin-top: 20px"
                 v-html="selectedDailyRecord.content"></div>
          </p>
          <p style="margin: 40px;">
            <label style="font-size: 18px; font-weight: bolder; margin-right: 15px;">创建时间：</label>
            <label style="font-size: 18px;">{{selectedDailyRecord.createTime}}</label>
          </p>
        </el-card>
        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <!--              <el-divider> 底部分割线 </el-divider>-->
        </div>
      </el-dialog>

      <!-- 分页栏 -->
      <el-pagination style="margin-left: 550px; margin-top: 50px;"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :default-page-size="pageSize"
                     @update:page-size="handleSizeChange"
                     @update:current-page="handleCurrentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length"
                     background
      >
      </el-pagination>

    </el-main>
  </el-container>
</template>

<script lang="ts">
import axios from "axios";
import {ElMessage, type TabsPaneContext, ElMessageBox, type UploadRequestOptions} from "element-plus";
import router from "@/router";
import {UserFilled} from "@element-plus/icons-vue";
import type {DailyRecord, HealthRecord} from "@/util/util";
import table2excel from 'js-table2excel';

axios.defaults.withCredentials = true;

export default {
  components: {},

  setup() {

    return {

    }
  },
  mounted() {
    this.loadData();
  },

  data() {
    return {
      search_title: "",
      search_createTime: "",

      dailyList: [] as DailyRecord[],
      tableData: [] as DailyRecord[],
      showData: [] as DailyRecord[],

      //实现分页所需数据
      currentPage: 1,
      pageSize: 10,

      multipleSelection: [] as DailyRecord[],//当前多选选中的列表
      selectedDailyRecord: {} as DailyRecord,

      addDaily_dialogFormVisible: false,
      viewDetails_dialogVisible: false,
      add_dailyForm: {
        title: "",
        content: ""
      },
      add_dailyRules: {
        title: [
          {required: true, message: "请输入标题", trigger: "blur"}
        ],
        content: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ]
      },
      updateDaily_dialogFormVisible: false,
      edit_dailyForm: {
        dailyId: 0,
        title: "",
        content: "",
        createTime: ""
      } as DailyRecord,
      edit_dailyRules: {
        title: [
          {required: true, message: "请输入标题", trigger: "blur"}
        ],
        content: [
          {required: true, message: "请输入内容", trigger: "blur"}
        ]
      },
    }
  },
  methods: {
    exportExcel() {
      const column = [
        {
          title: "编号",
          key: "healthId",
          type: "text",
          height: 100,
        },
        {
          title: "标题",
          key: "title",
          type: "text",
          height: 100,
        },
        {
          title: "内容",
          key: "content",
          type: "text",
          height: 100,
        },
        {
          title: "创建时间",
          key: "createTime",
          type: "text",
          height: 100,
        },
      ];
      const excelData = this.tableData;
      const exportData = JSON.parse(JSON.stringify(excelData));
      table2excel(column, exportData, "备忘录列表");
    },

    start_addDaily() {
      this.addDaily_dialogFormVisible = true;
    },
    cancel_addDaily() {
      this.reset_addForm();
      this.addDaily_dialogFormVisible = false;
    },
    confirm_addDaily() {
      if (this.add_dailyForm.title==undefined || this.add_dailyForm.title==""
          || this.add_dailyForm.content==undefined || this.add_dailyForm.content=="") {
        ElMessage({message: "标题和内容不能为空！", type: "warning"});
        return;
      }
      axios.post("http://localhost:8080/daily/add", {
        title: this.add_dailyForm.title,
        content: this.add_dailyForm.content,
      }).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "添加成功！", type: "success"});
          this.loadDailyRecords();
          this.reset_addForm();
          this.addDaily_dialogFormVisible = false;
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    reset_addForm() {
      this.add_dailyForm.title = "";
      this.add_dailyForm.content = "";
    },
    start_updateDaily(daily: DailyRecord) {
      if (daily.dailyId == undefined) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      this.edit_dailyForm.dailyId = daily.dailyId;
      this.edit_dailyForm.title = daily.title;
      this.edit_dailyForm.content = daily.content;
      this.edit_dailyForm.createTime = daily.createTime;

      this.updateDaily_dialogFormVisible = true;
    },
    cancel_updateDaily() {
      this.updateDaily_dialogFormVisible = false;
      location.reload();
    },
    confirm_updateDaily() {
      if (this.edit_dailyForm.title==undefined || this.edit_dailyForm.title==""
          || this.edit_dailyForm.content==undefined || this.edit_dailyForm.content=="") {
        ElMessage({message: "标题和内容不能为空！", type: "warning"});
        return;
      }
      // 这里不用检查是否重名
      axios.post("http://localhost:8080/daily/update", this.edit_dailyForm).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "修改成功！", type: "success"});
          this.loadDailyRecords();
          this.updateDaily_dialogFormVisible = false;
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    deleteSingleDailyRecord(daily: DailyRecord) {
      ElMessageBox.confirm(
          `确认要删除编号为${daily.dailyId}的备忘录记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        axios.post("http://localhost:8080/daily/deleteById", {
          dailyId: daily.dailyId.toString()
        }).then(res => {
          if (res.data.isOk) {
            this.loadDailyRecords();
            ElMessage({message: "删除成功！", type: "success"});
          }
        });

      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    deleteSelectedDailyRecords() {
      if (this.multipleSelection.length == 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      console.log("将要被删除的healthRecords: ");
      console.log(this.multipleSelection);
      ElMessageBox.confirm(
          `确认要删除所有选中的备忘录记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: "warning",
          }
      ).then(() => { //确认
        let n = this.multipleSelection.length;
        for (const daily of this.multipleSelection) {
          axios.post("http://localhost:8080/daily/deleteById", {
            dailyId: daily.dailyId.toString()
          }).then(res => {
            if (res.data.isOk) {
              console.log(`编号为${daily.dailyId}的备忘录记录已被删除.`);
              n -= 1;
              if (n == 0) {
                this.loadDailyRecords();
                ElMessage({message: "删除成功", type: "success"});
              }
            }
          });
        }
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    start_viewDailyDetails(daily: DailyRecord) {
      this.selectedDailyRecord = daily;
      this.viewDetails_dialogVisible = true;
    },
    search() {
      if (this.search_title !== "") {
        console.log(this.search_title);
        this.tableData = this.dailyList.filter((daily) => daily.title.includes(this.search_title)
            && daily.createTime.includes(this.search_createTime));
      } else {
        this.tableData = this.dailyList.filter((daily) => daily.createTime.includes(this.search_createTime));
      }
      this.load_showData();
    },
    resetSearch() {
      this.search_title = "";
      this.search_createTime = "";
      this.tableData = this.dailyList;
      this.load_showData();
    },
    handleSelectionChange(val: DailyRecord[]) {
      this.multipleSelection = val;
    },
    handleSelect(selection: DailyRecord[], row: DailyRecord) {
      this.selectedDailyRecord = row;
    },
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.load_showData();
    },
    handleCurrentChange(val: number) {
      this.currentPage = val;
      this.load_showData();
    },


    load_showData() {
      let res = [];
      for (let i=(this.currentPage - 1) * this.pageSize; i<this.tableData.length && i<this.currentPage * this.pageSize; i++) {
        res.push(this.tableData[i]);
      }
      this.showData = res;
    },

    loadDailyRecords() {
      axios.get("http://localhost:8080/daily/listAll").then(
          res => {
            if (res.data.dailyRecordList != null) {
              this.dailyList = res.data.dailyRecordList;
              this.tableData = this.dailyList;
              console.log(this.tableData);
              this.load_showData();
            }
          }
      );
    },
    loadData() {
      this.loadDailyRecords();
    },
  }
}
</script>
