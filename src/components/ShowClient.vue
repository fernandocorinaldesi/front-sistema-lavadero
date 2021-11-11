<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="clientes"
      sort-by="calories"
      class="elevation-1"
      :footer-props="{ itemsPerPageText: 'Items por pagina' }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Listado de clientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo cliente
              </v-btn> </template
            >}
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
                          v-model="editedItem.apellido"
                          label="Apellido"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.dni"
                          label="DNI"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.direccion"
                          label="Direccion"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.localidad"
                          label="Localidad"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.provincia"
                          label="Provincia"
                          :rules="genericRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.telefono"
                          label="Telefono"
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
                    :disabled="!valid"
                    color="blue darken-1"
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
                >Realmente quieres borrar este cliente?</v-card-title
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
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbarCreate" top color="primary" :timeout="timeout">
      El cliente se registro satisfactoriamente.
    </v-snackbar>
    <v-snackbar v-model="snackbarUpdate" top color="primary" :timeout="timeout">
      El cliente se actualizo satisfactoriamente.
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
        text: "Numero de cliente",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "nombre" },
      { text: "Apellido", value: "apellido" },
      { text: "DNI", value: "dni" },
      { text: "Email", value: "email" },
      { text: "Direccion", value: "direccion" },
      { text: "Locallidad", value: "localidad" },
      { text: "Provincia", value: "provincia" },
      { text: "Telefono", value: "telefono" },
      { text: "Operaciones", value: "actions", sortable: false },
    ],
    clientes: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      direccion: "",
      telefono: "",
    },
    defaultItem: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      direccion: "",
      telefono: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo cliente" : "Editar cliente";
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
      this.getClientes();
    },
    getClientes() {
      fetch("http://localhost:3001/clientes")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          //elementos.sort((a, b) => a.orden_id - b.orden_id);

          this.clientes = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.clientes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.clientes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.clientes.splice(this.editedIndex, 1);
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
    validate() {
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        this.save();
      }
    },
    save() {
      if (this.editedIndex > -1) {
        const id = this.clientes[this.editedIndex].id;
        this.updateCliente(id, this.editedItem);
        this.snackbarUpdate = true;
      } else {
        this.postCliente(this.editedItem);
        this.snackbarCreate = true;
      

      }
      this.close();
    },
    async updateCliente(id, cliente) {
      try {
        await axios.put("http://localhost:3001/clientes/" + id, cliente);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
    async postCliente(cliente) {
      try {
        await axios.post("http://localhost:3001/clientes", cliente);
      } catch (error) {
        console.log(error);
      }
      this.initialize();
    },
  },
};
</script>