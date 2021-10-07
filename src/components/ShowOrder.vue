<template>
  <v-simple-table fixed-header height="300px">
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ordenes" :key="item.id">
          <td>{{ item.orden_id }}</td>
          <td>{{ item.cliente_nombre }} {{item.cliente_apellido}}</td>
          <td>{{ item.cliente_dni }}</td> 
          <td>{{ item.tipo_entrega }}</td> 
          <td>{{ item.fecha_entrega }}</td>  
          <td>{{ item.precio }}</td>  
          <td>{{ item.monto }}</td> 
          <td>{{ item.estado }}</td>  
          <td>En construcción</td>  
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
  export default {
    data () {
      return {
        ordenes: [],
      }
    },
    mounted(){
      this.getOrden()
    },
    methods: {
    getOrden() {
      fetch("http://localhost:3001/orden")
        .then((res) => res.json())
        .then((res) => {
          const { elementos } = res;
          console.log(res)
          this.ordenes = elementos;
        })
        .catch((err) => {
          console.log(err);
        });
     },
  },
  }
</script>