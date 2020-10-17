<template>
  <div class="parent take-image" ref="parent">
    <div class="loading-page" v-if="loading">
      <p :style="{color:color}">your image is uploading please wait</p>
      <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    </div>
    <video ref="video" v-show="!taken"></video>
    <canvas ref="canvas" v-show="taken"></canvas>
    <input type="text" placeholder="description" v-model="description" v-if="taken" />
    <div class="buttons">
      <button class="main-button" @click="takeImage" v-if="!taken">Take Photo</button>
      <button class="main-button" @click="again" v-if="taken">try again</button>
      <button class="main-button" @click="postImage" v-if="taken">POST</button>
    </div>
    <NavBar />
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import NavBar from "../components/NavBar";
export default {
  components: { "pulse-loader": PulseLoader, NavBar },
  data() {
    return {
      taken: false,
      imageSrc: null,
      description: "",
      loading: false,
      color: "#9787ff",
      size: "50px",
    };
  },
  mounted() {
    let video = this.$refs.video;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      });
  },
  methods: {
    takeImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let c = canvas.getContext("2d");
      c.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageSrc = canvas.toDataURL("image/png");
      this.$refs.parent.appendChild(canvas);
      video.srcObject = null;
      this.taken = true;
    },
    again() {
      this.taken = false;
      let video = this.$refs.video;
      video.play();
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          video.srcObject = stream;
        });
    },
    postImage() {
      this.loading = true;
      let storageRef = firebase.storage().ref();
      //upload the file to storage ref
      let canvas = this.$refs.canvas;
      canvas.toBlob((blob) => {
        console.log(blob);
        var task = storageRef.child(`photos/${Math.random() * 10}`).put(blob);
        task.on(
          "state_changed",
          () => {
            console.log("in progress");
          },
          (err) => {
            console.log(err);
          },
          () => {
            //uploaded to storage successfuly
            console.log("completed");
            //save the url to firestore
            task.snapshot.ref.getDownloadURL().then((url) => {
              firebase
                .firestore()
                .collection("posts")
                .add({
                  url,
                  description: this.description || "no description",
                  uid:
                    this.$store.state.firebaseUID ||
                    localStorage.getItem("uid"),
                })
                .then(() => {
                  //url added to firestore
                  console.log("url added to firestore");
                  this.loading = false;
                  this.$router.push("/");
                });
            });
          }
        );
      });

      //   task.on(
      //     "state_changed",
      //     function progress() {
      //       //console.log(snapshot);
      //     },
      //     function error(err) {
      //       console.log(err);
      //     },
      //     () => {
      //       task.snapshot.ref.getDownloadURL().then((url) => {
      //         console.log(url);
      //         //save this url in image collection
      //         //   firebase
      //         //     .firestore()
      //         //     .collection("posts")
      //         //     .add({
      //         //       url: this.url,
      //         //       description: this.description,
      //         //       uid:
      //         //         this.$store.state.firebaseUID ||
      //         //         localStorage.getItem("uid"),
      //         //     })
      //         //     .then(() => {
      //         //       this.$router.push("/");
      //         //     })
      //         //     .catch((err) => {
      //         //       console.log(err);
      //         //     });
      //       });
      //     }
      //   );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/take-image.scss";
</style>