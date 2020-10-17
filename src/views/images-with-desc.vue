<template>
  <div class="images-with-desc parent">
    <div class="loading-page" v-if="loading">
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <main>
      <div v-for="(post,index) in posts" :key="index">
        <img :src="post.url" :alt="post.uid" />
        <p>{{post.description}}</p>
      </div>
    </main>
    <NavBar />
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import NavBar from "../components/NavBar";
import firebase from "firebase/app";
export default {
  components: { NavBar, "pulse-loader": PulseLoader },
  data() {
    return {
      loading: false,
      posts: [],
    };
  },
  mounted() {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((res) => {
        this.loading = false;
        //let uid = this.$store.state.firebaseUID || localStorage.getItem("uid");
        res.docs.forEach((item) => {
          this.posts.push(item.data());
        });
        console.log(this.posts);
      });
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/image-with-desc.scss";
</style>