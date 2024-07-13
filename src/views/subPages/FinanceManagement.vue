<style scoped>

</style>

<template>
  <el-container>
    <el-main>
      <!-- 搜索框 -->
      <div style="margin-top: 0;">
        <label style="font-size: 14px; font-weight: bolder; margin-right: 15px;">收支类型</label>
        <el-select
            v-model="search_financeType"
            placeholder="选择收支类型"
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
        <el-button type="primary" plain icon="Plus"  @click="start_addFinance" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
        <el-button type="success" plain icon="Edit"  @click="start_updateFinance(selectedFinance)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
        <el-button type="danger" plain icon="Delete"  @click="deleteSelectedFinances"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
        <el-button type="warning" plain icon="Download"  @click="exportExcel"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>

      </p>
      <p style="margin-left: 20px;">
        <label style="font-size: 18px; font-weight: bolder; margin-right: 10px;">当前总收入：</label>
        <label style="font-size: 20px; font-weight: bolder; margin-right: 50px;">{{total_income}} 元</label>
        <label style="font-size: 18px; font-weight: bolder; margin-right: 10px;">总支出：</label>
        <label style="font-size: 20px; font-weight: bolder; margin-right: 50px;">{{total_expense}} 元</label>
        <label style="font-size: 18px; font-weight: bolder; margin-right: 10px; color: orangered">净收入：</label>
        <label style="font-size: 20px; font-weight: bolder; margin-right: 50px; color: orangered">{{total_income - total_expense}} 元</label>
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
            prop="financeId"
            label="编号"
            width="80">
        </el-table-column>
        <el-table-column
            label="收支类型"
            width="100"
        >
          <template #default="scope">
            <el-text v-if="scope.row.financeType==1" type="success" style="font-weight: bold">收入</el-text>
            <el-text v-if="scope.row.financeType==2" type="warning" style="">支出</el-text>
          </template>
        </el-table-column>
        <el-table-column
            prop="amount"
            label="金额（元）"
            width="120"
        style="font-weight: bold;"
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注信息"
            width="300"
        show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="scope">
            <label @click="start_updateFinance(scope.row)"
                   style="font-size: 15px; color: #007bff; margin-left: -10px; margin-right: 30px;" ><el-icon> <Edit /> </el-icon> 修改</label>
            <label @click="deleteSingleFinance(scope.row)"
                   style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog v-model="addFinance_dialogFormVisible" title="添加收支记录" style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="add_financeForm" :rules="add_financeRules">
          <el-form-item label="收支类型" prop="financeType" label-width="120px">
            <el-select
                v-model="add_financeForm.financeType"
                placeholder="选择收支类型"
                clearable
                style="width: 200px; margin-right: 30px; "
            >
              <el-option
                  v-for="item in typeOptions"  :value="item.value" :key="item.value" :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amount" label-width="120px">
            <el-input type="number" v-model="add_financeForm.amount" style="width: 300px;" placeholder="请输入金额"  clearable></el-input>
          </el-form-item>
          <el-form-item label="备注信息" prop="remark" label-width="120px">
            <el-input v-model="add_financeForm.remark"  placeholder="请输入这笔收支的备注信息"
                      clearable  type="textarea" style="width: 450px; " :autosize="{minRows: 3, maxRows: 8}"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_addFinance" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_addFinance">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改收支记录" v-model="updateFinance_dialogFormVisible"  style="width: 60%; height: 550px; overflow-y: auto;"
                 draggable overflow >
        <el-form :model="edit_financeForm" :rules="edit_financeRules">
          <el-form-item label="收支类型" prop="financeType" label-width="120px">
            <el-select
                v-model="edit_financeForm.financeType"
                placeholder="选择收支类型"
                clearable
                style="width: 200px; margin-right: 30px; "
            >
              <el-option
                  v-for="item in typeOptions"  :value="item.value" :key="item.value" :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amount" label-width="120px">
            <el-input type="number" v-model="edit_financeForm.amount" style="width: 300px;" placeholder="请输入金额"  clearable></el-input>
          </el-form-item>
          <el-form-item label="备注信息" prop="remark" label-width="120px">
            <el-input v-model="edit_financeForm.remark"  placeholder="请输入这笔收支的备注信息"
                      clearable  type="textarea" style="width: 450px; " :autosize="{minRows: 3, maxRows: 8}"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_updateFinance" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_updateFinance">取消</el-button>
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
import type {FinanceRecord} from "@/util/util";
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
      search_financeType: "",
      typeOptions: [
        {
          value: 1,
          label: '收入',
        },
        {
          value: 2,
          label: '支出',
        },
      ],
      search_createTime: "",

      financeList: [] as FinanceRecord[],
      tableData: [] as FinanceRecord[],
      showData: [] as FinanceRecord[],
      total_income: 0, //总收入
      total_expense: 0, //总支出
      //实现分页所需数据
      currentPage: 1,
      pageSize: 10,

      multipleSelection: [] as FinanceRecord[],//当前多选选中的列表
      selectedFinance: {} as FinanceRecord,

      addFinance_dialogFormVisible: false,
      add_financeForm: {
        financeType: "",
        amount: 0,
        remark: "",
      },
      add_financeRules: {
        financeType: [
          {required: true, message: "请选择收支类型", trigger: "blur"}
        ],
        amount: [
          {required: true, message: "请输入金额", trigger: "blur"}
        ]
      },
      updateFinance_dialogFormVisible: false,
      edit_financeForm: {
        financeType: "",
        amount: 0,
        remark: "",
      },
      edit_financeRules: {
        financeType: [
          {required: true, message: "请选择收支类型", trigger: "blur"}
        ],
        amount: [
          {required: true, message: "请输入金额", trigger: "blur"}
        ]
      },
    }
  },

  methods: {
    exportExcel() {
      const column = [
        {
          title: "编号",
          key: "financeId",
          type: "text",
          height: 100,
        },
        {
          title: "收支类型",
          key: "financeType",
          type: "text",
          height: 100,
        },
        {
          title: "金额",
          key: "amount",
          type: "text",
          height: 100,
        },
        {
          title: "创建时间",
          key: "createTime",
          type: "text",
          height: 100,
        },
        {
          title: "备注信息",
          key: "remark",
          type: "text",
          height: 100,
        },
      ];
      const excelData = this.tableData;
      const exportData = JSON.parse(JSON.stringify(excelData));
      table2excel(column, exportData, "收支记录列表");
    },
    start_addFinance() {
      this.addFinance_dialogFormVisible = true;
    },
    cancel_addFinance() {
      this.reset_addForm();
      this.addFinance_dialogFormVisible = false;
    },
    confirm_addFinance() {
      if (this.add_financeForm.financeType==undefined || this.add_financeForm.financeType.toString()==""
        || this.add_financeForm.amount==undefined || this.add_financeForm.amount.toString()=="") {
        ElMessage({message: "收支类型和金额不能为空！", type: "warning"});
        return;
      }
      axios.post("http://localhost:8080/finance/add", {
        financeType: this.add_financeForm.financeType.toString(),
        amount: this.add_financeForm.amount.toString(),
        remark: this.add_financeForm.remark,
      }).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "添加成功！", type: "success"});
          this.loadFinances();
          this.reset_addForm();
          this.addFinance_dialogFormVisible = false;
          // location.reload();
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    reset_addForm() {
      this.add_financeForm.financeType = "";
      this.add_financeForm.amount = 0;
      this.add_financeForm.remark = "";
    },
    start_updateFinance(finance: FinanceRecord) {
      if (finance.financeId == undefined) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      this.selectedFinance = finance;
      this.edit_financeForm.financeType = finance.financeType;
      this.edit_financeForm.amount = finance.amount;
      this.edit_financeForm.remark = finance.remark;

      this.updateFinance_dialogFormVisible = true;
    },
    cancel_updateFinance() {
      this.updateFinance_dialogFormVisible = false;
      location.reload();
    },
    confirm_updateFinance() {
      if (this.edit_financeForm.financeType==undefined || this.edit_financeForm.financeType.toString()==""
          || this.edit_financeForm.amount==undefined || this.edit_financeForm.amount.toString()=="") {
        ElMessage({message: "收支类型和金额不能为空！", type: "warning"});
        return;
      }
      // 这里不用检查是否重名
      axios.post("http://localhost:8080/finance/update", {
        financeId: this.selectedFinance.financeId.toString(),
        financeType: this.edit_financeForm.financeType.toString(),
        amount: this.edit_financeForm.amount.toString(),
        remark: this.edit_financeForm.remark,
      }).then(res => {
        if (res.data.isOk) {
          ElMessage({message: "修改成功！", type: "success"});
          this.loadFinances();
          this.updateFinance_dialogFormVisible = false;
          // location.reload();
        }
        else {
          ElMessage({message: res.data.msg, type: "warning"});
        }
      });
    },
    deleteSingleFinance(finance: FinanceRecord) {
      ElMessageBox.confirm(
          `确认要删除编号为${finance.financeId}的收支记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        axios.post("http://localhost:8080/finance/deleteById", {
          financeId: finance.financeId.toString()
        }).then(res => {
          if (res.data.isOk) {
            this.loadFinances();
            ElMessage({message: "删除成功！", type: "success"});
          }
        });

      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    deleteSelectedFinances() {
      if (this.multipleSelection.length == 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      console.log("将要被删除的finances: ");
      console.log(this.multipleSelection);
      ElMessageBox.confirm(
          `确认要删除所有选中的收支记录吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: "warning",
          }
      ).then(() => { //确认
        let n = this.multipleSelection.length;
        for (const finance of this.multipleSelection) {
          axios.post("http://localhost:8080/finance/deleteById", {
            financeId: finance.financeId.toString()
          }).then(res => {
            if (res.data.isOk) {
              console.log(`编号为${finance.financeId}的收支记录已被删除.`);
              n -= 1;
              //全删除完成后更新会议列表数据，注意下面语句要放到正确的位置
              if (n == 0) {
                this.loadFinances();
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
      if (this.search_financeType !== "") {
        // console.log(this.search_financeType);
        this.tableData = this.financeList.filter((finance) => finance.financeType.toString() == this.search_financeType
            && finance.createTime.includes(this.search_createTime));
      } else {
        this.tableData = this.financeList.filter((finance) => finance.createTime.includes(this.search_createTime));
      }
      this.load_showData();
    },
    resetSearch() {
      this.search_financeType = "";
      this.search_createTime = "";
      this.tableData = this.financeList;
      this.load_showData();
    },
    handleSelectionChange(val: FinanceRecord[]) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    handleSelect(selection: FinanceRecord[], row: FinanceRecord) {
      this.selectedFinance = row;
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

    loadFinances() {
      axios.get("http://localhost:8080/finance/listAll").then(
          res => {
            if (res.data.financeRecordList != null) {
              this.financeList = res.data.financeRecordList;
              console.log("从后端加载的financeList: ");
              console.log(this.financeList);
              this.tableData = this.financeList;
              this.load_showData(); //别忘了
              this.calculateBalance();
            }
          }
      );
    },
    calculateBalance() {
      let income = 0, expense = 0;
      for (const finance of this.financeList) {
        if (finance.financeType == 1) {
          income += finance.amount;
        } else if (finance.financeType == 2) {
          expense += finance.amount;
        }
      }
      this.total_income = income;
      this.total_expense = expense;

    },
    loadData() {
      this.loadFinances();
    },

  }
}
</script>