<template>
  <div id="settings-wrapper">
    <v-card
      id="settings"
      class="py-2 px-4"
      dark
      link
      min-width="50"
      style="
        position: fixed;
        top: 700px;
        right: 35px;
        border-radius: 250px 250px 250px 250px;
        background-color: #2196f3;
      "
    >
      <v-icon center> mdi-calendar </v-icon>
    </v-card>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      content-class="v-settings"
      top
      nudge-left="12"
      offset-y
      origin="bottom right"
      transition="scale-transition"
    >
      <vc-calendar :masks="masks" :attributes="attributes"> </vc-calendar>
    </v-menu>
  </div>
</template>

<script>
// Mixins
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
export default {
  name: "DashboardCoreCalendar",

  data: () => ({
    menu: false,
    attributes: [
      {
        popover: {
          label: "TRABAJO PENDIENTE:",
        },

        dates: new Date(2021, 9, 7),
      },
      {
        highlight: {
          color: "red",
          fillMode: "solid",
          contentClass: "italic",
        },

        popover: {
          label: "Valet completo: 50",
        },

        dates: new Date(2021, 9, 7),
      },

      {
        highlight: {
          color: "red",
          fillMode: "solid",
          contentClass: "italic",
        },
        popover: {
          label: "Valet solo secado: 20",
        },
        dates: new Date(year, month, 7),
      },
      {
        highlight: {
          color: "red",
          fillMode: "solid",
          contentClass: "italic",
        },
        popover: {
          label: "Valet solo lavado: 20",
        },
        dates: new Date(year, month, 7),
      },
      {
        highlight: {
          color: "orange",
          fillMode: "solid",
        },
        popover: {
          label: "Valet : 20",
        },
        dates: new Date(year, month, 8),
      },
      {
        highlight: {
          color: "blue",
          fillMode: "solid",
        },
        popover: {
          label: "Valet : 5",
        },
        dates: new Date(year, month, 9),
      },
      {
        key: "today",
        highlight: {
          color: "red",
          fillMode: "solid",
          contentClass: "italic",
        },
        popover: {
          label: "Valet : 50",
        },
        dates: new Date(year, month, 10),
      },
      {
        highlight: {
          color: "orange",
          fillMode: "solid",
        },
        popover: {
          label: "Valet : 20",
        },
        dates: new Date(year, month, 11),
      },
      {
        highlight: {
          color: "blue",
          fillMode: "solid",
        },
        popover: {
          label: "Valet : 5",
        },
        dates: new Date(year, month, 12),
      },
      {
        highlight: {
          color: "blue",
          fillMode: "solid",
        },
        popover: {
          label: "Valet : 11",
        },
        dates: new Date(year, month, 12),
      },
    ],
  }),
  computed: {
    masks() {
      return {};
    },
  },
};
</script>

<style lang="sass">
.v-settings
  .v-item-group > *
    cursor: pointer

    &__item
      border-width: 3px
      border-style: solid
      border-color: transparent !important

      &--active
        border-color: #00cae3 !important
</style>
