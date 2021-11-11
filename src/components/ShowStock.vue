<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="stocks"
      sort-by="nombre"
      :footer-props="{ itemsPerPageText: 'Items por pagina' }"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Planilla de stock</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogIngreso" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                small
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Nuevo ingreso
              </v-btn>
            </template>
            <v-form ref="form" v-model="valid" lazy-validation scrolleable>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Ingreso de insumo</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="insumoSelect"
                          label="Insumo"
                          :items="productos"
                          item-value="nombre"
                          :rules="genericRules"
                          item-text="nombre"
                          return-object
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="insumoCantidad"
                          label="Cantidad"
                          type="number"
                          min="1"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="insumoPrecio"
                          type="number"
                          min="1"
                          label="Precio"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="insumoSelect.marca"
                          label="Marca"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="insumoSelect.proveedor"
                          label="Proveedor"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="insumoFecha"
                          label="Fecha"
                          type="date"
                          :rules="genericRules"
                          required
                          disabled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" sm="6" md="4" class="ml-auto mb-2">
                        <v-btn
                          color="success"
                          small
                          class="mr-4"
                          @click="addInsumo"
                        >
                          Agregar insumo
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider class="mb-2" />
                    <h3 class="font-weight-light mb-5">Insumos agregados</h3>
                    <v-row class="text-center justify-center">
                      <div v-if="hayInsumos">
                        <v-simple-table light class="elevation-2 mb-5">
                          <thead>
                            <tr>
                              <th class="text-left">Insumo</th>
                              <th class="text-left">Proveedor</th>
                              <th class="text-left">Precio</th>
                              <th class="text-left">Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, i) in compras" :key="i">
                              <td>{{ item.nombre }}</td>
                              <td>{{ item.proveedor }}</td>
                              <td>{{ item.precio }}</td>
                              <td>{{ item.cantidad }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </v-row>
                    <v-row class="justify-end">
                      <v-col cols="3" md="4">
                        <v-btn
                          class="mr-2 mt-2"
                          color="error"
                          small
                          @click="descartar"
                        >
                          Descartar
                          <v-icon right> mdi-close-circle </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="3" md="4">
                        <h4 class="mt-5 ml-5 font-weight-medium">
                          Precio total
                        </h4>
                      </v-col>

                      <v-col cols="4" md="4">
                        <v-text-field
                          color="success"
                          prefix="$"
                          v-model="precioTotal"
                          loading
                          disabled
                          >{{ precioTotal }}</v-text-field
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeIngreso">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="validateIngreso">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-dialog v-model="dialogEgreso" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="error"
                small
                class="ml-2 mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Nuevo egreso
              </v-btn>
            </template>
            <v-form ref="form" v-model="valid" lazy-validation scrolleable>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Egreso de stock</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="stockSelect"
                          label="Insumo"
                          :items="stocks"
                          item-value="producto_nombre"
                          :rules="genericRules"
                          item-text="producto_nombre"
                          return-object
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="stockSelect.cantidad"
                          label="Cantidad disponible"
                          type="number"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="stockSelect.marca"
                          label="Proveedor"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="stockSelect.proveedor"
                          label="Proveedor"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="egresoFecha"
                          label="Fecha"
                          type="date"
                          :rules="genericRules"
                          required
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="egresoCantidad"
                          label="Cantidad de egreso"
                          type="number"
                          :rules="genericRules"
                          :min="1"
                          :max="stockSelect.cantidad"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" sm="6" md="4" class="ml-auto mb-2">
                        <v-btn
                          color="success"
                          small
                          class="mr-4"
                          @click="addEgreso"
                        >
                          Agregar insumo
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider class="mb-2" />
                    <h3 class="font-weight-light mb-5">Insumos agregados</h3>
                    <v-row class="text-center justify-center">
                      <div v-if="hayEgresos">
                        <v-simple-table light class="elevation-2 mb-5">
                          <thead>
                            <tr>
                              <th class="text-left">Insumo</th>
                              <th class="text-left">Proveedor</th>
                              <th class="text-left">Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, i) in egresos" :key="i">
                              <td>{{ item.nombre }}</td>
                              <td>{{ item.proveedor }}</td>
                              <td>{{ item.cantidad }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </v-row>
                    <v-row class="justify-end">
                      <v-col cols="3" md="4">
                        <v-btn
                          class="mr-2 mt-2"
                          color="error"
                          small
                          @click="descartar"
                        >
                          Descartar
                          <v-icon right> mdi-close-circle </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEgreso">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="!valid"
                    text
                    @click="validateEgreso"
                  >
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Realmente quieres borrar este registro de stock?</v-card-title
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
        </v-toolbar>
      </template>
      <template template v-slot:[`item.actions`]="{ item }">
        <v-btn
          color="primary"
          class="ma-2"
          x-small
          @click="verStockDetalles(item.id)"
          >Detalles</v-btn
        >
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbarIngreso"
      top
      color="primary"
      :timeout="timeout"
    >
      El ingreso se registro satisfactoriamente.
    </v-snackbar>
    <v-snackbar v-model="snackbarEgreso" top color="primary" :timeout="timeout">
      El egreso se registro satisfactoriamente.
    </v-snackbar>
    <v-dialog v-model="dialogDetalleStock" max-width="650px">
      <v-card>
        <v-card-title class="text-h6">Detalles de Stock</v-card-title>
        <v-card-text>
          <h3 class="font-weight-light text-center mb-2">
            Ingresos y egresos del producto elegido
          </h3>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">N° de operacion</th>
                  <th class="text-left">Tipo de operacion</th>
                  <th class="text-left">Insumo</th>
                  <th class="text-left">Precio</th>
                  <th class="text-left">Cantidad</th>
                  <th class="text-left">Total</th>
                  <th class="text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detallesStock" :key="item.id">
                  <td>{{ item.operacion_id }}</td>
                  <td>{{ item.tipo_operacion }}</td>
                  <td>{{ item.producto }}</td>
                  <td>{{ item.precio }}</td>
                  <td>{{ item.cantidad }}</td>
                  <td>{{ item.total }}</td>
                  <td>{{ item.fecha }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDetalleStock = false"
            >Volver</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbarError" top color="error" :timeout="timeout">
      La lista esta vacia, debe ingresar al menos 1.
    </v-snackbar>
    <v-snackbar v-model="snackbarNostock" top color="error" :timeout="timeout">
      No hay suficiente stock.
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialogIngreso: false,
    dialogEgreso: false,
    hayInsumos: false,
    hayEgresos: false,
    insumoSelect: null,
    stockSelect: null,
    compras: [],
    stocks: [],
    detallesStock: [],
    precioTotal: 0,
    insumoPrecio: 1,
    insumoCantidad: 1,
    egresoCantidad: 1,
    insumoFecha: new Date().toISOString().slice(0, 10),
    egresoFecha: new Date().toISOString().slice(0, 10),
    timeout: 4000,
    valid: false,
    dialogDelete: false,
    snackbarIngreso: false,
    stockCantidad: true,
    snackbarEgreso: false,
    snackbarError: false,
    snackbarNostock: false,
    genericRules: [(v) => !!v || "Este campo es requerido"],
    headers: [
      {
        text: "Numero de stock",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Insumo", value: "producto_nombre" },
      { text: "Marca", value: "producto_marca" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Proveedor", value: "proveedor" },
      { text: "Operaciones", value: "actions", sortable: false },
    ],
    productos: [],
    egresos: [],
    dialogDetalleStock: false,
  }),
  computed: {
    getProveedor() {
      return this.insumoSelect.proveedor;
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
    initialize() {
      this.getStocks();
      this.getProductos();
    },
    getProductos() {
      fetch("http://localhost:3001/productos")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.productos = elementos;
          this.insumoSelect = elementos[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validateIngreso() {
      this.valid = this.$refs.form.validate();

      if (this.compras.length === 0) {
        this.snackbarError = true;
        this.valid = false;
      }

      if (this.valid) {
        this.saveIngreso();
      }
    },
    validateEgreso() {
      this.valid = this.$refs.form.validate();

      if (this.egresos.length === 0) {
        this.snackbarError = true;
        this.valid = false;
      }
      if (this.valid) {
        if(this.validateCantidad()) {
          this.saveEgreso();
        } else {
          this.snackbarNostock = true;
        }

     
      }
    },
    validateCantidad() {
      let valid = true;
      this.stocks.forEach((stock) => {
        this.egresos.forEach((egreso) => {
          if (stock.producto_id === egreso.id) {
            if (stock.cantidad < egreso.cantidad) {
              valid = false;
            }
          
          }
        });
      });
      return valid
    },
    addInsumo() {
      // this.$refs.form.validate();
      let insumoCompra = {
        id: this.insumoSelect.id,
        nombre: this.insumoSelect.nombre,
        precio: this.insumoPrecio,
        cantidad: this.insumoCantidad,
        proveedor: this.insumoSelect.proveedor,
      };
      this.compras.push(insumoCompra);

      this.precioTotal += this.insumoPrecio * this.insumoCantidad;
      this.insumoCantidad = 1;
      this.hayInsumos = true;
    },
    addEgreso() {
      // this.$refs.form.validate();

      let insumoEgreso = {
        id: this.stockSelect.producto_id,
        nombre: this.stockSelect.producto_nombre,
        proveedor: this.stockSelect.proveedor,
        cantidad: this.egresoCantidad,
      };
      this.egresos.push(insumoEgreso);
      this.hayEgresos = true;
    },

    closeIngreso() {
      this.resetIngreso();
    },
    closeEgreso() {
      this.resetEgreso();
    },
    descartar() {
      this.compras = [];
      this.egresos = [];
      this.hayInsumos = false;
      this.hayEgresos = false;
    },
    resetIngreso() {
      this.compras = [];
      this.precioTotal = 0;
      this.insumoPrecio = 1;
      this.hayInsumos = false;
      this.dialogIngreso = false;
      this.insumoCantidad = 1;
    },
    resetEgreso() {
      this.egresos = [];
      this.hayEgresos = false;
      this.hayInsumos = false;
      this.hayEgresos = false;
      this.egresoCantidad = 1;
      this.dialogEgreso = false;
    },
    verStockDetalles(id) {
      this.getStocksDetalles(id);
      this.dialogDetalleStock = true;
    },
    getStocksDetalles(id) {
      fetch("http://localhost:3001/stocks/detalles/" + id)
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.fecha - b.fecha);
          this.detallesStock = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getStocks() {
      fetch("http://localhost:3001/stocks")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.stocks = elementos;
          this.stockSelect = elementos[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveIngreso() {
      this.postIngreso(this.compras);
      this.closeIngreso();
      this.snackbarIngreso = true;
    },
    saveEgreso() {
      this.postEgreso(this.egresos);
      this.closeEgreso();
      this.snackbarEgreso = true;
    },
    async updateStock(id, stock) {
      try {
        await axios.put("http://localhost:3001/stocks/" + id, stock);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
    async postIngreso(compras) {
      const ingreso = {
        productos: compras,
        fecha: this.insumoFecha,
        precioTotal: this.precioTotal,
      };
      try {
        await axios.post("http://localhost:3001/compras", ingreso);
      } catch (error) {
        console.log(error);
      }
      this.getStocks();
    },
    async postEgreso(egresos) {
      const egreso = {
        productos: egresos,
        fecha: this.egresoFecha,
      };
      try {
        await axios.post("http://localhost:3001/egresos", egreso);
      } catch (error) {
        console.log(error);
      }
      this.getStocks();
    },
    async deleteStock(stock) {
      try {
        await axios.delete("http://localhost:3001/stocks/" + stock.id);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
  },
};
</script>