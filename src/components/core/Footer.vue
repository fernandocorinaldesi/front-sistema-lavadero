<template>
  <v-footer padless absolute class="mt-5">
    <v-row justify="center" no-gutters>
      <v-col class="primary py-4 mt-5 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} — <strong>Sistema Lavadero</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "DashboardCoreFooter",
  data: () => ({
    links: ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"],
  }),
};
</script>
