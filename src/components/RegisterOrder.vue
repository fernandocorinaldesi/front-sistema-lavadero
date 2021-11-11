<template>
  <v-container class="mb-5">
    <v-row class="text-center justify-center align-center mt-4 mb-5">
      <v-col cols="10" class="elevation-2">
        <h2 class="headline mb-3">Formulario de ingreso de orden de trabajo</h2>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          scrolleable
          class="mb-6"
        >
          <v-divider class="mb-2" />
          <h3 class="font-weight-light mb-5">Datos del cliente</h3>
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="dniSeleccionado"
                :items="clients"
                :loading="isLoading"
                :search-input.sync="search"
                :rules="clienteRules"
                color="white"
                hide-no-data
                clearable
                hide-selected
                item-text="dni"
                item-value="nombre"
                label="Buscar Cliente"
                placeholder="Ingresa el DNI"
                prepend-icon="mdi-database-search"
                return-object
                required
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="dniSeleccionado">
              <v-expand-transition>
                <v-row>
                  <div v-for="(field, i) in fields" :key="i">
                    <v-col cols="12">
                      <v-text-field
                        :label="field.key"
                        filled
                        disabled
                        :value="field.value"
                      ></v-text-field>
                    </v-col>
                  </div>
                </v-row>
                <!-- <v-list two-line v-if="dniSeleccionado">
                  <v-list-item v-for="(field, i) in fields" :key="i">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="field.value"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="field.key"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list> -->
              </v-expand-transition>
            </v-col>
          </v-row>
          <v-row class="justify-end">
            <div class="mb-4 mr-">
              <v-btn
                :disabled="!dniSeleccionado"
                class="mr-2"
                color="danger"
                @click="dniSeleccionado = null"
              >
                Descartar
                <v-icon right> mdi-close-circle </v-icon>
              </v-btn>
              <v-btn
                to="/clientes/ver"
                :disabled="dniSeleccionado"
                color="success"
              >
                Agregar
                <v-icon right> mdi-account </v-icon>
              </v-btn>
            </div>
          </v-row>

          <v-divider class="mb-2" />
          <h3 class="font-weight-light mb-5">Servicios a agregar</h3>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="select"
                :items="serviciosdb"
                item-text="nombre"
                label="servicios"
                item-value="nombre"
                return-object
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="cantidad"
                :rules="cantidadRules"
                type="number"
                label="Cantidad"
                min="1"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn color="success" class="mr-4" @click="addService">
                Agregar
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-2" />
          <h3 class="font-weight-light mb-5">Servicios agregados</h3>
          <v-row class="text-center justify-center">
            <div v-if="hayServicios">
              <v-simple-table light class="elevation-2 mb-5">
                <thead>
                  <tr>
                    <th class="text-left">Servicio</th>
                    <th class="text-left">Precio</th>
                    <th class="text-left">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in servicios" :key="i">
                    <td>{{ item.nombre }}</td>
                    <td>$ {{ item.precio }}</td>
                    <td>{{ item.cantidad }}</td>
                  </tr>
                </tbody>

                <div class="text-center">
                  <v-dialog v-model="dialogPersonalizado" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        text
                        v-bind="attrs"
                        v-on="on"
                        small
                      >
                        Agregar servicio personalizado
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 grey lighten-2">
                        Agregar servicio personalizado
                      </v-card-title>

                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="personalizadoServicio"
                              :rules="genericRules"
                              :counter="10"
                              label="Nombre del servicio"
                              required
                            ></v-text-field>
                            <v-text-field
                              v-model="personalizadoPrecio"
                              :min="1"
                              prefix="$"
                              type="number"
                              label="Precio"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="addCustomService">
                          Agregar
                        </v-btn>
                        <v-btn
                          color="danger"
                          text
                          @click="dialogPersonalizado = false"
                        >
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-simple-table>
            </div>
          </v-row>

          <v-row class="justify-end">
            <v-col cols="3" md="4">
              <h4 class="mt-5 ml-5 font-weight-medium">Precio total</h4>
            </v-col>

            <v-col cols="4" md="4">
              <v-text-field
                color="success"
                prefix="$"
                v-model="preciototal"
                loading
                disabled
                >{{ preciototal }}</v-text-field
              >
            </v-col>
          </v-row>

          <v-divider class="mb-2" />
          <h3 class="font-weight-light mb-5">Forma de pago y entrega</h3>
          <v-row>
            <v-col cols="3" md="4">
              <v-select
                v-model="tipoPagoModel"
                :items="pagos2"
                :rules="genericRules"
                label="Pago"
                required
              ></v-select>
            </v-col>

            <v-col cols="3" md="4">
              <v-select
                v-model="tipoEntregaModel"
                :items="formaEntrega"
                :rules="genericRules"
                label="Entrega"
                required
              ></v-select>
            </v-col>
            <v-col cols="3" md="4">
              <v-text-field
                type="date"
                :rules="genericRules"
                v-model="fechaEntrega"
                label="Fecha de entrega estimada"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" md="3">
              <v-text-field
                label="Monto"
                color="primary"
                prefix="$"
                v-model="señaMonto"
                :disabled="señaMontoField"
              ></v-text-field>
            </v-col>
   <!--          <v-col cols="3" md="3">
              <v-text-field
                label="Precio delivery"
                color="primary"
                prefix="$"
                v-model="precioDelivery"
                :disabled="deliveryField"
              ></v-text-field>
            </v-col> -->
          </v-row>
          <v-divider class="mb-2" />
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Ingresar
          </v-btn>

          <v-btn color="error" class="mr-4" @click="reset">Descartar</v-btn>

          <!-- <v-btn color="warning" @click="resetValidation">
            Borrar validaciones
          </v-btn> -->
        </v-form>
        <v-snackbar v-model="snackbar" top color="primary" :timeout="timeout">
          La orden de trabajo se registro satisfactoriamente.
        </v-snackbar>
         <v-snackbar v-model="snackbarServiciosVacio" top color="error" :timeout="timeout">
          La lista de servicios no puede estar vacía.
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterOrder",
  data: () => ({
    dialogPersonalizado: false,
    snackbar: false,
    snackbarServiciosVacio : false,
    timeout: 4000,
    clienteNoExiste: false,
    fechaEntrega: new Date().toISOString().slice(0, 10),
    precioDelivery: 0,
    señaMonto: null,
    valid: true,
    name: "",
    dialog: false,
    select: null,
    preciototal: 0,
    //## busqueda ##//
    clientes: [],
    descriptionLimit: 60,
    isLoading: false,
    dniSeleccionado: null,
    personalizadoPrecio: null,
    personalizadoServicio: null,
    tipoPagoModel: null,
    tipoEntregaModel: null,
    search: null,
    //##//
    //##reglas de validacion//
    clienteRules: [(v) => !!v || "Este campo es requerido"],
    genericRules: [(v) => !!v || "Este campo es requerido"],
    cantidadRules: [(v) => v > 0 || "El minimo es 1"],
    email: "",
    emailRules: [
      (v) => !!v || "El E-mail es requerido",
      (v) => /.+@.+\..+/.test(v) || "El E-mail debe ser válido",
    ],

    //##//

    pagos: [{ nombre: "Total" }, { nombre: "Seña" }, { nombre: "En entrega" }],
    pagos2: ["Total", "Seña", "En entrega"],
    formaEntrega: ["Retira del local", "Entrega a domicilio"],
    hayServicios: false,
    cantidad: 1,
    servicios: [],
    checkbox: false,
    serviciosdb: [],
  }),
  mounted() {
    this.getServices();
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.dniSeleccionado === null) {
        this.valid = false;
      }
      if (this.valid) {
        if(this.servicios.length>0){
        this.postOrder();
        this.snackbar = true;
        this.reset();
        }else{
          this.snackbarServiciosVacio = true;
        }
      }
    },
    getServices() {
      fetch("http://localhost:3001/servicios")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          this.serviciosdb = elementos;
          this.select = this.serviciosdb[0]
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async postOrder() {
      try {
        let post = {
          clienteDni: this.dniSeleccionado,
          servicios: this.servicios,
          precio: this.preciototal + parseInt(this.precioDelivery),
          senaMonto: this.señaMonto,
          fecha_entrega: this.fechaEntrega,
          tipo_pago: this.tipoPagoModel,
          estado: "pendiente",
          forma_entrega: this.tipoEntregaModel,
        };

        await axios.post("http://localhost:3001/orden", post);
      } catch (error) {
        console.log(error);
      }
      this.$root.$emit('myEvent');
    },
    addService() {
      // this.$refs.form.validate();
      this.select = {
        id: this.select.id,
        nombre: this.select.nombre,
        precio: this.select.precio,
        cantidad: this.cantidad,
      };
      this.servicios.push(this.select);

      this.preciototal += this.select.precio * this.cantidad;
      this.cantidad = 1;
      this.hayServicios = true;
      if(this.select.nombre === "Delivery"){
        this.formaEntrega = "Entrega a domicilio";
        this.tipoEntregaModel = "Entrega a domicilio";
      }
    },
    addCustomService() {
      let custom = {
        nombre: this.personalizadoServicio,
        precio: this.personalizadoPrecio,
        cantidad: 1,
      };
      this.servicios.push(custom);
      this.preciototal += custom.precio * custom.cantidad;
      this.personalizadoServicio = null;
      this.personalizadoPrecio = null;
      this.dialogPersonalizado = false;
    },
    reset() {
      this.$refs.form.reset();
      this.servicios = [];
      this.hayServicios = false;
      this.precioDelivery = 0;
      this.señaMonto = null;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  computed: {
    señaMontoField() {
      return this.tipoPagoModel !== "Seña"

    },
    deliveryField() {
      return this.tipoEntregaModel !== "Entrega a domicilio" 
    },
    fields() {
      if (!this.dniSeleccionado) return [];
      return Object.keys(this.dniSeleccionado).map((key) => {
        return {
          key,
          value: this.dniSeleccionado[key] || "n/a",
        };
      });
    },
    clients() {
      return this.clientes.map((e) => {
        return {
          nombre: e.nombre + " " + e.apellido,
          dni: e.dni,
          email: e.email,
          telefono: e.telefono,
          direccion: e.direccion,
          localidad: e.localidad,
          privincia: e.provincia
        };
      });
    },
  },
  watch: {
    search() {
      // Items have already been loaded

      if (this.clients.length > 0) return;
      // Items have already been requested

      if (this.isLoading) return;
      this.isLoading = true;

      // Lazily load input items
      fetch("http://localhost:3001/clientes")
        .then((res) => res.json())
        .then((res) => {
          const { total, elementos } = res;
          this.count = total;
          this.clientes = elementos;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
</style>