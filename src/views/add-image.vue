<template>
  <div class="add-image parent">
    <div class="loading-page" v-if="loading">
      <p :style="{color:color}">your image is uploading please wait</p>
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <header>
      <i class="far fa-hand-point-left" @click="prevPage"></i>
      <p>Add Image</p>
    </header>
    <main>
      <div class="btns">
        <button @click="takeImage">
          <i class="fas fa-camera"></i>Take Image with Camera
        </button>
        <br />
        <br />
        <br />
        <p v-if="error" class="error">
          <strong>{{error}}</strong>
          &nbsp;&nbsp;
          <strong>
            <span @click="removeErr" style="color:black;font-weight:bold">X</span>
          </strong>
        </p>
        <br />
        <input type="text" v-model="description" placeholder="write description" />
        <input type="file" name="image" id="input" @change="inputChange" class="button" />
      </div>
    </main>
    <NavBar />
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
  components: { NavBar, "pulse-loader": PulseLoader },
  data() {
    return {
      url: "",
      loading: false,
      color: "#9787ff",
      size: "50px",
      description: "",
      error: "",
    };
  },
  methods: {
    prevPage() {
      this.$router.go(-1);
    },
    removeErr() {
      this.error = "";
    },
    takeImage() {
      this.$router.push("/take-image");
    },
    inputChange(e) {
      let file = e.target.files[0];
      //we have a valid description so we can carry on
      if (this.description.length) {
        this.loading = true;
        //create a storage ref
        let storageRef = firebase.storage().ref(`photos/${file.name}`);
        //upload the file to storage ref
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
              this.loading = false;
              this.url = url;
              //save this url in image collection
              firebase
                .firestore()
                .collection("posts")
                .add({
                  url: this.url,
                  description: this.description,
                  uid:
                    this.$store.state.firebaseUID ||
                    localStorage.getItem("uid"),
                })
                .then(() => {
                  this.$router.push("/");
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          }
        );
      }
      //description part is empty
      else {
        this.error = "please fill the description part";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/add-image.scss";
</style>