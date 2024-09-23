<template>
  <Vueteble :fields="['code', 'description']" :load-on-start="false">
  </Vueteble>
</template>

<script>
import Vueteble from "../../src/index.js";

export default {
  name: "index",
  components: { Vueteble }
};
</script>

<style scoped>

</style>