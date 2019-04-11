<template>
  <div class="courseList main">
    <div class="input_box">
      <input v-model="course.name" class="myinput" type="text" placeholder="用户名">
      <input v-model="course.phone" class="myinput" type="text" placeholder="手机号">

      <button v-if="!editAdminObj" class="btn" @click="searchUser()" >
        <i class="fa fa-search" aria-hidden="true"></i>查询
      </button>
      <button v-if="!editAdminObj" class="btn" @click="dialogCouFormVisible = true">
        <i class="fa fa-plus" aria-hidden="true"></i>添加
      </button>
      
      <el-dialog title="新增课程" :visible.sync="dialogCouFormVisible">
        <el-form :model="form">
          <el-form-item label="课程名称" :label-width="formLabelWidth">
            <el-input v-model="form.courseName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.details" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="form.status" placeholder="请选择">
                <el-option label="正常" value="0"/>
                <el-option label="已下架" value="1"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCouFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogCouFormVisible = false,addCourse()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改课程" :visible.sync="dialogUpdFormVisible">
        <el-form :model="updform">
          <el-form-item label="Id" :label-width="formLabelWidth">
            <el-input v-model="updform.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="课程名称" :label-width="formLabelWidth">
            <el-input v-model="updform.courseName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="updform.details" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="updform.status" placeholder="请选择">
                <el-option label="正常" value="0"/>
                <el-option label="已下架" value="1"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogUpdFormVisible = false,saveEditCourse()">确 定</el-button>
        </div>
      </el-dialog>
    </div>  
    <grid :listData="listData" :theadData="theadData" :ifEdit="true" :ifDelete="true" :ifpage="true" :pageInfo="pageInfo" @on-edit="editCourse" @on-delete="deleteAdmin" @on-gopage="gopage"></grid>
  </div>
</template>

<script>
var theadData = [
  {
    title: "Id",
    keyname: "id"
  },
  {
    title: "课程",
    keyname: "courseName"
  },
  {
    title: "内容描述",
    keyname: "details"
  },
  {
    title: "状态",
    keyname: "status"
  },
];
import grid from "./grid.vue";
export default {
  name: "studentList",
  data() {
    return {
      listData: [],
      theadData: theadData,
      dialogCouFormVisible: false,
      dialogUpdFormVisible:false,
      course: {
        courseName: "",
        phone: ""
      },
      form: {
        courseName: '',
        details: '',
        status:'',        
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      updform: {      
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '110px',
      editAdminObj: null, //用于存放正在编辑的用户
      pageInfo: {}
    };
  },
  mounted: function() {
    this.getCourseList(1);
  },
  methods: {
    //显示全部
    getCourseList(page) {
      var _this = this;
      console.log("page======================"+page)
      this.$reqs
        .post("/course/selectAll", {
          page: page
        })
        .then(function(result) {
          //成功
          _this.listData = result.data.data;
          _this.pageInfo.allpage = Math.ceil(result.data.allCount / 5);
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    // //查询方法
    // searchUser(page) {
    //   //search
    //   var _this = this;
    //   console.log("page======================"+page)
    //   if (!this.Admin.name && !this.Admin.phone) {
    //     this.$notify({
    //       title: '警告',
    //       message: '暂未实现搜索功能',//'最少根据一项查找(*^_^*)',
    //       type: 'warning'
    //     });
    //     return false;
    //   }
    //   this.$notify({
    //     title: '警告',
    //     message: '暂未实现搜索功能',
    //     type: 'warning'
    //   });
      // this.$reqs
      //   .post("/course/search", {
      //     page: page,
      //     data: this.Admin
      //   })
      //   .then(function(result) {
      //     //成功
      //     _this.listData = result.data.data;
      //     _this.pageInfo.allpage = Math.ceil(result.data.allCount / 5);
      //   })
      //   .catch(function(error) {
      //     //失败
      //     console.log(error);
      //   });
    // },
    //新增方法
    addCourse() {
      //添加用户
      if (!this.form.courseName || !this.form.details || !this.form.status) {
        this.$notify({
          title: '警告',
          message: '新增失败---信息不能为空',
          type: 'warning'
        });
        return false;
      }
      this.$reqs
        .post("/course/insert", this.form)
        .then(result => {
          //成功
          this.getCourseList(1);
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success'
          });
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    //修改前--编辑
    editCourse(item) {
      this.editAdminObj = item;
      this.dialogUpdFormVisible = true;
      this.updform = JSON.parse(JSON.stringify(item));
    },
    //修改方法
    saveEditCourse() {
        if (!this.updform.courseName || !this.updform.details || !this.updform.status) {
            alert("不能为空");
            return false;
        }
        this.$reqs
        .post("/course/update", this.updform)
        .then(result => {
            console.log("======================"+this.updform)
            //成功
            this.getCourseList(1);
            this.editAdminObj = null;
            this.emptyForm(updform);
            this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
            });
        })
        .catch(function(error) {
            //失败
            console.log(error);
        });
    },
    deleteAdmin(item) {
        this.$reqs
        .post("/course/delete", item)
        .then(result => {
            //成功
            this.getCourseList(1);
            this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
            });
        })
        .catch(function(error) {
            //失败
            console.log(error);
        });
    },
    //清空表单输入框（多次使用，所以封装到这里）
    emptyForm(tbName) {
      this.tbName.courseName = "";
      this.tbName.details = "";
      this.tbName.status = "";
    },
    //分配页码
    gopage(index) {
      this.pageInfo.current = index;
      //查询数据
      this.getCourseList(index);
    }
   },
  components: { grid }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  border-radius: 4px;
  background: #fff;
  margin-top: 10px;
}

.input_box {
  padding: 0 10px;
}
.input_box .myinput {
  width: 25%;
}
</style>