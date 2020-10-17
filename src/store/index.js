import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		firebaseUID: null,
		profileBio: null,
		profileWebsite: null,
		postObj: { url: null, description: null, uid: null, documentId: null },
		profileImageURL: null,
	},
	mutations: {
		setUID(state, uid) {
			state.firebaseUID = uid;
		},
		removeUID(state) {
			state.firebaseUID = null;
		},
		setBio(state, bio) {
			state.profileBio = bio;
		},
		setWebsite(state, link) {
			state.profileWebsite = link;
		},
		addSinglePost(state, obj) {
			state.postObj.url = obj.url;
			state.postObj.description = obj.description;
			state.postObj.uid = obj.uid;
			if (obj.documentId) state.postObj.documentId = obj.documentId;
		},
		clearPostObj(state) {
			state.postObj.url = null;
			state.postObj.description = null;
			state.postObj.uid = null;
			state.postObj.documentId = null;
		},
		setProfileImageURL(state, url) {
			state.profileImageURL = url;
		},
	},
	actions: {},
	modules: {},
});
