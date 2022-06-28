<template>
  <section>
    <card-basico titulo="Meus Ciclos">
      <b-table
        class="text-center"
        responsive="sm"
        :fields="fields"
        :items="ciclos"
      >
        <template #cell(nome)="data">
          {{ data.item.nome }}
        </template>

        <template #cell(ações)="data">
          <b-button
            variant="flat-success"
            class="btn-icon rounded-circle"
            @click="editar( data.item.id )"
          >
            <feather-icon icon="PlayIcon" />
          </b-button>
          <b-button
            variant="flat-danger"
            class="btn-icon rounded-circle"
            @click="deletar( data.item.id )"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </b-table>
    </card-basico>
  </section>
</template>

<script>
import { getUserData } from '@/auth/utils'
import { BTable, BButton } from 'bootstrap-vue'
import CardBasico from '../../components/card/CardBasico.vue'

export default {
  name: 'IndexCiclo',
  components: {
    BTable,
    BButton,
    CardBasico,
  },
  data() {
    return {
      fields: [
        'Nome',
        'Ações',
      ],
      ciclos: [],
    }
  },
  created() {
    const userData = getUserData()
    this.getAllCiclos()
  },
  methods: {
    getAllCiclos(){
      this.$http
      .get(`/ciclos`, {})
      .then(response => {
        response.data.forEach(json => {
          this.ciclos.push(json)
        })
      })
      .catch(response => {
        console.log(response)
      })
    },
    editar(id) {
      console.log(id)
      this.$router.push({ path: `/pages/ciclo/doZero/${id}`})
    },
    deletar(id) {
      this.$http
      .put(`/ciclos/${id}/destroy`)
      .then(() => {
        location.reload();
      })
      .catch(response => {
        alert(response);
      })
    },
  },
}
</script>