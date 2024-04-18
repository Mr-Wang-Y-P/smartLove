import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: ()=>import('../views/HomeView.vue')
    },
    // {
    //   path: '/userInfo/:userNo',
    //   name: 'userInfo',
    //   component: ()=>import('../views/UserInfo.vue')
    // },
    {
      path: '/foods',
      name: 'foods',
      component: ()=>import('../views/Foods.vue')
    },
    {
      path: '/filter',
      name: 'filter',
      component: ()=> import('../views/FilterView.vue')
    },
    {
      path: '/my',
      name: 'my',
      component: ()=> import('../views/MyView.vue')
    },
    {
      path: '/editorUser',
      name: 'editorUser',
      component: ()=> import('../views/EditUserInfo.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: ()=> import('../views/Login.vue')
    },
    {
      path: '/forget',
      name: 'forget',
      component: ()=> import('../views/ForgetPaw.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: ()=> import('../views/Register.vue')
    },
    {
      path: '/message',
      name: 'message',
      component: ()=> import('../views/message/Message.vue')
    },
    {
      path: '/messageChat/:id/:talkNo',
      name: 'messageChat',
      component: ()=> import('../views/message/MessageChat.vue')
    },
    {
      path: '/friend',
      name: 'friend',
      component: ()=> import('../views/Friends.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: ()=> import('../views/History.vue')
    },
    {
      path: '/publish',
      name: 'publish',
      component: ()=> import('../views/PublishAction.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: ()=> import('../views/Help.vue')
    },
    {
      path: '/action',
      name: 'action',
      component: ()=> import('../views/Action.vue'),
      children: [
        {
          path: '',
          name:'action',
          redirect: '/action/like',
        },
        {
          path: '/action/index',
          name: 'actionIndex',
          component: ()=> import('../views/ActionIndex.vue')
        },
        {
          path: '/action/like',
          name: 'actionLike',
          component: ()=> import('../views/ActionLike.vue')
        },
        {
          path: '/action/area',
          name: 'actionArea',
          component: ()=> import('../views/ActionArea.vue')
        }
      ]

    }]
})
router.beforeEach((to, from, next) => {
  const userNo = localStorage.getItem('userNo');
  if (!userNo &&  to.path !== '/register' && to.path !== '/login' && to.path !== '/forget') {
    next('/login');
  } else {
    next();
  }
});
export default router
