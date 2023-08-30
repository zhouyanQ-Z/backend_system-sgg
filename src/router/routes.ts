/* 实现权限分配 */
// 路由常量
export const constRoute =  [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',//命名路由
    meta: { hidde: true,title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    name: 'Layout',//命名路由
    meta: { hidde: false},
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home',
        meta: { title: '首页',hidden: false,icon: 'HomeFilled' },
      }
    ]
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: { title: '数据大屏',hidde: false,icon: 'Monitor' }
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',//命名路由
    meta: { hidde: true,title: '404' }
  },
  
]

// 异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/views/layout/index.vue'),
    name: 'Acl',
    meta: { title: '权限管理',hidde: false,icon: 'Lock' },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理',hidde: false,icon: 'UserFilled' },
      },
      {
        path: '/acl/role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: { title: '角色管理',hidde: false,icon: 'Mic' },
      },
      {
        path: '/acl/permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: { title: '菜单管理',hidde: false,icon: 'Grid' },
      },
    ]
  },
  {
    path: '/product',
    component: () => import('@/views/layout/index.vue'),
    name: 'Product',
    meta: { title: '商品管理',hidde: false,icon: 'Goods' },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: { title: '品牌管理',hidde: false,icon: 'Handbag' },
      },
      {
        path: '/product/attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: { title: '属性管理',hidde: false,icon: 'ChromeFilled' },
      },
      {
        path: '/product/spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: { title: 'SPU管理',hidde: false,icon: 'Orange' },
      },
      {
        path: '/product/sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: { title: 'SKU管理',hidde: false,icon: 'Calendar' },
      },
    ]
  },
]
// 任意路由
export const anyRoute = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: { hidde: true }
  }
]