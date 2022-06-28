<template>
  <div>
    <!-- MODAL  -->
    <b-modal
      v-model="modal.show"
      ok-title="Concluir"
      ok-only
      ok-variant="warning"
      modal-class="modal-warning"
      :title="modal.titulo"
      @hidden="atualizarDisciplina"
    >
      <b-row class="match-height">
        <b-col class="col-lg-3">
          <span> Horas </span>
          <b-form-input
            v-model="modal.hora"
            required
          />
        </b-col>
        <!--b-col class="col-lg-9">
          Sua Afinidade
          <b-form-select v-model="modal.afinidade" :options="modal.options" />
        </b-col-->
      </b-row>
    </b-modal>
    <!-- END MODAL -->
    <b-row class="match-height">
      <!-- Todas Disciplinas  -->
      <b-col
        lg="6"
        md="12"
      >
        <card-basico>
          <b-col md="12">
            <h6 class="text-primary font-weight-bold">
              Todas Disciplinas
            </h6>

            <!-- draggable -->
            <draggable
              :list="list1"
              tag="ul"
              group="people"
              class="list-group list-group-flush cursor-move"
              :move="onDrag"
              @end="onDrop"
            >
              <b-list-group-item
                v-for="(listItem, index) in list1"
                :key="index"
                tag="li"
              >
                <div class="d-flex">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold text-center">
                      {{ listItem.nome }}
                    </b-card-text>
                  </div>
                </div>
              </b-list-group-item>
            </draggable>
          </b-col>
        </card-basico>
      </b-col>
      <!-- Minhas Disciplinas  -->
      <b-col lg="6">
        <card-basico>
          <b-col
            md="12"
          >
            <h6 class="text-primary font-weight-bold">
              Minhas Disciplinas
            </h6>

            <!-- draggable -->
            <draggable
              id="minhas_disciplinas"
              :list="$store.getters['controller/getMinhasDisciplinas']"
              tag="ul"
              group="people"
              class="list-group list-group-flush cursor-move"
            >
              <b-list-group-item
                v-for="(listItem, index) in $store.getters['controller/getMinhasDisciplinas']"
                :key="index"
                tag="li"
              >
                <modal-disciplina
                  titulo="Configurar Disciplina"
                  :model="listItem.modalShow"
                  :afinidade="listItem.afinidade"
                  :index="listItem.index"
                />
                <div class="d-flex">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold">
                      {{ listItem.nome }} <feather-icon
                        size="20"
                        icon="BookIcon"
                        :class="listItem.status"
                      />
                    </b-card-text>
                    <b-row>
                      <b-button
                        variant="flat-primary"
                        class="btn-icon rounded-circle float-right"
                        @click="abrirModal()"
                      >
                        <feather-icon icon="SettingsIcon" />
                      </b-button>
                    </b-row>
                  </div>
                </div>
              </b-list-group-item>
            </draggable>
          </b-col>
        </card-basico>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BListGroupItem, BRow, BCol, BCardText, BButton, BFormInput,
} from 'bootstrap-vue'
import draggable from 'vuedraggable'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import CardBasico from '@/views/components/card/CardBasico.vue'
import store from '@/store'
import ModalDisciplina from './ModalDisciplina.vue'

export default {
  components: {
    BListGroupItem,
    BRow,
    BCol,
    draggable,
    CardBasico,
    BButton,
    BCardText,
    ModalDisciplina,
    BFormInput,
  },
  data() {
    return {
      list1: [
      ],
      list2: [
      ],
      dragged: {}, // Ultimo objeto a ser pego("dragged")
      modal: {
        disciplinaIndex: 0,
        show: false,
        afinidade: 'Iniciante',
        hora: '00:00:00',
        titulo: '',
        options: [
          { value: 'Iniciante', text: 'Iniciante' },
          { value: 'Mediano', text: 'Mediano' },
          { value: 'Expert', text: 'Expert' },
        ],
      },
    }
  },
  created() {
    this.$http
      .get('disciplinas', {})
      .then(response => {
        response.data.forEach(element => {
          this.list1.push({
            id: element.id, nome: element.nome, hora: '08:00', questoes: 0, status: 'nao_iniciado', modalShow: false, afinidade: 'Iniciante', // Status : nao_iniciado, rodando, parado, concluido, finalizado
          })
        })
      })
  },
  methods: {
    toggleModal(index) {
      this.modal.show = !this.modal.show
      if (this.modal.show && index != null) {
        const minhasDisciplinas = store.getters['controller/getMinhasDisciplinas']
        const disciplina = minhasDisciplinas.find(e => e.idx === index)
        this.changeModalInfo(disciplina, index)
      }
    },
    onDrop(evt) {
      if (evt.to.id === 'minhas_disciplinas') {
        this.dragged.idx = store.getters['controller/getMinhasDisciplinas'].findIndex(e => e.nome === this.dragged.nome)
        this.toggleModal(this.dragged.idx)
      }
    },
    onDrag(evt) {
      this.dragged = evt.draggedContext.element
    },
    changeModalInfo(json, index) {
      this.modal.titulo = json.nome
      this.modal.afinidade = json.afinidade
      this.modal.horas = json.horas
      this.modal.disciplinaIndex = index
    },
    atualizarDisciplina() {
      store.commit('controller/ATUALIZAR_DISCIPLINA_DRAG', this.modal)
    },
  },
}
</script>

<style>
  .nao_iniciado {
    color:tomato;
  }
  .rodando {
    color:teal;
  }
  .parado {
    color:orange
  }
  .finalizado {
    color:olivedrab;
  }
</style>