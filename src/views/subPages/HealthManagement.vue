<style scoped>

</style>

<template>
  <el-container>
    <el-main>
      <!-- 搜索框 -->
      <div style="margin-top: 0;">
        <label style="font-size: 14px; font-weight: bolder; margin-right: 15px;">健康状况</label>
        <el-select
            v-model="search_conclusion"
            placeholder="选择状况类型"
            style="width: 140px; margin-right: 30px; "
        >
          <el-option
              v-for="item in typeOptions"
              :value="item.value"
              :key="item.value"
              :label="item.label"
          />
        </el-select>
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
        <el-button type="primary" plain icon="Plus"  @click="start_addHealth" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
        <el-button type="success" plain icon="Edit"  @click="start_updateHealth(selectedHealthRecord)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
        <el-button type="danger" plain icon="Delete"  @click="deleteSelectedHealthRecords"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
        <el-button type="warning" plain icon="Download"  @click="exportExcel"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>

      </p>

      <!-- 主要的表格部分 -->
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
            prop="healthId"
            label="编号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="height"
            label="身高（米）"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="weight"
            label="体重(kg)"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="bmi"
            label="身体质量指数"
            width="140"
            style="font-weight: bold;"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="conclusion"
            label="健康状况"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200">
        </el-table-column>
        <!--        <el-table-column label="会议详情" width="120" fixed="right">-->
        <!--          <template #default="scope">-->
        <!--            <el-button  plain icon="View" @click="start_viewConferenceDetails(scope.row)">详情</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="scope">
            <label @click="start_updateHealth(scope.row)"
                   style="font-size: 15px; color: #007bff; margin-left: -10px; margin-right: 30px;" ><el-icon> <Edit /> </el-icon> 修改</label>
            <label @click="deleteSingleHealthRecord(scope.row)"
                   style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog v-model="addHealth_dialogFormVisible" title="添加健康记录" style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="add_healthForm" :rules="add_healthRules">
          <el-form-item label="身高（米）" prop="height" label-width="120px">
            <el-input type="number" v-model="add_healthForm.height" style="width: 300px;" placeholder="请输入身高"  clearable></el-input>
          </el-form-item>
          <el-form-item label="体重（kg）" prop="weight" label-width="120px">
            <el-input type="number" v-model="add_healthForm.weight"  placeholder="请输入体重" style="width: 300px; " clearable   ></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_addHealth" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_addHealth">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改健康记录" v-model="updateHealth_dialogFormVisible"  style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="edit_healthForm" :rules="edit_healthRules">
          <el-form-item label="身高（米）" prop="height" label-width="120px">
            <el-input type="number" v-model="edit_healthForm.height" style="width: 300px;" placeholder="请输入身高"  clearable></el-input>
          </el-form-item>
          <el-form-item label="体重(kg)" prop="weight" label-width="120px">
            <el-input type="number" v-model="edit_healthForm.weight"  placeholder="请输入体重" style="width: 300px; " clearable   ></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_updateHealth" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_updateHealth">取消</el-button>
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
import type {HealthRecord} from "@/util/util";
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
      search_conclusion: "",
      typeOptions: [
        {
          value: "偏瘦",
          label: '偏瘦',
        },
        {
          value: "超重",
          label: '超重',
        },
        {
          value: "正常",
          label: '正常',
        },
      ],
      search_createTime: "",

      healthList: [] as HealthRecord[],
      tableData: [] as HealthRecord[],
      showData: [] as HealthRecord[],

      //实现分页所需数据
      currentPage: 1,
      pageSize: 10,

      multipleSelection: [] as HealthRecord[],//当前多选选中的列表
      selectedHealthRecord: {} as HealthRecord,

      addHealth_dialogFormVisible: false,
      add_healthForm: {
        height: 0,
        weight: 0
      },
      add_healthRules: {
        height: [
          {required: true, message: "请输入身高", trigger: "blur"}
        ],
        weight: [
          {required: true, message: "请输入体重", trigger: "blur"}
        ]
      },
      updateHealth_dialogFormVisible: false,
      edit_healthForm: {
        healthId: 0,
        height: 0,
        weight: 0
      },
      edit_healthRules: {
        height: [
          {required: true, message: "请输入身高", trigger: "blur"}
        ],
        weight: [
          {required: true, message: "请输入体重", trigger: "blur"}
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
          title: "身高",
          key: "height",
          type: "text",
          height: 100,
        },
        {
          title: "体重",
          key: "weight",
          type: "text",
          height: 100,
        },
        {
          title: "BMI",
          key: "bmi",
          type: "text",
          height: 100,
        },
        {
          title: "健康结论",
          key: "conclusion",
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
      table2excel(column, exportData, "健康记录列表");
    },
    start_addHealth() {
      this.addHealth_dialogFormVisible = true;
    },
    cancel_addHealth() {
      this.reset_addForm();
      this.addHealth_dialogFormVisible = false;
    },
    confirm_addHealth() {
      if (this.add_healthForm.height==undefined || this.add_healthForm.height.toString()==""
          || this.add_healthForm.weight==undefined || this.add_healthForm.weight.toString()=="") {
        ElMessage({message: "身高和体重不能为空！", type: "warning"});
        return;
      }
      axios.post("http://localhost:8080/health/add", {
        height: this.add_healthForm.height.toString(),
        weight: this.add_healthForm.weight.toString()
      }).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "添加成功！", type: "success"});
          this.loadHealthRecords();
          this.reset_addForm();
          this.addHealth_dialogFormVisible = false;
          // location.reload();
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    reset_addForm() {
      this.add_healthForm.height = 0;
      this.add_healthForm.weight = 0;
    },
    start_updateHealth(health: HealthRecord) {
      if (health.healthId == undefined) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      // this.selectedHealthRecord = health;
      this.edit_healthForm.healthId = health.healthId;
      this.edit_healthForm.height = health.height;
      this.edit_healthForm.weight = health.weight;

      this.updateHealth_dialogFormVisible = true;
    },
    cancel_updateHealth() {
      this.updateHealth_dialogFormVisible = false;
      location.reload();
    },
    confirm_updateHealth() {
      if (this.edit_healthForm.height==undefined || this.edit_healthForm.height.toString()==""
          || this.edit_healthForm.weight==undefined || this.edit_healthForm.weight.toString()=="") {
        ElMessage({message: "身高和体重不能为空！", type: "warning"});
        return;
      }
      // 这里不用检查是否重名
      axios.post("http://localhost:8080/health/update", {
        healthId: this.edit_healthForm.healthId.toString(),
        height: this.edit_healthForm.height.toString(),
        weight: this.edit_healthForm.weight.toString(),
      }).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "修改成功！", type: "success"});
          this.loadHealthRecords();
          this.updateHealth_dialogFormVisible = false;
          // location.reload();
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    deleteSingleHealthRecord(health: HealthRecord) {
      ElMessageBox.confirm(
          `确认要删除编号为${health.healthId}的健康记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        axios.post("http://localhost:8080/health/deleteById", {
          healthId: health.healthId.toString()
        }).then(res => {
          if (res.data.isOk) {
            this.loadHealthRecords();
            ElMessage({message: "删除成功！", type: "success"});
          }
        });

      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    deleteSelectedHealthRecords() {
      if (this.multipleSelection.length == 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      console.log("将要被删除的healthRecords: ");
      console.log(this.multipleSelection);
      ElMessageBox.confirm(
          `确认要删除所有选中的健康记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: "warning",
          }
      ).then(() => { //确认
        let n = this.multipleSelection.length;
        for (const health of this.multipleSelection) {
          axios.post("http://localhost:8080/health/deleteById", {
            healthId: health.healthId.toString()
          }).then(res => {
            if (res.data.isOk) {
              console.log(`编号为${health.healthId}的收支记录已被删除.`);
              n -= 1;
              //全删除完成后更新会议列表数据，注意下面语句要放到正确的位置
              if (n == 0) {
                this.loadHealthRecords();
                ElMessage({message: "删除成功", type: "success"});
              }
            }
          });
        }
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    search() {
      if (this.search_conclusion !== "") {
        console.log(this.search_conclusion);
        this.tableData = this.healthList.filter((health) => health.conclusion == this.search_conclusion
            && health.createTime.includes(this.search_createTime));
      } else {
        this.tableData = this.healthList.filter((health) => health.createTime.includes(this.search_createTime));
      }
      this.load_showData();
    },
    resetSearch() {
      this.search_conclusion = "";
      this.search_createTime = "";
      this.tableData = this.healthList;
      this.load_showData();
    },
    handleSelectionChange(val: HealthRecord[]) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    handleSelect(selection: HealthRecord[], row: HealthRecord) {
      this.selectedHealthRecord = row;
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
      // this.showData = this.tableData.filter((item, index) => index >= (this.currentPage - 1) * this.pageSize
      //     && index < this.currentPage * this.pageSize);
    },

    loadHealthRecords() {
      axios.get("http://localhost:8080/health/listAll").then(
          res => {
            if (res.data.healthRecordList != null) {
              this.healthList = res.data.healthRecordList;
              // console.log("从后端加载的healthRecordList: ");
              // console.log(this.healthList);
              this.tableData = this.healthList;
              this.load_showData(); //别忘了
            }
          }
      );
    },
    loadData() {
      this.loadHealthRecords();
    },

  }
}
</script>