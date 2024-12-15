import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import AppDashboard from '../AppDashboard.vue';
import Expenses from '../views/dashboard/Expenses.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import { useAuthStore } from '../store/auth';
import Category from '../views/dashboard/Category.vue';
import Overview from '../views/dashboard/Overview.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: (_to, _from, next) => {
      const store = useAuthStore(); // Panggil di sini
      if (!store.username) {
        next(); // Proceed to the route
      } else {
        next('/dashboard'); // Redirect authenticated users to dashboard
      }
    },
  },
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter: (_to, _from, next) => {
      const store = useAuthStore(); // Panggil di sini
      if (!store.username) {
        next(); // Proceed to the route
      } else {
        next('/dashboard'); // Redirect authenticated users to dashboard
      }
    },
  },
  {
    path: '/dashboard',
    component: AppDashboard,
    beforeEnter: (_to, _from, next) => {
      const store = useAuthStore(); // Panggil di sini
      if (store.username) {
        next(); // User is authenticated, allow access to the route
      } else {
        next('/'); // Redirect to the login page if the user is not authenticated
      }
    },
    children: [
      {
        path: '',
        name: 'Overview',
        component: Overview,
      },
      {
        path: 'expense/',
        name: 'Expense',
        component: Expenses,
      },
      {
        path: 'category/',
        name: 'Category',
        component: Category,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
