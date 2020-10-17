<template>
  <div class="login parent">
    <main>
      <h2>
        <i class="fab fa-instagram-square"></i> instagram
        <span style="font-size: 6px">ali faraji</span>
      </h2>
      <p v-if="error" class="error">
        <strong>{{ error }}</strong>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <strong>
          <span @click="removeErr" style="color: black; font-weight: black"
            >X</span
          >
        </strong>
      </p>
      <form>
        <input type="email" required v-model="email" placeholder="email" />
        <input type="text" required v-model="username" placeholder="username" />
        <input
          type="password"
          required
          v-model="password"
          placeholder="password"
        />
        <button @click.prevent="register">Sign Up</button>
      </form>
    </main>
    <div class="navigate">
      <p>you already have an account?</p>
      &nbsp;
      <router-link to="/login">login</router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async register() {
      //check if the username exists in username collection
      let response = await firebase
        .firestore()
        .collection("username")
        .where("username", "==", this.username)
        .get();
      //we have a user with this username in db so we have to show error
      if (response.docs[0]) {
        this.error = "this username is taken please try another one";
      }
      //if this username is not in db(it is valid)
      else {
        //register user
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            let uid = user.user.uid;
            this.$store.commit("setUID", uid);
            //also adding the uid to localstorage if user refreshes the page
            localStorage.setItem("uid", uid);
            this.$router.push("/");
            console.log(this.$store.state.firebaseUID);
            //adding the username and uid to username collection
            firebase
              .firestore()
              .collection("username")
              .doc(uid)
              .set({
                uid: uid,
                username: this.username,
              })
              .then(() => {
                console.log("username added properly");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            if (err.code == "auth/email-already-in-use") {
              this.error = "this email is already registered";
            } else if (err.code == "auth/weak-password") {
              this.error = "password should contain at least 6 characters";
            }
          });
      }
    },
    removeErr() {
      this.error = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/login.scss";
</style>
