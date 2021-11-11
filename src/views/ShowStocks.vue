<template>
  <div class="ShowStock">
    <ShowStock/>
  </div>
</template>

<script>
// @ is an alias to /src
import ShowStock from '@/components/ShowStock.vue'

export default {
  name: 'ShowStocks',
  components: {
    ShowStock
  }
}
</script>