import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: { requiresAuth: true },
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login.vue'),
	},
	{
		path: '/signup',
		name: 'signup',
		component: () => import('../views/signup.vue'),
	},
	{
		path: '/edit-profile',
		name: 'edit-profile',
		component: () => import('../views/edit-profile.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/add-image',
		name: 'add-image',
		component: () => import('../views/add-image.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/post',
		name: 'single-post',
		component: () => import('../views/single-post.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/posts',
		name: 'all-post',
		component: () => import('../views/all-posts.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/take-image',
		name: 'take-image',
		component: () => import('../views/take-image.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/change-profile-image',
		name: 'change-profile-image',
		component: () => import('../views/change-profile-image.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/images-with-desc',
		name: 'images-with-desc',
		component: () => import('../views/images-with-desc.vue'),
		meta: { requiresAuth: true },
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
