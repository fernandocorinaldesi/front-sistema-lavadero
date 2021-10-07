<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-calendar/>
    
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('@/components/core/AppBar'),
      DashboardCoreDrawer: () => import('@/components/core/Drawer'),
      DashboardCoreCalendar: () => import('@/components/core/Calendar'),
      DashboardCoreView: () => import('@/components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>