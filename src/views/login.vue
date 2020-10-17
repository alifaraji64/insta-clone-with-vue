<template>
  <div class="login parent">
    <main>
      <h2>
        <i class="fab fa-instagram-square"></i> instagram
      </h2>
      <p v-if="error" class="error">
        <strong>{{error}}</strong>
        &nbsp;&nbsp;
        <strong>
          <span @click="removeErr" style="color:black;font-weight:bold">X</span>
        </strong>
      </p>
      <form>
        <input type="email" required v-model="email" placeholder="email" />
        <input type="password" required v-model="password" placeholder="password" />
        <button @click.prevent="login">Log In</button>
      </form>
    </main>
    <div class="navigate">
      <p>you don't have an account?</p>&nbsp;
      <router-link to="/signup">singup</router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$store.commit("setUID", user.user.uid);
          localStorage.setItem("uid", user.user.uid);
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
          if (err.code == "auth/user-not-found") {
            this.error = "this email is not registered";
          } else if (err.code == "auth/wrong-password") {
            this.error = "password is wrong";
          }
        });
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
