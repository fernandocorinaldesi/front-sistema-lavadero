<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
      
          class="my-3"
          contain
          height="50"
        />
      </v-col>

      <v-col class="mb-1">
        <h1 class="display-2 font-weight-bold mb-3">Bienvenido al Sistema Lavadero</h1>

        <p class="subheading font-weight-regular">
          Puede acceder a sus funcionalidades a traves de los siguientes link o bien seleccionarlas a traves del menu lateral
         </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Ordenes de trabajo</h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in ordeneTrabajo"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Consultas</h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in consultas"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Contabilidad</h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in contabilidad"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    ordeneTrabajo: [
      {
        text: "Ingresar",
        href: "https://github.com/vuetifyjs/vuetify-loader",
      },
      {
        text: "Ver ordenes",
        href: "https://github.com/vuetifyjs/vuetify",
      },
      {
        text: "opcion 3",
        href: "https://github.com/vuetifyjs/awesome-vuetify",
      },
    ],
    consultas: [
      {
        text: "Consultar",
        href: "https://vuetifyjs.com",
      },
      {
        text: "opcion 2",
        href: "https://community.vuetifyjs.com",
      },
      {
        text: "opcion 3",
        href: "https://madewithvuejs.com/vuetify",
      },
    ],
    contabilidad: [
      {
        text: "Ingresar al modulo contable",
        href: "https://vuetifyjs.com/components/api-explorer",
      },
      {
        text: "opcion 2",
        href: "https://vuetifyjs.com/getting-started/pre-made-layouts",
      },
      {
        text: "opcion 3",
        href: "https://vuetifyjs.com/getting-started/frequently-asked-questions",
      },
    ],
  }),
};
</script>
