<template>
  <div class="home parent">
    <div class="loading-page" v-if="loading">
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <header>
      <div class="name">
        {{username}}
        <span>
          <i class="fas fa-caret-down"></i>
        </span>
      </div>
      <div>
        <button @click="logout" class="main-button">logout</button>
      </div>
    </header>
    <!-- this part is for image and follower details -->
    <section id="profile-info">
      <div class="image">
        <img @click="toChangePage" :src="profileSrc" alt />
        <i class="fas fa-plus" id="add-profile-image" @click="toChangePage"></i>
      </div>
      <div class="follower-info">
        <div class="posts">
          <span id="posts">{{totalPosts}}</span>
          <br />Posts
        </div>
        <div class="followers">
          <span id="followers">144</span>
          <br />followers
        </div>
        <div class="following">
          <span id="following">99</span>
          <br />following
        </div>
      </div>
    </section>
    <section id="bio">
      <h5 class="name">{{username}}</h5>
      <h4 class="detail">{{bio}}</h4>
      <a :href="`http://`+website" class="link">{{website}}</a>
    </section>
    <section id="buttons">
      <router-link to="/edit-profile">Edit Profile</router-link>
      <router-link to="#">Promotions</router-link>
    </section>
    <section id="images">
      <div v-for="(item,index) in urls" :key="index">
        <img
          :src="item.url"
          alt
          @click="displayPost(item.url,item.description, item.uid, item.documentId)"
        />
      </div>
    </section>
    <NavBar></NavBar>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import firebase from "firebase/app";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import "firebase/auth";
export default {
  name: "Home",
  components: { NavBar, "pulse-loader": PulseLoader },
  data() {
    return {
      loading: true,
      color: "#9787ff",
      size: "50px",
      bio: "",
      website: null,
      username: "",
      urls: [],
      totalPosts: 0,
    };
  },
  computed: {
    profileSrc() {
      return (
        this.$store.state.profileImageURL ||
        localStorage.getItem("profileImageURL")
      );
    },
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("user logged out");
          this.$store.commit("removeUID");
          //remove uid from localstorage
          localStorage.removeItem("uid");
          localStorage.removeItem("profileImageURL ");

          this.$router.push("/login");
        });
    },
    displayPost(url, description, uid, documentId) {
      //add the url and decs of the clicked image to vuex
      this.$store.commit("addSinglePost", {
        url,
        description,
        uid,
        documentId,
      });
      this.$router.push("/post");
    },
    toChangePage() {
      this.$router.push("/change-profile-image");
    },
  },
  async mounted() {
    let uid = this.$store.state.firebaseUID || localStorage.getItem("uid");
    //this array is for pushing the document to it and then retrieve it from array
    let array = [];
    //getting profile detail
    let data = await firebase
      .firestore()
      .collection("profile-detail")
      .where("uid", "==", uid)
      .get();
    data.docs.forEach((item) => {
      array.push(item.data());
    });
    //if we have an object in array
    if (array.length) {
      let arrayOfSingleDoc = JSON.parse(JSON.stringify(array));
      this.bio = arrayOfSingleDoc[0].bio;
      this.website = arrayOfSingleDoc[0].website;
      this.$store.commit("setBio", this.bio);
      this.$store.commit("setWebsite", this.website);
      this.loading = false;
      //console.log(this.bio, this.website);
    } else {
      //if we dont-have any profile-detail
      this.loading = false;
    }
    //retirieve the username
    let username = await firebase
      .firestore()
      .collection("username")
      .where("uid", "==", uid)
      .get();
    if (username.docs[0]) {
      this.username = username.docs[0].data().username;
    }
    //fetching posts(images from posts collection)
    let posts = await firebase
      .firestore()
      .collection("posts")
      .where("uid", "==", uid)
      .get();
    if (posts.docs[0]) {
      posts.docs.forEach((item) => {
        //adding images(url and desc) to urls array
        //item.id is the auto-generated uid for each document in posts
        let objIwithDocId = Object.assign(item.data(), { documentId: item.id });
        this.urls.push(objIwithDocId);
        //updating the posts count
        this.totalPosts++;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/home.scss";
</style>
