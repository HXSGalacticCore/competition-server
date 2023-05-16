import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true			
  },
  {
    path: '/forgetpwd',
    component: () => import('@/views/forgetpwd/index'),
    hidden: true			
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: '首页', icon: 'dashboard', roles: ['admin'] }
        }]
  },
  {
    path: '/Competitionpage',
    component: Layout,
    
    children: [{
          path: 'Competitionpage',
          name: 'Competitionpage',
          component: () => import('@/views/Competitionpage/index'),
          meta: { title: '比赛', icon: 'el-icon-trophy',roles: ['admin'] }
        }]
  },
  {
    path: '/Mygame',
    component: Layout,
    children: [{
          path: 'Mygame',
          name: 'Mygame',
          component: () => import('@/views/Mygame/index'),
          meta: { title: '我的比赛', icon: 'el-icon-s-data',roles: ['admin'] }
        }]
  },
  {
    path: '/Myinfo',
    component: Layout,
    children: [{
          path: 'Myinfo',
          name: 'Myinfo',
          component: () => import('@/views/Myinfo/index'),
          meta: { title: '个人信息', icon: 'el-icon-s-custom',roles: ['admin'] }
        }]
  },
  {
    path: '/StudentHome',
    component: Layout,
    children: [{
          path: 'StudentHome',
          name: 'StudentHome',
          component: () => import('@/views/StudentHome/index'),
          meta: { title: '首页', icon: 'dashboard',roles: ['editor'] }
        }]
  },
  {
    path: '/SCompetitionpage',
    component: Layout,
    children: [{
          path: 'SCompetitionpage',
          name: 'SCompetitionpage',
          component: () => import('@/views/SCompetitionpage/index'),
          meta: { title: '比赛', icon: 'el-icon-trophy',roles: ['editor'] }
        }]
  },
  {
    path: '/SMygame',
    component: Layout,
    children: [{
          path: 'SMygame',
          name: 'SMygame',
          component: () => import('@/views/SMygame/index'),
          meta: { title: '我的比赛', icon: 'el-icon-s-data' ,roles: ['editor']}
        }]
  },
  {
    path: '/Sinfo',
    component: Layout,
    children: [{
          path: 'Sinfo',
          name: 'Sinfo',
          component: () => import('@/views/Sinfo/index'),
          meta: { title: '个人信息', icon: 'el-icon-s-custom' ,roles: ['editor']}
        }]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
