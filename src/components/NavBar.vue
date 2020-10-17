<template>
  <nav>
    <ul>
      <li>
        <router-link to="/images-with-desc" exact>
          <i class="fas fa-home"></i>
        </router-link>
      </li>
      <li>
        <router-link to="/posts" exact>
          <i class="fas fa-search"></i>
        </router-link>
      </li>
      <li>
        <router-link to="/add-image" exact>
          <i class="fas fa-plus-square"></i>
        </router-link>
      </li>
      <li>
        <router-link to="#" exact>
          <i class="far fa-heart"></i>
        </router-link>
      </li>
      <li>
        <router-link to="/" exact>
          <i class="far fa-circle"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../../public/sass/_variables.scss";
@import "../../public/sass/navbar.scss";
</style>