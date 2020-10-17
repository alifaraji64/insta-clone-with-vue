<template>
  <div class="post parent">
    <div class="loading-page" v-if="loading">
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <header>
      <i class="far fa-hand-point-left" @click="prevPage"></i>
    </header>
    <main v-if="url">
      <button @click="deleteImage(url)" v-if="documentId" class="main-button">Delete</button>
      <img :src="url" alt="image" />
      <p>{{description}}</p>
    </main>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
  components: { "pulse-loader": PulseLoader },
  data() {
    return {
      url: null,
      description: null,
      documentId: null,
      loading: false,
    };
  },
  methods: {
    prevPage() {
      this.$router.go(-1);
    },
    deleteImage(url) {
      let first = url.indexOf("%2");
      let last = url.indexOf("?");
      let name = url.slice(first + 3, last);
      // Create a reference to the file to delete from storage
      firebase
        .storage()
        .ref()
        .child(`photos/${name}`)
        .delete()
        .then(() => {
          console.log("deleted from storage");
          console.log(this.documentId);
          //deleting respective doc from posts collection
          firebase
            .firestore()
            .collection("posts")
            .doc(this.documentId)
            .delete()
            .then(() => {
              console.log("deleted from collection");
              // redirect after deleting from document
              this.$router.push("/");
            })
            .catch((err) => {
              console.log("error while deleting from collection" + err);
            });
        })
        .catch((error) => {
          console.log("error while deleting from storage" + error);
        });
    },
  },

  mounted() {
    if (
      this.$store.state.postObj.url &&
      this.$store.state.postObj.description
    ) {
      this.url = this.$store.state.postObj.url;
      this.description = this.$store.state.postObj.description;
      //documentId is set
      if (this.$store.state.postObj.documentId) {
        this.documentId = this.$store.state.postObj.documentId;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/single-post.scss";
</style>