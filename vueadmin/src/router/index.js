import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login'
import backIndex from '@/components/backIndex'
import indexContent from '@/components/indexContent'
import adminList from '@/components/adminList'
import studentList from '@/components/studentList'
import courseList from '@/components/courseList'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/backIndex',
      name: 'backIndex',
      component: backIndex,
      children:[
        {
          path: 'indexContent',
          component: indexContent
        },
        {
          path: 'adminList',
          component: adminList
        },{
          path: 'studentList',
          component: studentList
        },{
          path: 'courseList',
          component: courseList
        },{
          path: '*',
          redirect: 'indexContent'
        }
        
      ]
    }
  ]
})
