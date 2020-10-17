<template>
  <div class="all-posts parent">
    <div class="loading-page" v-if="loading">
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <header>
      <i class="far fa-hand-point-left" @click="prevPage"></i>
    </header>
    <main>
      <img
        :src="post.url"
        alt="post"
        v-for="(post,index) in posts"
        :key="index"
        @click="displayPost(post.url, post.description, post.uid)"
      />
    </main>
    <NavBar />
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import NavBar from "../components/NavBar";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
  components: { "pulse-loader": PulseLoader, NavBar },
  data() {
    return {
      posts: [],
      loading: true,
      color: "#9787ff",
      size: "50px",
    };
  },
  mounted() {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((res) => {
        this.loading = false;
        let uid = this.$store.state.firebaseUID || localStorage.getItem("uid");
        res.docs.forEach((item) => {
          if (item.data().uid !== uid) this.posts.push(item.data());
        });
        console.log(this.posts);
      });
  },
  methods: {
    prevPage() {
      this.$router.go(-1);
    },
    //in this case because we are not going to show our posts so
    // we are not goint to add documentId and show delete button based on it
    displayPost(url, description, uid) {
      this.$store.commit("clearPostObj");
      this.$store.commit("addSinglePost", {
        url,
        description,
        uid,
      });
      this.$router.push("post");
      //console.log(this.$store.state.postObj.documentId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/all-posts.scss";
</style>