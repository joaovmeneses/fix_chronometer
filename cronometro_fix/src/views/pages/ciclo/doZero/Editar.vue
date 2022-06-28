<template>
  <div>
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
            v-model="modal.horas"
            required
          />
        </b-col>
        <!--b-col class="col-lg-9">
          Sua Afinidade
          <b-form-select v-model="modal.afinidade" :options="modal.options" />
        </b-col-->
      </b-row>
    </b-modal>
    <b-row>
      <b-col lg="3">
        <cronometro-ciclo />

        <card-basico 
          v-show="!checkedHabilitarEdicaoCiclo"
          style="max-height: 600px; overflow-y: scroll; overflow-x: none"
        >
          <h6 class="text-primary font-weight-bold">
            Todas Disciplinas
          </h6>
          <b-row>
            <b-col>
              <b-form-input v-model="searchDisciplina" placeholder="Pesquisar"></b-form-input>
            </b-col>
          </b-row>
          <!-- draggable -->
          <draggable
            :list="lisItemsDisciplinasDrag"
            tag="ul"
            group="people"
            class="list-group list-group-flush cursor-move"
            :move="onDrag"
            @end="onDrop"
          >
            <b-list-group-item
              v-for="(listItem, index) in lisItemsDisciplinasDrag"
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
        </card-basico>
      </b-col>
      <b-col lg="9">
        <ciclo-estudos />
      </b-col>
      </b-row>
  </div>
</template>

<script>
import CicloEstudos from '@/views/components/ciclo/CicloEstudos.vue'
import CronometroCiclo from '@/views/components/ciclo/CronometroCiclo.vue'
import {
  BRow, BCol, BCardText, BListGroupItem, BFormInput,
} from 'bootstrap-vue'
import draggable from 'vuedraggable'
import store from '@/store'
import CardBasico from '@/views/components/card/CardBasico.vue'

export default {
  name: 'EditarDoZero',
  components: {
    BRow,
    BListGroupItem,
    BCardText,
    draggable,
    BCol,
    CicloEstudos,
    CardBasico,
    BFormInput,
    CronometroCiclo,
  },
  data() {
    return {
      searchDisciplina: null,
      lisItemsDisciplinasDrag: [],
      padrao_horas: 24,
      max_horas: 2,
      dragged: {}, // Ultimo objeto a ser pego("dragged")
      disciplinas: [

      ],
      modal: {
        disciplinaIndex: 0,
        show: false,
        afinidade: 1,
        horas: '00:00:00',
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
    this.checkedHabilitarEdicaoCiclo = store.getters['controller/getCheckedHabilitarEdicaoCiclo']
    this.lisItemsDisciplinasDrag = store.getters['controller/getTodasDisciplinas']
    this.montarMeuCiclo()
    if (this.lisItemsDisciplinasDrag.length === 0) {
      this.getAllDisciplinas()
    }
  },
  methods: {
    getAllDisciplinas(){
      this.$http
        .get('disciplinas', {})
        .then(response => {
          response.data.forEach(element => {
            store.commit('controller/READICIONAR_DISCIPLINA', {
              disciplina_id: element.id,
              nome: element.nome,
              horas: '00:01:00',
              horas_corridas: '00:00:00',
              questoes: 0,
              unique: this.sortearNumero(),
              status_id: 1, // Status : nao_iniciado, iniciado, parado, finalizado, concluido
              modalShow: false,
              afinidade: 1,
            })
          })

          this.lisItemsDisciplinasDrag = store.getters['controller/getTodasDisciplinas']
        })
    },
    onDrop(evt) {
      if (evt.to.id === 'ciclo_estudos') {
        this.dragged.idx = store.getters['controller/getCiclo'].findIndex(e => e.unique === this.dragged.unique)
        this.toggleModal(this.dragged.idx)
        this.dragged.unique = this.sortearNumero()
        // Adicionar o novo Unique para diferenciar na lista
        store.commit('controller/READICIONAR_DISCIPLINA', {
          disciplina_id: this.dragged.disciplina_id,
          nome: this.dragged.nome,
          horas: this.dragged.horas,
          horas_corridas: this.dragged.horas_corridas,
          questoes: this.dragged.questoes,
          unique: this.sortearNumero(),
          status_id: this.dragged.status_id, // Status : nao_iniciado, iniciado, parado, finalizado, concluido
          modalShow: this.dragged.modalShow,
          afinidade: this.dragged.afinidade,
        })
        this.inserirDisciplina(this.dragged.idx);
      }
    },
    onDrag(evt) {
      console.log(evt.draggedContext.index)
      this.dragged = evt.draggedContext.element
    },
    atualizarDisciplina() {
      store.commit('controller/ATUALIZAR_DISCIPLINA_CICLO', this.modal)
    },
    toggleModal(index) {
      console.log(store.getters['controller/getCiclo'])
      this.modal.show = !this.modal.show
      if (this.modal.show && index != null) {
        const minhasDisciplinas = store.getters['controller/getCiclo']
        this.changeModalInfo(minhasDisciplinas[index], index)
      }
    },
    changeModalInfo(json, index) {
      this.modal.titulo = json.nome
      this.modal.afinidade = json.afinidade
      this.modal.horas = json.horas
      this.modal.disciplinaIndex = index
    },
    inserirDisciplina(idx) {
      this.$http.post(`ciclos/${this.$route.params.id}/disciplinas/store`, { disciplina: this.dragged, ciclo_id: this.$route.params.id })
        .then(response => {
          console.log('resposta');
          console.log(response.data);
          store.commit('controller/ATUALIZAR_INDEX_DISCIPLINA_CICLO', [idx, response.data]);
        })
        .catch(response => console.log(`Erro : ${response}`))
    },
    sortearNumero() {
      return Math.floor(Math.random() * 99999)
    },
    montarMeuCiclo() {
      store.commit('controller/ZERAR_CICLO')
      this.$http.get(`ciclos/${this.$route.params.id}/disciplinas`)
        .then(response => {
          console.log(response.data)
          response.data.forEach(element => {
            if (element.status_id === 2) { // Se o status estiver "rodando"
              store.commit('controller/ADICIONAR_DISCIPLINA', {
                id: element.id,
                nome: element.nome,
                horas: element.horas,
                horas_corridas: element.horas_corridas,
                questoes: element.questoes,
                unique: this.sortearNumero(),
                status_id: 3,
                modalShow: element.modalShow,
                afinidade: element.afinidade,
              })
            } else {
              store.commit('controller/ADICIONAR_DISCIPLINA', element)
            }
          })
        })
        .catch(response => console.log(response.data))
    },
  },
  computed: {
    checkedHabilitarEdicaoCiclo: {
      get () {
        return store.getters['controller/getCheckedHabilitarEdicaoCiclo']
      },
      set () {
      }
    }
  },
  watch: {
    checkedHabilitarEdicaoCiclo () {
      this.checkedHabilitarEdicaoCiclo = store.getters['controller/getCheckedHabilitarEdicaoCiclo']
    },
    searchDisciplina () {
      let disciplinaTemp = this.lisItemsDisciplinasDrag

      if (this.searchDisciplina != '' && this.searchDisciplina) {
        disciplinaTemp = disciplinaTemp.filter((disciplina) => {
          return disciplina.nome
            .toUpperCase()
            .includes(this.searchDisciplina.toUpperCase())
        })
        this.lisItemsDisciplinasDrag = disciplinaTemp
      }else{
        this.getAllDisciplinas()
      }
    }
  }
}
</script>

<style>
</style>