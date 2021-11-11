<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="productos"
      sort-by="nombre"
      :footer-props="{ itemsPerPageText: 'Items por pagina' }"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Listado de insumos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo insumo
              </v-btn>
            </template>
            <v-form ref="form" v-model="valid" lazy-validation scrolleable>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Nombre"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                       <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.marca"
                          label="Marca"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.proveedor"
                          label="Proovedor"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descripcion"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="!valid"
                    text
                    @click="validate"
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
                >Realmente quieres borrar este insumo?</v-card-title
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
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbarCreate" top color="primary" :timeout="timeout">
      El insumo se registro satisfactoriamente.
    </v-snackbar>
    <v-snackbar v-model="snackbarUpdate" top color="primary" :timeout="timeout">
      El insumo se actualizo satisfactoriamente.
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    timeout: 4000,
    valid: false,
    dialogDelete: false,
    snackbarCreate: false,
    snackbarUpdate: false,
    genericRules: [(v) => !!v || "Este campo es requerido"],
    headers: [
      {
        text: "Numero de producto",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "nombre" },
      { text: "Marca", value: "marca" },
      { text: "Proveedor", value: "proveedor" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Operaciones", value: "actions", sortable: false },
    ],
    productos: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      marca: "",
      proveedor: "",
      descripcion: "",
    },
    defaultItem: {
      nombre: "",
      marca: "",
      proveedor: "",
      descripcion: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo insumo" : "Editar insumo";
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
      this.getProductos();
    },
    validate() {
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        this.save();
      }
    },
    getProductos() {
      fetch("http://localhost:3001/productos")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.productos = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteProducto(this.editedItem);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.reset();
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
        const id = this.productos[this.editedIndex].id;
        this.updateProducto(id, this.editedItem);
        this.snackbarUpdate = true;
      } else {
        this.postProducto(this.editedItem);
        this.snackbarCreate = true;
      }
      this.close();
    },
    async updateProducto(id, producto) {
      try {
        await axios.put("http://localhost:3001/productos/" + id, producto);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
    async postProducto(producto) {
      try {
        await axios.post("http://localhost:3001/productos", producto);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
    async deleteProducto(producto) {
      try {
        await axios.delete("http://localhost:3001/productos/" + producto.id);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
  },
};
</script>