<template>
  <div>
    <h2 class="headline mb-3 text-center">Listado de ordenes de trabajo</h2>
    <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Numero de orden</th>
            <th class="text-left">Nombre y apellido del cliente</th>
            <th class="text-left">DNI del cliente</th>
            <th class="text-left">Forma de entrega</th>
            <th class="text-left">Fecha de entrega</th>
            <th class="text-left">Precio</th>
            <th class="text-left">Monto a cobrar</th>
            <th class="text-left">Estado</th>
            <th class="text-left">Acciones</th>
            <th class="text-left">Operaciones disponibles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ordenes" :key="item.id">
            <td>{{ item.orden_id }}</td>
            <td>{{ item.cliente_nombre }} {{ item.cliente_apellido }}</td>
            <td>{{ item.cliente_dni }}</td>
            <td>{{ item.tipo_entrega }}</td>
            <td>{{ item.fecha_entrega }}</td>
            <td>{{ item.precio }}</td>
            <td>{{ item.monto }}</td>
            <td>{{ item.estado }}</td>
            <td>
              <div v-if="item.estado === 'pendiente'">
                <v-btn
                  color="primary"
                  x-small
                  @click="iniciarOrden(item.orden_id)"
                  >Iniciar</v-btn
                >
              </div>
              <div v-if="item.estado === 'en proceso'">
                <v-btn
                  color="primary"
                  x-small
                  @click="terminarOrden(item.orden_id)"
                  >Terminar</v-btn
                >
              </div>
              <div v-if="item.estado === 'para entregar'">
                <v-btn
                  v-if="item.tipo_entrega === 'Entrega a domicilio'"
                  color="primary"
                  x-small
                  @click="enviarOrden(item.orden_id)"
                  >Enviar a domicilio</v-btn
                >
                <v-btn
                  v-if="item.tipo_entrega === 'Retira del local'"
                  color="primary"
                  x-small
                  @click="entregarOrden(item.orden_id)"
                  >Entregar</v-btn
                >
              </div>
              <div v-if="item.estado === 'en camino'">
                <v-btn
                  color="primary"
                  x-small
                  @click="entregarOrden(item.orden_id)"
                  >Entregar</v-btn
                >
              </div>
              <div v-if="item.estado === 'entregada'">
                <v-icon color="success">mdi-check-circle-outline</v-icon>
              </div>
            </td>

            <td>
              <v-row v-if="item.estado === 'pendiente'">
                <v-col cols="12" md="3">
                  <v-btn
                    color="error"
                    x-small
                    @click="borrarOrden(item.orden_id)"
                    >Anular <v-icon x-small>mdi-delete</v-icon></v-btn
                  >
                  <v-dialog
                    :retain-focus="false"
                    v-model="dialogEditarPendiente"
                    width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="cyan"
                        class="mt-2"
                        v-bind="attrs"
                        v-on="on"
                        x-small
                      >
                        Editar <v-icon x-small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 lighten-2">
                        Editar orden
                      </v-card-title>

                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field
                              label="Fecha"
                              color="primary"
                              :value="item.fecha_entrega"
                              disabled
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              label="Ingresar nueva Fecha"
                              type="date"
                              color="primary"
                              v-model="fecha"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          @click="cambiarFecha(item.orden_id)"
                        >
                          Aceptar
                        </v-btn>
                        <v-btn
                          color="danger"
                          @click="dialogEditarPendiente = false"
                        >
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>

              <v-row v-if="item.estado === 'en proceso'">
                <v-col cols="12" md="3">
                  <v-btn
                    color="error"
                    x-small
                    @click="borrarOrden(item.orden_id)"
                    >Anular <v-icon x-small>mdi-delete</v-icon></v-btn
                  >
                  <v-dialog
                    :retain-focus="false"
                    v-model="dialogEditarEnproceso"
                    width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="cyan"
                        class="mt-2"
                        v-bind="attrs"
                        v-on="on"
                        x-small
                      >
                        Editar <v-icon x-small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 lighten-2">
                        Editar orden
                      </v-card-title>

                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field
                              label="Fecha"
                              color="primary"
                              :value="item.fecha_entrega"
                              disabled
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              label="Ingresar nueva Fecha"
                              color="primary"
                              type="date"
                              v-model="fecha"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          @click="cambiarFecha(item.orden_id)"
                        >
                          Aceptar
                        </v-btn>
                        <v-btn
                          color="danger"
                          @click="dialogEditarEnproceso = false"
                        >
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog
                    :retain-focus="false"
                    v-model="dialogIngresar"
                    width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="success"
                        class="mt-2"
                        v-bind="attrs"
                        v-on="on"
                        x-small
                      >
                        Ingresar descripción <v-icon x-small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5 lighten-2">
                        Ingresar descripción
                      </v-card-title>

                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-textarea
                              v-model="descripcion"
                              label="Descripcion"
                              required
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          @click="agregarDescripcion(item.orden_id)"
                        >
                          Ingresar
                        </v-btn>
                        <v-btn color="danger" @click="dialogIngresar = false">
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>

              <div v-if="item.estado === 'para entregar'">
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      >Ver descripcion</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      {{ item.descripcion }}
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              <div v-if="item.estado === 'en camino'">
                <v-btn color="primary" x-small @click="dialogDelivery = true"
                  >Ver delivery<v-icon x-small>mdi-printer</v-icon></v-btn
                >
              </div>

              <div v-if="item.estado === 'entregada'">
                <v-btn color="success" x-small
                  >Imprimir recibo <v-icon x-small>mdi-printer</v-icon></v-btn
                >
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-snackbar v-model="snackbar" top color="primary" :timeout="timeout">
      La orden de trabajo ha sido anulada satisfactoriamente.
    </v-snackbar>
    <v-snackbar v-model="snackbarFecha" top color="primary" :timeout="timeout">
      La fecha de la orden de trabajo ha sido cambiada satisfactoriamente.
    </v-snackbar>
    <v-dialog v-model="dialogDelivery" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Estado del delivery
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col class="pa-12">
              <v-range-slider
                :tick-labels="seasons"
                :value="[0,1]"
                min="0"
                max="3"
                color="success"
                ticks="always"
                tick-size="4"
              >
                <template v-slot:thumb-label="props">
                  <v-icon dark>
                    {{ season(props.value) }}
                  </v-icon>
                </template>
              </v-range-slider>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelivery = false"
            >Volver
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogDelivery: false,
      snackbar: false,
      snackbarFecha: false,
      dialogEditarEnproceso: false,
      dialogEditarPendiente: false,
      timeout: 4000,
      ordenes: [],
      dialogIngresar: false,
      dialogVer: false,
      descripcion: "",
      fecha: new Date().toISOString().slice(0,10) ,
      seasons: [
        "Salio del lavadero",
        "En camino",
        "Llego a destino",
        "Entregado",
      ],
      icons: ["mdi-check-circle-outline", "mdi-check-circle-outline", "mdi-check-circle-outline", "mdi-check-circle-outline"],
    };
  },
  mounted() {
    this.getOrden();
  },
  methods: {
    season(val) {
      return this.icons[val];
    },
    getOrden() {
      fetch("http://localhost:3001/orden")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          elementos.sort((a, b) => a.orden_id - b.orden_id);

          console.log(res);
          this.ordenes = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    update() {
      this.getOrden();
    },

    async updateOrden(id, orden) {
      try {
        await axios.put("http://localhost:3001/orden/" + id, orden);
      } catch (error) {
        console.log(error);
      }
      this.descripcion = null;
      this.fecha = null;
      this.update();
    },
    async borrarOrden(id) {
      try {
        await axios.delete("http://localhost:3001/orden/" + id);
      } catch (error) {
        console.log(error);
      }
      this.update();
      this.snackbar = true;
    },
    agregarDescripcion(id) {
      const orden = { descripcion_almacenado: this.descripcion };
      this.dialogIngresar = false;
      this.updateOrden(id, orden);
    },
    cambiarFecha(id) {
      const orden = { fecha_entrega: this.fecha };
      this.dialogEditarEnproceso = false;
      this.dialogEditarPendiente = false;
      this.updateOrden(id, orden);
      this.snackbarFecha = true;
    },
    iniciarOrden(id) {
      const orden = { estado: "en proceso" };
      this.updateOrden(id, orden);
    },
    terminarOrden(id) {
      const orden = { estado: "para entregar" };
      this.updateOrden(id, orden);
    },
    entregarOrden(id) {
      const orden = { estado: "entregada" };
      this.updateOrden(id, orden);
    },
    enviarOrden(id) {
      const orden = { estado: "en camino" };
      this.updateOrden(id, orden);
    },
    finalizarOrden(id) {
      const orden = { estado: "finalizada" };
      this.updateOrden(id, orden);
    },
  },
};
</script>