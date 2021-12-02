<template>
  <v-container class="mb-5">
    <v-row class="text-center justify-center align-center mt-4 mb-5">
      <v-col cols="10" class="elevation-2">
        <h2 class="headline mb-3">Opciones de seguridad</h2>
        <v-divider class="mb-2" />
        <h3 class="font-weight-light mb-5">
          Copia de seguridad de la base de datos
        </h3>
        <v-row>
          <v-col cols="4">
            <v-btn
              @click="downloadBackup"
              :disabled="!download"
              color="success"
            >
              Descargar copia
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn @click="backupDialog = true" color="success">
              Realizar copia
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mb-2 mt-2" />
        <h3 class="font-weight-light mb-5">Restaurar base de datos</h3>
        <v-form
          ref="formRestore"
          v-model="restoreValid"
          lazy-validation
          scrolleable
          class="mb-6"
        >
          <v-row>
            <v-col cols="12" md="4">
              <v-file-input
                chips
                v-model="archivo"
                type="file"
                accept=".tar"
                label="Seleccionar la base de datos"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn color="success" class="mr-4" @click="restore">
                Restaurar
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              {{ text }}
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"
                :active="loading"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              {{ textEmergency }}
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"
                :active="loadingEmergency"
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-form>
        <v-dialog v-model="backupDialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Realmente quieres hacer una copia de la base de
              datos?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="backupDialog = false"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="backupConfirm"
                >Si</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="restoreDialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Realmente quieres restaurar la base de datos
              elegida?</v-card-title
            >
            <v-card-text>
              <h2 style="color: red">
                Cuidado!!! la base de datos actual puede perderse durante este
                proceso!!
              </h2>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="restoreDialog = false"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="restoreConfirm"
                >Si</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider class="mb-2" />
        <v-snackbar v-model="backupok" top color="primary" :timeout="timeout">
          La copia de seguridad de la base de datos se realizo
          satisfactoriamente. Ya puede descargar el archivo.
        </v-snackbar>
        <v-snackbar v-model="restoreok" top color="primary" :timeout="timeout">
          La restauracion de la base de datos se realizo satisfactoriamente.
        </v-snackbar>
        <v-snackbar v-model="restoreError" top color="error" :timeout="timeout">
          Debe elegir una base de datos
        </v-snackbar>

        <v-snackbar
          v-model="emergenciaSnackbar"
          top
          color="error"
          :timeout="4000"
          >Hubo un problema durante la restauracion de la base de
          datos.</v-snackbar
        >
        <v-snackbar v-model="restoreErrorFile" top color="error" :timeout="3000"
          >Debe ser un archivo .tar!.</v-snackbar
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ShowSecurity",
  data: () => ({
    directorio: "c:\\seguridad",
    guardado: null,
    download: false,
    restoreError: false,
    emergenciaSnackbar: false,
    backupok: false,
    backupDialog: false,
    restoreDialog: false,
    restoreValid: false,
    restoreok: false,
    restoreFail: false,
    restoreErrorFile: false,
    archivo: null,
    loading: false,
    loadingEmergency: false,
    textEmergency: "",
    text: "",
    timeout: 8000,
    genericRules: [
      (v) => !!v || "Este campo es requerido",
      (v) =>
        !!v.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim)[0] == ".tar" ||
        "Debe ser un archivo .tar!",
    ],
  }),

  watch: {
    loading(val) {
      if (!val) return;
      setTimeout(() => (this.loading = false), this.timeout);
    },

    loadingEmergency(val) {
      if (!val) return;
      setTimeout(() => (this.loadingEmergency = false), 5000);
    },
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    restore() {
      if (this.archivo == null) {
        this.restoreError = true;
        /* } else if (
        this.archivo.name.match(
          /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim
        )[0] !== ".tar"
      ) {
        this.restoreErrorFile = true;
        this.archivo = null;*/
      } else {
        this.restoreDialog = true;
      }
    },

    restoreConfirm() {
      this.restoreDialog = false;
      this.postRestore(this.archivo);
    },
    isLoading(texto) {
      this.text = texto;
      this.loading = true;
    },

    backupConfirm() {
      this.backup();
      this.backupDialog = false;
      this.backupok = true;
    },

    async postRestore(file) {
      this.isLoading("Restaurando");
      axios.defaults.baseURL = file.name;

      try {
        await axios.post("http://localhost:3001/seguridad/restore", file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
          params: {
            nombre: file.name,
          },
        });
        this.restoreok = true;
      } catch (error) {
        console.log(error);
        this.archivo = null;
        this.text = "";
        this.emergencyBackup();
      }
      this.text = "";
      this.archivo = null;
    },
    backup() {
      fetch("http://localhost:3001/seguridad/backup")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          this.guardado = elementos;
          this.download = true;

        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadBackup() {
      var binaryString = window.atob(this.guardado);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }

      var blob = new Blob([bytes], { type: "application/tar" });

      var fileURL = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.style = "display: none";
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = "backup.tar";
      a.click();
      window.URL.revokeObjectURL(fileURL);
      a.remove();
    },
    emergencyBackup() {
      this.emergenciaSnackbar = true;
      this.textEmergency = "Iniciando restauracion de emergencia";
      this.loadingEmergency = true;

      fetch("http://localhost:3001/seguridad/backup/emergencia")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          this.guardado = elementos;

          //elementos.sort((a, b) => a.orden_id - b.orden_id);
        })
        .catch((err) => {
          console.log(err);
        });
      //this.textEmergency = "";
      setTimeout(() => (this.textEmergency = ""), 5000);
      setTimeout(() => (this.restoreok = true), 7000);
      //this.restoreok = true;
    },

    async postCambiarDirectorio(post) {
      this.isLoadingEmergency();
      try {
        await axios.post("http://localhost:3001/orden", post);
      } catch (error) {
        console.log(error);
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style>
</style>