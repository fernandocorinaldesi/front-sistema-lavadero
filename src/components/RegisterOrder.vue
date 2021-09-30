<template>
  <v-container>
    <v-row class="text-center justify-center align-center mt-4 mb-5">
      <v-col cols="6" class="elevation-2">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          scrolleable
          class="mb-5"
        >
          <h2 class="headline mb-3">
            Formulario de ingreso de orden de trabajo
          </h2>
          <v-row>
            <v-col cols="3" md="4">
              <v-text-field
                v-model="firstname"
                :rules="nameRules"
                :counter="10"
                label="Nombre"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="3" md="4">
              <v-text-field
                v-model="lastname"
                :rules="nameRules"
                :counter="10"
                label="Apellido"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="3" md="4">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mb-2" />
          <h2 class="headline mb-3">Servicios a agregar</h2>
          <v-row>
            <v-col cols="3" md="4">
              <v-select
                v-model="select"
                :items="items"
                item-text="nombre"
                label="servicios"
                return-object
              ></v-select>
            </v-col>
            <v-col cols="3" md="4">
              <v-btn color="success" class="mr-4" @click="addService">
                Agregar
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-2" />
          <h2 class="headline mb-5">Servicios agregados</h2>
          <v-row class="text-center justify-center">
            <!-- <v-list>
              <v-list-item-group
                v-model="model"
                active-class="border"
                color="indigo"
              >
                <v-list-item v-for="(item, i) in servicios" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
                      style="white-space: normal"
                      v-text="item.nombre"
                    ></v-list-item-title>
                    <v-list-item-title
                      style="white-space: normal"
                      v-text="item.precio"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list> -->
            <v-simple-table light class="elevation-2 mb-5">
              <thead>
                <tr>
                  <th class="text-left">Servicio</th>
                  <th class="text-left">Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in servicios" :key="i">
                  <td>{{ item.nombre }}</td>
                  <td>$ {{ item.precio }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-row>

          <v-divider class="mb-2" />

          <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="Estas seguro de ingresar esta orden?"
            required
          ></v-checkbox>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Validate
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

          <v-btn color="warning" @click="resetValidation">
            Reset Validation
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import axios from "axios";

export default {
  name: "RegisterOrder",
  data: () => ({
    valid: true,
    name: "",
    select: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    items: [
      {
        nombre: "valet completo",
        precio: 10,
      },
      {
        nombre: "valet sólo lavado",
        precio: 15,
      },
      {
        nombre: "valet sólo secado",
        precio: 17,
      },
      {
        nombre: "valet completo",
        precio: 11,
      },
      {
        nombre: "planchado camisa",
        precio: 50,
      },
      {
        nombre: "planchado sábana",
        precio: 30,
      },
      {
        nombre: "planchado remera",
        precio: 22,
      },
      {
        nombre: "planchado pantalón",
        precio: 21,
      },
      {
        nombre: "planchado pantalón pinzado",
        precio: 70,
      },
      {
        nombre: "planchado chomba",
        precio: 16,
      },
      {
        nombre: "planchado mantel",
        precio: 19,
      },
      {
        nombre: "planchado cortina",
        precio: 14,
      },
      {
        nombre: "tintorería saco",
        precio: 17,
      },
    ],
    checkbox: false,
    servicios: [],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    addService() {
      //this.$refs.form.validate();
      this.servicios.push(this.select);
      this.select = "";
    },
    reset() {
      this.$refs.form.reset();
      this.servicios = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    /*fetchData() {
      try {
        resultado = await axios.get("http://localhost:3001/orden");
        this.data = resultado.elementos;
      } catch (error) {}
      
    },*/
  },
};
</script>

<style>
</style>