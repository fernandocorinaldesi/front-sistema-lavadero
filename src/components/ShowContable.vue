<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      sort-desc="fecha"
      :page.sync="page"
      :items-per-page="5"
      class="elevation-1"
      :footer-props="{ itemsPerPageText: 'Items por pagina' }"
    >
    
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Módulo Contable</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div>
          <h3 class="font-weight-regular text-center mb-1">Consultas</h3>
          <v-row no-gutters class="ml-2" justify="center">
            <v-col cols="2">
              <v-select
                v-model="tipoBusqueda"
                :items="tipos"
                label="Por tipo de operación"
                class="mr-2"
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
                class="ml-2 mt-5"
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
      <template v-slot:footer>
        <v-divider class="mx-4" inset></v-divider>
        <v-btn color="primary" text class="mb-4 mt-5 " @click="verBalance()">
          Ver balance mensual
        </v-btn>
        <v-text-field
          v-model="total"
          type="number"
          prefix="$"
          label="Total"
          class="mt-2 mr-3"
          outlined
          style="float:right;"
        ></v-text-field>
      </template>
      <template template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" class="ma-2" x-small @click="verDetalles(item)"
          >Detalles</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog v-model="dialogOrdenesDetalle" max-width="650px">
      <v-card>
        <v-card-title class="text-h6">Detalles</v-card-title>
        <v-card-text>
          <h3 class="font-weight-light text-center mb-2">
            Ordenes de trabajo del día elegido
          </h3>
          <v-data-table
            :headers="headersOrdenDetalle"
            :items="ordenesDetalleDay"
            :items-per-page="5"
            :footer-props="{ itemsPerPageText: 'Items por pagina' }"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogOrdenesDetalle = false"
            >Volver</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogComprasDetalle" max-width="650px">
      <v-card>
        <v-card-title class="text-h6">Detalles</v-card-title>
        <v-card-text>
          <h3 class="font-weight-light text-center mb-2">
            Compras del día elegido
          </h3>
          <v-data-table
            :headers="headersCompraDetalle"
            :items="comprasDetalleDay"
            :items-per-page="5"
            class="elevation-1"
            :footer-props="{ itemsPerPageText: 'Items por pagina' }"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogComprasDetalle = false"
            >Volver</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogBalance" max-width="650px">
      <v-card>
        <v-card-title class="text-h6">Balance Mensual</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headersBalance"
            :items="balance"
            :items-per-page="5"
            class="elevation-1"
            :footer-props="{ itemsPerPageText: 'Items por pagina' }"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogBalance = false"
            >Volver</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="busquedaFechaModal" max-width="550px">
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
                    <v-btn outlined small color="blue darken-1" text @click="hoy()">
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
                      Última semana
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
                      Último mes
                    </v-btn>
                  </v-col>
                </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="busquedaFechaModal = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="agregarFechaBusqueda()">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    busquedaFechaModal: false,
    fechaDesde: null,
    fechaHasta: null,
    fechaBusquedaDesde: null,
    fechaBusquedaHasta: null,
    tipoBusqueda: null,
    hoyBusqueda: null,
    lastWeek: null,
    firstWeek: null,
    firstDay: null,
    hoyMes: null,
    total: 0,
    tipos: ["Ordenes de trabajo", "Compras"],
    headers: [
      { text: "Tipo de operación", value: "tipo" },
      { text: "Fecha", value: "fecha" },
      { text: "Monto", value: "total" },
      { text: "Operaciones", value: "actions", sortable: false },
    ],
    headersOrdenDetalle: [
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
    ],
    headersCompraDetalle: [
      {
        text: "Numero de compra",
        align: "start",
        sortable: false,
        value: "compra_id",
      },
      { text: "Insumo", value: "producto_nombre" },
      { text: "Marca", value: "marca" },
      { text: "Precio", value: "precio" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Proveedor", value: "proveedor" },
    ],
    headersBalance: [
      { text: "Descripcion", value: "descripcion" },
      { text: "Total", value: "total" },
    ],
    comprasDay: [],
    ordenesDay: [],
    balance: [],
    ordenesDetalleDay: [],
    comprasDetalleDay: [],
    all: [],
    dialogOrdenesDetalle: false,
    dialogComprasDetalle: false,
    dialogBalance: false,
  }),
  created() {
    this.initialize();
  },
  computed: {
    filteredItems() {
      let tipo = this.all.filter((i) => {
        return !this.tipoBusqueda || i.tipo === this.tipoBusqueda;
      });

      let fechaDesde = tipo.filter((i) => {
        let busquedaDesde;
        if (this.fechaBusquedaDesde !== null) {
          busquedaDesde = this.fechaBusquedaDesde.split("-");
        }

        const entrega = i.fecha.split("-");
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
        const entrega = i.fecha.split("-");
        return (
          !this.fechaBusquedaHasta ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });
       let firstWeek = fechaHasta.filter((i) => {
        let busquedaHasta;
        if (this.firstWeek !== null) {
          busquedaHasta = this.firstWeek.split("-");
        }
        const entrega = i.fecha.split("-");

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
        const entrega = i.fecha.split("-");

        return (
          !this.lastWeek ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      let mes = lastWeek.filter((i) => {
        let busquedaDesde;
        if (this.firstDay !== null) {
          busquedaDesde = this.firstDay.split("-");
        }

        const entrega = i.fecha.split("-");
        return (
          !this.firstDay  ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) >=
            new Date(busquedaDesde[0], busquedaDesde[1] - 1, busquedaDesde[2])
        );
      });

        let hoymes = mes.filter((i) => {
        let busquedaHasta;
        if (this.hoyMes !== null) {
          busquedaHasta = this.hoyMes.split("-");
        }
        const entrega = i.fecha.split("-");

        return (
          !this.hoyMes ||
          new Date(entrega[0], entrega[1] - 1, entrega[2]) <=
            new Date(busquedaHasta[0], busquedaHasta[1] - 1, busquedaHasta[2])
        );
      });

      let hoy = hoymes.filter((i) => {
        return !this.hoyBusqueda || i.fecha === this.hoyBusqueda;
      });

      this.calculateTotal(hoy);
      return hoy;
    },
  },
  methods: {
    initialize() {
      this.getAll();
    },
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
      this.lasttWeek = today.toISOString().slice(0, 10);
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
    calculateTotal(array) {
      let totalordenes;
      let totalcompras;

      //const totalordenes = array.filter(e=> e.tipo ==="Ordenes de trabajo").reduce((acum, valor) => acum + valor.total);
      totalordenes = array.reduce((total, e) => {
        return e.tipo === "Ordenes de trabajo" ? total + e.total : total;
      }, 0);
      totalcompras = array.reduce((total, e) => {
        return e.tipo === "Compras" ? total + e.total : total;
      }, 0);
      this.total = totalordenes - totalcompras;
    },
    agregarFechaBusqueda() {
      this.fechaBusquedaDesde = this.fechaDesde;
      this.fechaBusquedaHasta = this.fechaHasta;
      this.busquedaFechaModal = false;
    },
    descartarBusqueda() {
      this.tipoBusqueda = null;
      this.fechaBusqueda = null;
      this.hoyBusqueda = null;
      this.lastWeek = null;
      this.firstWeek = null;
      this.firstDay = null;
      this.hoyMes = null;
      (this.fechaBusquedaDesde = null),
        (this.fechaBusquedaHasta = null),
        this.getAll();
    },
    verBalance() {
      this.getBalance();
      this.dialogBalance = true;
    },
    verDetalles(item) {
      if (item.tipo === "Ordenes de trabajo") {
        this.getOrdenesDetallesDay(item.fecha);
        this.dialogOrdenesDetalle = true;
      }
      if (item.tipo === "Compras") {
        this.getComprasDetallesDay(item.fecha);
        this.dialogComprasDetalle = true;
      }
    },
    getAll() {
      fetch("http://localhost:3001/contable/dia/all")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.all = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getBalance() {
      fetch("http://localhost:3001/contable/balance")
        .then((res) => res.json())
        .then((res) => {
          const { resultado } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.balance = resultado;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getComprasDay() {
      fetch("http://localhost:3001/contable/dia/compras")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.comprasDay = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getOrdenesDay() {
      fetch("http://localhost:3001/contable/dia/ordenes")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.ordenesDay = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOrdenesDetallesDay(fecha) {
      fetch("http://localhost:3001/contable/dia/ordenes/" + fecha)
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.ordenesDetalleDay = elementos.map((e) => {
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getComprasDetallesDay(fecha) {
      fetch("http://localhost:3001/contable/dia/compras/" + fecha)
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.comprasDetalleDay = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>