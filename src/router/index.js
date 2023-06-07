import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { ROUTER_BASE_URL } from '@/consts'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	base: ROUTER_BASE_URL,
	routes: [
		{
			path: '/',
			name: 'UserLogin',
			component: () => {
				return import(
					/* webpackChunkName: "UserLogin" */
					'../views/User/UserLogin.vue'
				)
			},
			meta: { requiresUnAuth: true, isUser: true },
		},

		{
			path: '/password/forgot',
			name: 'PasswordForgot',
			component: () => {
				return import(
					/* webpackChunkName: "PasswordForgot" */
					'../views/PasswordForgot.vue'
				)
			},
			meta: { requiresUnAuth: true, isUser: true },
		},
		{
			path: '/privacy-policy',
			name: 'UserPrivacyPolicy',
			component: () => {
				return import(
					/* webpackChunkName: "UserPrivacyPolicy" */
					'../views/User/UserPrivacyPolicy.vue'
				)
			},
			meta: { requiresUnAuth: true, isUser: true },
		},
		{
			path: '/admin/login',
			name: 'AdminLogin',
			component: () => {
				return import(
					/* webpackChunkName: "AdminLogin" */
					'../views/Admin/AdminLogin.vue'
				)
			},
			meta: { requiresUnAuth: true, isAdmin: true },
		},

		{
			path: '/user/registration',
			name: 'UserRegistration',
			component: () => {
				return import(
					/* webpackChunkName: "UserRegistration" */
					'../views/User/UserRegistration.vue'
				)
			},
			meta: { requiresUnAuth: true, isUser: true },
		},

		// USER ROUTES #E21818
		{
			path: '/user',
			component: () => import('@/layouts/UserLayout.vue'),
			meta: { requiresAuth: true, isUser: true },
			children: [
				{
					path: 'dashboard',
					name: 'UserDashboard',
					component: () => {
						return import(
							/* webpackChunkName: "UserDashboard" */
							'../views/User/UserDashboard.vue'
						)
					},
				},
				{
					path: 'calculation',
					name: 'UserCalculation',
					component: () => {
						return import(
							/* webpackChunkName: "UserCalculation" */
							'../views/User/UserCalculation.vue'
						)
					},
				},

				{
					path: 'calculation/result',
					name: 'UserCalculationResult',
					component: () => {
						return import(
							/* webpackChunkName: "UserCalculationResult" */
							'../views/User/UserReport.vue'
						)
					},
				},
				{
					path: 'report',
					name: 'UserReport',
					component: () => {
						return import(
							/* webpackChunkName: "UserReport" */
							'../views/User/UserReport.vue'
						)
					},
				},
				{
					path: 'manual',
					name: 'UserManual',
					component: () => {
						return import(
							/* webpackChunkName: "UserManual" */
							'../views/User/UserManual.vue'
						)
					},
				},
				{
					path: 'my-account',
					name: 'UserMyAccount',
					component: () => {
						return import(
							/* webpackChunkName: "UserMyAccount" */
							'../views/User/UserMyAccount.vue'
						)
					},
				},
				// {
				// 	path: 'my-account/individual',
				// 	name: 'UserMyAccountIndividual',
				// 	component: () => {
				// 		return import(
				// 			/* webpackChunkName: "UserMyAccountIndividual" */
				// 			'../views/User/UserMyAccountIndividual.vue'
				// 		)
				// 	},
				// },
			],
		},
		// ADMIN ROUTES #FFDD83
		{
			path: '/admin',
			component: () => import('@/layouts/AdminLayout.vue'),
			meta: { requiresAuth: true, isAdmin: true },
			children: [
				{
					path: 'home',
					name: 'AdminHome',
					component: () => {
						return import(
							/* webpackChunkName: "AdminHome" */
							'../views/Admin/AdminHome.vue'
						)
					},
				},
				{
					path: '/admin/parameters/meeting-room',
					name: 'AdminParametersMeetingRoom',
					component: () => {
						return import(
							/* webpackChunkName: "AdminParametersMeetingRoom" */
							'../views/Admin/AdminParametersMeetingRoom.vue'
						)
					},
				},
				{
					path: '/admin/parameters/transportation',
					name: 'AdminParametersTransportation',
					component: () => {
						return import(
							/* webpackChunkName: "AdminParametersTransportation" */
							'../views/Admin/AdminParametersTransportation.vue'
						)
					},
				},
				{
					path: '/admin/parameters/online-meeting',
					name: 'AdminParametersOnlineMeeting',
					component: () => {
						return import(
							/* webpackChunkName: "AdminParametersOnlineMeeting" */
							'../views/Admin/AdminParametersOnlineMeeting.vue'
						)
					},
				},
				{
					path: '/admin/parameters/others',
					name: 'AdminParametersOthers',
					component: () => {
						return import(
							/* webpackChunkName: "AdminParametersOthers" */
							'../views/Admin/AdminParametersOthers.vue'
						)
					},
				},
				{
					path: '/admin/user-management',
					name: 'AdminUserManagement',
					component: () => {
						return import(
							/* webpackChunkName: "AdminUserManagement" */
							'../views/Admin/AdminUserManagement.vue'
						)
					},
				},

				{
					path: '/admin/user-management/user-calculations',
					name: 'AdminUserManagementUserCalculations',
					component: () => {
						return import(
							/* webpackChunkName: "AdminUserManagementUserCalculations" */
							'../views/Admin/AdminUserManagementUserCalculations.vue'
						)
					},
				},
				{
					path: '/admin/user-management/user-calculations/result',
					name: 'AdminUserManagementUserCalculationsResult',
					component: () => {
						return import(
							/* webpackChunkName: "AdminUserManagementUserCalculationsResult" */
							'../views/Admin/AdminUserManagementUserCalculationsResult.vue'
						)
					},
				},
				{
					path: '/admin/manual-setup',
					name: 'AdminManualSetup',
					component: () => {
						return import(
							/* webpackChunkName: "AdminManualSetup" */
							'../views/Admin/AdminManualSetup.vue'
						)
					},
				},
			],
		},
		{
			path: '/404',
			alias: '*',
			name: 'NotFound',
			component: () => {
				return import(
					/* webpackChunkName: "NotFound" */
					'../views/NotFound.vue'
				)
			},
		},
	],
})

router.beforeEach((to, from, next) => {
	if (
		store.getters.isLoggedIn &&
		to.matched.some((route) => route.meta.requiresAuth)
	) {
		if (
			store.getters.currentUser.isUser &&
			to.matched.some((route) => route.meta.isUser)
		) {
			return next()
		}
		if (
			store.getters.currentUser.isAdmin &&
			to.matched.some((route) => route.meta.isAdmin)
		) {
			return next()
		}
		return next('/404')
	}

	if (
		!store.getters.isLoggedIn &&
		to.matched.some((route) => route.meta.requiresAuth)
	) {
		if (to.matched.some((route) => route.meta.isUser)) {
			return next('/')
		}
		return next('/admin/login')
	}
	console.log('store.getters.isLoggedIn::', store.getters.isLoggedIn)
	if (
		store.getters.isLoggedIn &&
		to.matched.some((route) => route.meta.requiresUnAuth)
	) {
		if (to.matched.some((route) => route.meta.isUser)) {
			return next('/user/dashboard')
		}
		return next('/admin/home')
	}

	return next()
})
export default router
