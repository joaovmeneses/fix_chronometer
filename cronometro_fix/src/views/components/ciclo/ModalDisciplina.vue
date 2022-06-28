<template>
  <div>
    <b-modal
      v-model="$store.getters['controller/getModalShow']"
      :title="$store.getters['controller/getModalTitulo']"
      ok-title="Concluir"
      ok-only
      ok-variant="warning"
      modal-class="modal-warning"
      @hidden="turnFalse"
    >
      <b-row>
        <b-col class="col-lg-3">
          <span> Horas </span>
          <b-form-input
            v-model="$store.getters['controller/getModalShow']"
            required
            @change="mudarHora"
          />
        </b-col>
        <b-col class="col-lg-9">
          Sua Afinidade
          <b-form-select
            v-model="$store.getters['controller/getModalAfinidade']"
            :options="options"
          />
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  BRow,
  BCol,
  BFormInput,
  BFormSelect,
} from 'bootstrap-vue'
import store from '@/store'

export default {
  name: 'ModalDisciplina',
  components: {
    BModal,
    BRow,
    BCol,
    BFormInput,
    BFormSelect,
  },
  data: () => ({
    options: [
      { value: 'Iniciante', text: 'Iniciante' },
      { value: 'Mediano', text: 'Mediano' },
      { value: 'Expert', text: 'Expert' },
    ],
    modelHora: '04:00',
  }),
  methods: {
    turnFalse() {
      store.commit('controller/TOGGLE_MODAL')
    },
    mudarHora() {
      // store.commit('controller/MUDAR_HORA', this.$props.index, this.modelHora)
    },
  },
}
</script>