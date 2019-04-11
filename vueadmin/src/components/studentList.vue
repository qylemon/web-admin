<template>
  <div class="studentList main">
    <div class="input_box">
      <input v-model="Stu.name" class="myinput" type="text" placeholder="用户名">
      <input v-model="Stu.phone" class="myinput" type="text" placeholder="手机号">

      <button v-if="!editAdminObj" class="btn" @click="searchUser()" >
        <i class="fa fa-search" aria-hidden="true"></i>查询
      </button>
      <button v-if="!editAdminObj" class="btn" @click="dialogStuFormVisible = true">
        <i class="fa fa-plus" aria-hidden="true"></i>添加
      </button>
      
      <el-dialog title="新增学员" :visible.sync="dialogStuFormVisible">
        <el-form :model="form">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-select v-model="form.gender" placeholder="请选择">
                <el-option label="男" value="0"/>
                <el-option label="女" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="课程" :label-width="formLabelWidth">
            <el-select v-model="form.courseId" placeholder="请选择课程" @focus="searchCou()">
                <el-option v-for="item of courselist" :key="item.courseName" :label="item.courseName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogStuFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogStuFormVisible = false,addStudent()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改学员信息" :visible.sync="dialogUpdFormVisible">
        <el-form :model="updform">
          <el-form-item label="Id" :label-width="formLabelWidth">
            <el-input v-model="updform.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="updform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="updform.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="updform.gender" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="课程" :label-width="formLabelWidth">
            <el-select v-model="updform.courseId" placeholder="请选择课程" @focus="searchCou()">
                <el-option v-for="item of courselist" :key="item.courseName" :label="item.courseName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogUpdFormVisible = false,saveEditStudent()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
    <grid :listData="listData" :theadData="theadData" :ifEdit="true" :ifDelete="true" :ifpage="true" :pageInfo="pageInfo" @on-edit="editStu" @on-delete="deleteStudent" @on-gopage="gopage"></grid>
  </div>
</template>

<script>
var theadData = [
  {
    title: "Id",
    keyname: "id"
  },
  {
    title: "姓名",
    keyname: "name"
  },
  {
    title: "年龄",
    keyname: "age"
  },
  {
    title: "性别",
    keyname: "gender"
  },
  {
    title: "课程",
    keyname: "courseName"
  }
];
import grid from "./grid.vue";
export default {
  name: "studentList",
  data() {
    return {
      listData: [],
      theadData: theadData,
      dialogStuFormVisible: false,
      dialogUpdFormVisible:false,
      courselist: [],
      Stu: {
        //用户信息
        name: "",
        phone: ""
      },
      form: {
        name: '',
        age: '',
        gender: '',      
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
    this.getStudentList(1);
  },
  methods: {
    //显示全部
    getStudentList(page) {
      var _this = this;
      console.log("page======================"+page)
      this.$reqs
        .post("/student/selectAll", {
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
      //   .post("/users/search", {
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
    addStudent() {
      //添加用户
      if (!this.form.name || !this.form.age || !this.form.gender || !this.form.courseId) {
        this.$notify({
          title: '警告',
          message: '新增失败---信息不能为空',
          type: 'warning'
        });
        return false;
      }
      this.$reqs
        .post("/student/insert", this.form)
        .then(result => {
          //成功
          this.getStudentList(1);
          // this.emptyForm(form);
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
    editStu(item) {
      this.editAdminObj = item;
      this.dialogUpdFormVisible = true;
      this.updform = JSON.parse(JSON.stringify(item));
    },
    //修改方法
    saveEditStudent() {
      if (!this.updform.name || !this.updform.age || !this.updform.gender || !this.updform.courseName) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/student/update", this.updform)
        .then(result => {
          //成功
          this.getStudentList(1);
          this.editAdminObj = null;
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
    deleteStudent(item) {
      this.$reqs
        .post("/student/delete", item)
        .then(result => {
          //成功
          this.getStudentList(1);
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
    // emptyForm(tbName) {
    //   this.tbName.name = "";
    //   this.tbName.phone = "";
    //   this.tbName.password = "";
    // },
    //分配页码
    gopage(index) {
      this.pageInfo.current = index;
      //查询数据
      this.getStudentList(index);
    },
    searchCou(){
       var _this = this;
        this.$reqs
        .post("/student/searchCou")
        .then(function(result) {
        //成功
        _this.courselist = result.data.data;
        })
        .catch(function(error) {
        //失败
        console.log(error);
        });
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