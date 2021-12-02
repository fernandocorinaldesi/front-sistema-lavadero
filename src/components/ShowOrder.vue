<template>
  <div class="mb-5">
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :page.sync="page"
      class="elevation-1"
      :items-per-page="5"
      :footer-props="{ itemsPerPageText: 'Items por pagina' }"
    >
      <template template v-slot:[`item.acciones`]="{ item }">
        <div v-if="item.estado === 'pendiente'">
          <v-btn color="primary" x-small @click="iniciarOrden(item.id)"
            >Iniciar</v-btn
          >
        </div>

        <div v-if="item.estado === 'en proceso'">
          <v-btn color="primary" x-small @click="terminarOrden(item.id)"
            >Terminar</v-btn
          >
        </div>

        <div v-if="item.estado === 'para entregar'">
          <div v-if="item.tipo_entrega === 'Entrega a domicilio'">
            <v-btn color="primary" x-small @click="enviarOrden(item.id)"
              >Enviar por delivery</v-btn
            >
          </div>
          <div v-if="item.tipo_entrega === 'Retira del local'">
            <v-btn color="primary" x-small @click="entregarOrden(item.id)"
              >Entregar</v-btn
            >
          </div>
        </div>
        <div v-if="item.estado === 'entregada'">
          <v-icon color="success">mdi-check-circle-outline</v-icon>
        </div>
        <div v-if="item.estado === 'en camino'">
          <v-btn color="primary" x-small @click="entregarOrden(item.id)"
              >Entregar</v-btn
            >
        </div>
      </template>
      <template template v-slot:[`item.operaciones`]="{ item }">
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              class="ma-2"
              x-small
              @click="verOrdenDetalles(item.id)"
              >Detalles</v-btn
            >
            <div
              v-if="
                item.estado === 'pendiente' ||
                item.estado === 'en proceso' ||
                item.estado === 'para entregar'
              "
            >
              <v-btn
                color="error"
                class="ma-2"
                x-small
                @click="deleteItem(item)"
                >Anular</v-btn
              >
              <v-btn
                color="secondary"
                class="ma-2"
                x-small
                @click="editItem(item)"
                >Editar</v-btn
              >
            </div>
            <div v-if="item.estado === 'en camino'">
              <v-btn
                color="error"
                x-small
                class="ma-2"
                @click="cancelarEnvio(item.id)"
                >Cancelar delivery</v-btn
              >

            </div>
            
            <div v-if="item.estado === 'entregada'">
              <v-btn color="success" x-small
                >Imprimir recibo <v-icon x-small>mdi-printer</v-icon></v-btn
              >
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="550px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="3" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.fecha_entrega"
                      type="date"
                      label="Fecha de entrega"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" sm="6" md="4">
                    <v-select
                      v-model="editedItem.tipo_entrega"
                      label="Forma de entrega"
                      :items="formaEntrega"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Aceptar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="busquedaFechaModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Seleccionar rango de fechas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-col cols="5">
                    <v-text-field
                      v-model="fechaDesde"
                      type="date"
                      label="Desde"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="fechaHasta"
                      type="date"
                      label="Hasta"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <span class="text-h6">Busqueda rápida</span>
                <v-row>
                  <v-col cols="3">
                    <v-btn
                      outlined
                      small
                      color="blue darken-1"
                      text
                      @click="hoy()"
                    >
                      Hoy
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">
                    <v-btn
                      outlined
                      color="blue darken-1"
                      text
                      small
                      @click="ultimaSemana()"
                    >
                      Ultima semana
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">
                    <v-btn
                      outlined
                      color="blue darken-1"
                      text
                      small
                      @click="ultimoMes()"
                    >
                      Ultimo mes
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="busquedaFechaModal = false"
              >
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="agregarFechaBusqueda()">
                Aceptar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Realmente quieres anular esta orden de trabajo?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Borrar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDescripcion" max-width="500px">
          <v-form
            ref="formDescripcion"
            v-model="formDescripcion"
            lazy-validation
            scrolleable
            class="mb-6"
          >
            <v-card>
              <v-card-title class="text-h5"
                >Ingresar lugar de almacenado</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-select
                      v-model="letra"
                      :items="letras"
                      label="Letra"
                      :rules="genericRules"
                      required
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="numero"
                      :items="numeros"
                      label="Numero"
                      :rules="genericRules"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogDescripcionClose()"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!formDescripcion"
                  @click="ingresarDescripcionItemConfirm"
                  >Aceptar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="DialogdetalleOrden" max-width="500px">
          <v-card>
            <v-card-title class="text-h6"
              >Detalles de la orden de trabajo</v-card-title
            >
            <v-card-text>
              <h3 class="font-weight-light text-center mb-2">
                Servicios realizados
              </h3>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Nombre del servicio</th>
                      <th class="text-left">Cantidad</th>
                      <th class="text-left">Precio</th>
                      <th class="text-left">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in detallesOrden" :key="item.id">
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td>$ {{ item.precio }}</td>
                      <td>{{ item.tipo }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="DialogdetalleOrden = false"
                >Volver</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <h2 class="font-weight-regular mb-1">Listado de ordenes de trabajo</h2>
        <div class="">
          <h3 class="font-weight-regular text-center mb-1">Consultas</h3>
          <v-row no-gutters justify="space-between" class="ml-2">
            <v-col cols="2">
              <v-text-field
                v-model="idBusqueda"
                label="Por N° de orden"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="dniBusqueda"
                label="Por DNI de cliente"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                label="Por estado"
                v-model="estadoBusqueda"
                :items="estados"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <!-- <v-text-field
                v-model="fechaBusqueda"
                type="date"
                label="Por fecha"
              ></v-text-field> -->
              <v-btn
                color="primary"
                class="mt-5"
                x-small
                outlined
                @click="busquedaFechaModal = true"
              >
                Elegir fecha
              </v-btn>
            </v-col>

            <v-col cols="2">
              <v-btn
                color="primary"
                class="mt-5"
                outlined
                x-small
                @click="descartarBusqueda()"
                >Descartar</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-slot:item.nombre_apellido="{ item }">
        <v-tooltip color="primary" bottom :open-on-hover="false">
          <template v-slot:activator="{ on }">
            <v-icon
              @click="on.click"
              @blur="on.blur"
              retain-focus-on-clicksmall
              class="mr-2"
            >
              mdi-account
            </v-icon>
          </template>
          <v-card max-width="375" class="mx-auto">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-account </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    item.nombre_apellido
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-phone </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.telefono }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-email </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.email }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-map-marker </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.direccion }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ item.provincia }},
                    {{ item.localidad }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tooltip>
        {{ item.nombre_apellido }}
      </template>
    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-row>
        <v-col cols="2" sm="2" md="2">
          <v-btn
            color="primary"
            class="ml-2 mt-3"
            small
            outlined
            @click="openDelivery()"
          >
            Imprimir delivery
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="deliveryDialog" max-width="950px">
      <v-card>
        <v-card-title class="text-h6">Imprimir delivery</v-card-title>
        <v-card-text>
          <v-data-table
            id="print"
            :headers="deliveryHeader"
            :items="filteredItemsDelivery"
            :items-per-page="5"
            class="elevation-1"
            :footer-props="{ itemsPerPageText: 'Items por pagina' }"
          >
            <template v-slot:top>
              <v-row justify="center">
                <v-col cols="5">
                  <v-text-field
                    v-model="desde"
                    type="date"
                    label="Desde"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="hasta"
                    type="date"
                    label="Hasta"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deliveryDialog = false"
            >Volver</v-btn
          >
          <v-btn color="blue darken-1" text @click="print()">Imprimir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    busquedaFechaModal: false,
    formDescripcion: false,
    deliveryDialog: false,
    dniBusqueda: null,
    idBusqueda: null,
    estadoBusqueda: null,
    fechaDesde: null,
    fechaHasta: null,
    fechaBusquedaDesde: null,
    fechaBusquedaHasta: null,
    formaEntrega: ["Entrega a domicilio", "Retira del local"],
    numeros: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    numero: null,
    letra: null,
    letras: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],
    page: 1,
    pageCount: 0,
    estados: [
      "pendiente",
      "en proceso",
      "para entregar",
      "entregada",
      "en camino",
    ],
    itemsPerPage: 3,
    dialog: false,
    dialogDelete: false,
    dialogDescripcion: false,
    descripcion: "",
    //estaEditando:false,
    ordenes: [],
    deliveryHeader: [
      {
        text: "Numero de orden",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre y apellido del cliente", value: "nombre_apellido" },
      { text: "DNI del cliente", value: "dni" },
      { text: "Fecha de entrega", value: "fecha_entrega" },
      { text: "Precio de la orden", value: "precio", icon: "mdi-account" },
      { text: "Monto a cobrar", value: "monto" },
      { text: "Estado de la orden", value: "estado" },
      { text: "Localidad", value: "localidad" },
      { text: "Direccion", value: "direccion" },
      { text: "Telefono", value: "telefono" },
    ],
    editedIndex: -1,
    detallesOrden: [],
    DialogdetalleOrden: false,
    editedItem: {
      descripcion: "",
      fecha_entrega: "",
      tipo_entrega: "",
    },
    defaultItem: {
      descripcion: "",
      fecha_entrega: "",
      tipo_entrega: "",
    },
    genericRules: [(v) => !!v || "Este campo es requerido"],
    hoyBusqueda: null,
    desde: new Date().toISOString().slice(0, 10),
    hasta: new Date().toISOString().slice(0, 10),
    delivery: [],
    lastWeek: null,
    firstWeek: null,
    firstDay: null,
    hoyMes: null,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva orden" : "Editar orden";
    },

    filteredItemsDelivery() {
      let fechaDesde = this.delivery.filter((i) => {
        let busquedaDesde;
        if (this.desde !== null) {
          busquedaDesde = this.desde.split("-");
        }

        const entrega = i.fecha_entrega.split("-");
        return (
          !this.desde ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) >=
            new Date(busquedaDesde[0], busquedaDesde[1] - 1, busquedaDesde[2])
        );
      });

      let fechaHasta = fechaDesde.filter((i) => {
        let busquedaHasta;
        if (this.hasta !== null) {
          busquedaHasta = this.hasta.split("-");
        }
        const entrega = i.fecha_entrega.split("-");

        return (
          !this.hasta ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      return fechaHasta.filter((e) => {
        return (
          e.estado === "en camino"  &&
          e.tipo_entrega === "Entrega a domicilio"
        );
      });
    },

    filteredItems() {
      let numero = this.ordenes.filter((i) => {
        return !this.idBusqueda || i.id === this.idBusqueda;
      });

      let fechaDesde = numero.filter((i) => {
        let busquedaDesde;
        if (this.fechaBusquedaDesde !== null) {
          busquedaDesde = this.fechaBusquedaDesde.split("-");
        }

        const entrega = i.fecha_entrega.split("-");
        return (
          !this.fechaBusquedaDesde ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) >=
            new Date(busquedaDesde[0], busquedaDesde[1] - 1, busquedaDesde[2])
        );
      });

      let fechaHasta = fechaDesde.filter((i) => {
        let busquedaHasta;
        if (this.fechaBusquedaHasta !== null) {
          busquedaHasta = this.fechaBusquedaHasta.split("-");
        }
        const entrega = i.fecha_entrega.split("-");

        return (
          !this.fechaBusquedaHasta ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      let estado = fechaHasta.filter((i) => {
        return !this.estadoBusqueda || i.estado === this.estadoBusqueda;
      });

      let firstWeek = estado.filter((i) => {
        let busquedaHasta;
        if (this.firstWeek !== null) {
          busquedaHasta = this.firstWeek.split("-");
        }
        const entrega = i.fecha_entrega.split("-");

        return (
          !this.firstWeek ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) >=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      let lastWeek = firstWeek.filter((i) => {
        let busquedaHasta;
        if (this.lastWeek !== null) {
          busquedaHasta = this.lastWeek.split("-");
        }
        const entrega = i.fecha_entrega.split("-");

        return (
          !this.lastWeek ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      let hoy = lastWeek.filter((i) => {
        return !this.hoyBusqueda || i.fecha_entrega === this.hoyBusqueda;
      });

      let mes = hoy.filter((i) => {
        let busquedaDesde;
        if (this.firstDay !== null) {
          busquedaDesde = this.firstDay.split("-");
        }

        const entrega = i.fecha_entrega.split("-");
        return (
          !this.firstDay ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) >=
            new Date(busquedaDesde[0], busquedaDesde[1] - 1, busquedaDesde[2])
        );
      });

      let hoymes = mes.filter((i) => {
        let busquedaHasta;
        if (this.hoyMes !== null) {
          busquedaHasta = this.hoyMes.split("-");
        }
        const entrega = i.fecha_entrega.split("-");

        return (
          !this.hoyMes ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      return hoymes.filter((i) => {
        return !this.dniBusqueda || i.dni === this.dniBusqueda;
      });
    },
    headers() {
      return [
        {
          text: "Numero de orden",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Nombre y apellido del cliente", value: "nombre_apellido" },
        { text: "DNI del cliente", value: "dni" },
        { text: "Forma de entrega", value: "tipo_entrega" },
        { text: "Fecha de entrega", value: "fecha_entrega" },
        { text: "Precio de la orden", value: "precio", icon: "mdi-account" },
        { text: "Monto a cobrar", value: "monto" },
        { text: "Estado de la orden", value: "estado" },
        { text: "Ubicación", value: "descripcion" },
        { text: "Acciones", value: "acciones", sortable: false },
        { text: "Operaciones", value: "operaciones", sortable: false },
      ];
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    hoy() {
      this.busquedaFechaModal = false;
      this.hoyBusqueda = new Date().toISOString().slice(0, 10);
      this.filteredItems();
    },
    ultimaSemana() {
      this.busquedaFechaModal = false;
      let today = new Date();
      let firstDayWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
      this.firstWeek = firstDayWeek.toISOString().slice(0, 10);
      this.lastWeek = today.toISOString().slice(0, 10);
      alert(this.lastWeek);
      this.filteredItems();
    },
    ultimoMes() {
      this.busquedaFechaModal = false;
      var date = new Date();
      let day = new Date(date.getFullYear(), date.getMonth(), 1);
      this.firstDay = day.toISOString().slice(0, 10);
      this.hoyMes = new Date().toISOString().slice(0, 10);
      this.filteredItems();
    },
    print() {
      // Pass the element id here
      // Get HTML to print from element
      const prtHtml = document.getElementById("print").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    openDelivery() {
   
      this.deliveryDialog = true;
    },
    actualizar() {
      this.delivery = this.ordenes.filter((e) => {
        return (
          e.fecha_entrega >= this.desde &&
          e.fecha_entrega <= this.hasta &&
          e.estado !== "entregada" &&
          e.tipo_entrega === "Entrega a domicilio"
        );
      });
    },
    agregarFechaBusqueda() {
      this.fechaBusquedaDesde = this.fechaDesde;
      this.fechaBusquedaHasta = this.fechaHasta;
      this.busquedaFechaModal = false;
    },
    descartarBusqueda() {
      this.dniBusqueda = null;
      this.idBusqueda = null;
      this.estadoBusqueda = null;
      this.fechaBusqueda = null;
      this.hoyBusqueda = null;
      this.firstWeek = null;
      this.lastWeek = null;
      this.firstDay = null;
      this.hoyMes = null;
      (this.fechaBusquedaDesde = null),
        (this.fechaBusquedaHasta = null),
        this.getOrden();
    },
    initialize() {
      this.getOrden();
    },
    iniciarOrden(id) {
      const orden = { estado: "en proceso" };
      this.updateOrden(id, orden);
    },
    enviarOrden(id) {
      const orden = { estado: "en camino" };
      this.updateOrden(id, orden);
    },
    cancelarEnvio(id) {
      const orden = { estado: "para entregar" };
      this.updateOrden(id, orden);
    },
    terminarOrden(id) {
      this.descripcionId = id;
      this.dialogDescripcion = true;
    },
    entregarOrden(id) {
      const orden = { estado: "entregada" };
      this.updateOrden(id, orden);
    },
    verOrdenDetalles(id) {
      this.getOrdenDetalles(id);
      this.DialogdetalleOrden = true;
    },
    getOrdenDetalles(id) {
      fetch("http://localhost:3001/orden/detalles/" + id)
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          this.detallesOrden = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOrden() {
      fetch("http://localhost:3001/orden")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          const eleMap = elementos.map((e) => {
            return {
              id: e.orden_id.toString(),
              nombre_apellido: e.cliente_nombre + " " + e.cliente_apellido,
              dni: e.cliente_dni,
              tipo_entrega: e.tipo_entrega,
              fecha_entrega: e.fecha_entrega,
              precio: e.precio,
              monto: e.monto,
              estado: e.estado,
              descripcion: e.descripcion,
              direccion: e.cliente_direccion,
              email: e.cliente_email,
              provincia: e.cliente_provincia,
              localidad: e.cliente_localidad,
              telefono: e.cliente_telefono,
            };
          });
          this.ordenes = eleMap;
          this.delivery = eleMap;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.ordenes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      /*if (this.editedIndex > -1){
        this.estaEditando = true
      } */
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.ordenes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteOrden(this.editedItem);
      this.closeDelete();
    },
    ingresarDescripcionItemConfirm() {
      this.formDescripcion = this.$refs.formDescripcion.validate();
      if (this.formDescripcion) {
        const orden = {
          estado: "para entregar",
          descripcion: this.letra + this.numero,
        };
        this.updateOrden(this.descripcionId, orden);
        this.dialogDescripcionClose();
      }
    },
    dialogDescripcionClose() {
      this.dialogDescripcion = false;
      this.$refs.formDescripcion.reset();
      this.$refs.formDescripcion.resetValidation();
      this.descripcion = null;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        const id = this.ordenes[this.editedIndex].id;
        this.updateOrden(id, this.editedItem);
      } else {
        this.postOrden(this.editedItem);
      }
      this.close();
    },
    async updateOrden(id, orden) {
      try {
        await axios.put("http://localhost:3001/orden/" + id, orden);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
      this.$root.$emit("myEvent");
    },
    async postOrden(orden) {
      try {
        await axios.post("http://localhost:3001/orden", orden);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
    async deleteOrden(orden) {
      try {
        await axios.delete("http://localhost:3001/orden/" + orden.id);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
      this.$root.$emit("myEvent");
    },
  },
};
</script>
