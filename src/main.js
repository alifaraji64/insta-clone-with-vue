import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import firebase from 'firebase';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
// Your web app's Firebase configuration
var firebaseConfig = {
//YOUR FIREBASE CONFIG
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

router.beforeEach((to, from, next) => {
	//page is restricted
	if (to.meta.requiresAuth) {
		//user is logged in
		if (firebase.auth().currentUser) {
			next();
		}
		//user is not logged in
		else {
			next('/login');
		}
	} else {
		next();
	}
});

let app;

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			router,
			store,
			render: (h) => h(App),
		}).$mount('#app');
	}
});
