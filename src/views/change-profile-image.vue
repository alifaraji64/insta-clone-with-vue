<template>
  <div class="change-profile-image parent">
    <div class="loading-page" v-if="loading">
      <p :style="{color:color}">your image is uploading please wait</p>
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <header>
      <i class="far fa-hand-point-left" @click="prevPage"></i>
      <p>Add Image</p>
    </header>
    <main>
      <h3>select your new profile image</h3>
      <input type="file" name="image" @change="inputChange" class="button" />
    </main>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
  components: { "pulse-loader": PulseLoader },
  data() {
    return {
      loading: false,
      color: "#9787ff",
      size: "50px",
    };
  },
  methods: {
    inputChange(e) {
      this.loading = true;
      let file = e.target.files[0];
      let storageRef = firebase
        .storage()
        .ref(`photos/profile-image:${file.name}`);
      let task = storageRef.put(file);
      task.on(
        "state_changed",
        function progress() {
          //console.log(snapshot);
        },
        function error(err) {
          console.log(err);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            //save this url in image collection
            let uid =
              this.$store.state.firebaseUID || localStorage.getItem("uid");
            firebase
              .firestore()
              .collection("profile-images")
              .doc(uid)
              .set({
                url,
                uid,
              })
              .then(() => {
                //profile image url added to db
                //add the profile-image link to store and localstorage
                this.$store.commit("setProfileImageURL", url);
                localStorage.setItem("profileImageURL", url);
                this.loading = false;
                this.$router.push("/");
              })
              .catch((err) => {
                console.log("changing profile image" + err);
              });
          });
        }
      );
    },
    prevPage() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/change-profile-image.scss";
</style>