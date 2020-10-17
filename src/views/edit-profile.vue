<template>
  <div class="edit-profile parent">
    <header>
      <i class="far fa-hand-point-left" @click="prevPage"></i>
      <p>edit profile</p>
    </header>
    <main>
      <p v-if="error" class="error">
        <strong>{{error}}</strong>
        &nbsp;&nbsp;
        <strong>
          <span @click="removeErr" style="color:black;font-weight:bold">X</span>
        </strong>
      </p>
      <form>
        <input type="text" :placeholder="[[ bioPh ]]" v-model="bio" />
        <input type="text" :placeholder="[[ websitePh ]]" v-model="website" />
        <button @click.prevent="submit">Submit Changes</button>
      </form>
    </main>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  data() {
    return {
      bio: "",
      website: "",
      bioPh: "write something about yourself",
      websitePh: "www.exmaple.com",
      error: "",
    };
  },
  methods: {
    submit() {
      //link and bio length validation
      if (this.bio.length > 4 && this.website.slice(0, 3) == "www") {
        let uid = this.$store.state.firebaseUID || localStorage.getItem("uid");
        firebase
          .firestore()
          .collection("profile-detail")
          .doc(uid)
          .set({
            uid: uid,
            bio: this.bio,
            website: this.website,
          })
          .then(() => {
            console.log("profile detail added properly");
            this.$router.push("/");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.error =
          "please make sure that your bio is long enough and link is valid";
      }
    },
    removeErr() {
      this.error = "";
    },
    //go to previous page
    prevPage() {
      this.$router.push("/");
    },
  },
  //for retreiving values of inputs from vuex
  created() {
    console.log(this.$store.state.profileBio, this.$store.state.profileWebsite);
    if (this.$store.state.profileBio && this.$store.state.profileWebsite) {
      //setting the bio and link to bioPh and websitePh for display them as placeholder
      this.bioPh = this.$store.state.profileBio;
      this.websitePh = this.$store.state.profileWebsite;
    } else {
      console.log("vuex crashed");
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/edit-profile.scss";
</style>
