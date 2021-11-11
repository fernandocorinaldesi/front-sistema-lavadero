<template>
  <div>
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
        <div class="ml-1" style="background: white">
          <p class="letra">
            <span class="dot mt-1 red"></span> Dia con mucho trabajo
          </p>
          <p class="letra">
            <span class="dot mt-1 orange"></span> Dia con trabajo intermedio
          </p>
          <p class="letra">
            <span class="dot mt-1 green"></span> Dia libre o con poco trabajo
          </p>
        </div>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCoreCalendar",

  data: () => ({
    menu: false,
    attributes: [],
  }),
  computed: {
    masks() {
      return {};
    },
  },
  created() {
    this.initialize();
    this.$root.$on("myEvent", () => {
      // here you need to use the arrow function
      this.attributes = []
      this.initialize();
      
    });
  },
  

  methods: {
    initialize() {
      this.getClientes();
    },

    getClientes() {
      fetch("http://localhost:3001/orden/calendar")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          this.calendarCalculations(elementos);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    calendarCalculations(elementos) {
      elementos.forEach((e) => {
        let parts = e.fecha.split("-");
        let data = {
          popover: {
            label: "TRABAJO PENDIENTE",
          },
          dates: new Date(parts[0], parts[1] - 1, parts[2]),
        };
        this.attributes.push(data);
      });

      elementos.forEach((e) => {
        let color;
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 20) {
          color = "red";
        }
        if (
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas <= 20 &&
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 5
        ) {
          color = "orange";
        }
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas < 6) {
          color = "green";
        }
        let parts = e.fecha.split("-");

        let data = {
          highlight: {
            color: color,
            fillMode: "solid",
            contentClass: "italic",
          },
          popover: {
            label: "Valet secado: " + e.calculos.secado,
          },
          dates: new Date(parts[0], parts[1] - 1, parts[2]),
        };
        this.attributes.push(data);
      });

      elementos.forEach((e) => {
        let color;
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 20) {
          color = "red";
        }
        if (
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas <= 20 &&
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 5
        ) {
          color = "orange";
        }
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas < 6) {
          color = "green";
        }
        let parts = e.fecha.split("-");
        let data = {
          highlight: {
            color: color,
            fillMode: "solid",
            contentClass: "italic",
          },
          popover: {
            label: "Valet lavado: " + e.calculos.lavado,
          },

          dates: new Date(parts[0], parts[1] - 1, parts[2]),
        };
        this.attributes.push(data);
      });

      elementos.forEach((e) => {
        let color;
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 20) {
          color = "red";
        }
        if (
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas <= 20 &&
          e.calculos.secado + e.calculos.lavado + e.calculos.prendas > 5
        ) {
          color = "orange";
        }
        if (e.calculos.secado + e.calculos.lavado + e.calculos.prendas < 6) {
          color = "green";
        }

        let parts = e.fecha.split("-");

        let data = {
          highlight: {
            color: color,
            fillMode: "solid",
            contentClass: "italic",
          },
          popover: {
            label: "Prendas: " + e.calculos.prendas,
          },

          dates: new Date(parts[0], parts[1] - 1, parts[2]),
        };
        this.attributes.push(data);
      });
    },
  },
};
</script>

<style scoped>
.dot {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  display: inline-block;
}
.green {
  background-color: green;
}
.red {
  background-color: red;
}
.orange {
  background-color: orange;
}
.letra {
  font-size: 14px;
}
</style>
