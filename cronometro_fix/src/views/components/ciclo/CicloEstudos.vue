<template>
  <section>
    <!-- MODAL HORAS CORRIDAS  -->
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
            <cleave
              id="time"
              v-model="modal.horas"
              class="form-control"
              :raw="false"
              :options="options.time"
              placeholder="hh:mm:ss"
              @blur="alterouHora()"
            />
          <!--b-form-input v-model="modal.horas" required @change="alterouHora()" /-->
        </b-col>
       
      </b-row>
      <b-row>
        <b-col>
          <b-form-checkbox
            id="checkbox-1"
            v-model="horasCorridasCheck"
            name="checkbox-1"
          >
            Informar horas corridas
          </b-form-checkbox> <br>
        </b-col>
      </b-row>
      <b-row v-show="horasCorridasCheck">
        <b-col>
          <cleave
            id="time"
            v-model="inputFinalizarDisciplina"
            class="form-control"
            :raw="false"
            :options="options.time"
            placeholder="hh:mm:ss"
          />
        </b-col>
      </b-row>
    </b-modal>
    <!-- END MODAL -->

    <!-- MODAL FINAL MATERIA  -->
    <b-modal
      v-model="modalTipoEstudo"
      ok-title="Concluir"
      ok-only
      ok-variant="warning"
      modal-class="modal-warning"
      title="Selecione o tipo de estudo:"
      @hidden="iniciarNovaDisciplina"
    >
      <b-row class="match-height">
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            :aria-describedby="ariaDescribedby"
            id="checkbox-group-1"
            v-model="selectedEstudoOpcoes"
            :options="tipoEstudoOpcoes"
            name="flavour-1"
            stacked
          ></b-form-checkbox-group>
        </b-form-group>
      </b-row>
    </b-modal>
    <!-- END MODAL FINAL MATERIA -->

    <b-row class="match-height">
      <!-- Todas Disciplinas  -->
      <card-basico class="col-lg-12">
        <b-col md="12">
          <b-row>
            <b-col cols="10">
              <h6 class="text-primary font-weight-bold">Ciclo de Estudos</h6>
            </b-col>
            <b-col cols="2">
              <b-form-checkbox
                v-model="checkedHabilitarEdicaoCiclo"
                name="check-button"
                switch
              >
                Modo Edição<b/>
              </b-form-checkbox>
            </b-col>
          </b-row>
        </b-col>
          <draggable
            :sort="checkedHabilitarEdicaoCiclo"
            id="ciclo_estudos"
            :list="$store.getters['controller/getCiclo']"
            tag="ul"
            group="people"
            class="list-group list-group-flush cursor-move flex"
            :move="onDrag"
            @end="onDrop"
          >
          <!--b-row>
            <b-col
              -->
              <b-card
                v-for="(listItem, index) in $store.getters['controller/getCiclo']"
                :key="index"
                lg="4"
                :border-variant="statusCard(listItem.status_id)"
                class="icon-card cursor-pointer text-center mb-2 mx-50"
              >
                {{ listItem.nome }}
                <br><br> <span> {{ listItem.horas }} </span>
                <b-card-text class="icon-name text-truncate mb-0 mt-1">
                  <b-button
                    variant="flat-success"
                    class="btn-icon"
                    v-if="checkedHabilitarEdicaoCiclo"
                    @click="toggleModal(index)"
                  >
                    <feather-icon icon="SettingsIcon" size="15" />
                  </b-button>
                  &nbsp;
                  <b-button
                    variant="flat-success"
                    class="btn-icon"
                    v-if="checkedHabilitarEdicaoCiclo"
                    @click="deletarDisciplina(listItem.idx, listItem.id)"
                  >
                    <feather-icon icon="TrashIcon" size="15" />
                  </b-button>
                  &nbsp;
                  <b-button
                    variant="flat-success"
                    class="btn-icon"
                    v-if="listItem.status_id == 5 || checkedHabilitarEdicaoCiclo"
                    @click="finalizarDisciplina(listItem, index)"
                  >
                    <feather-icon icon="CheckCircleIcon" size="15" />
                  </b-button>
                </b-card-text>
              </b-card>
            <!--/b-col>
          </b-row-->
        </draggable>
      </card-basico>
    </b-row>
  </section>
</template>

<script>
import {
  BRow,
  BCol,
  BCardText,
  BCard,
  BButton,
  BFormInput,
  BFormCheckbox,
  BFormCheckboxGroup,
  BFormGroup,
   /* BFormSelect, */
} from "bootstrap-vue";
import draggable from "vuedraggable";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import CardBasico from "@/views/components/card/CardBasico.vue";
import store from "@/store";
import Cleave from 'vue-cleave-component';

export default {
  components: {
    BRow,
    BCol,
    CardBasico,
    draggable,
    BCardText,
    BCard,
    BButton,
    BFormInput,
    BFormCheckbox,
    BFormCheckboxGroup,
    Cleave,
    BFormGroup,
    // BFormSelect,
  },
  data() {
    return {
      checkedHabilitarEdicaoCiclo: null,
      dragged: {}, // Ultimo objeto a ser pego("dragged")
      modalTipoEstudo: false,
      horasCorridasCheck: false,
      selectedEstudoOpcoes: [],
      ultimaDisciplinaFinalizada: 0,
      inputFinalizarDisciplina: '',
      options: {
        time: {
          time: true,
          timePattern: ['h', 'm', 's'],
        }
      },
      tipoEstudoOpcoes: [
        {text: 'PDF', value: 1},
        {text: 'Vídeo Aula', value: 2},
        {text: 'Livro', value: 3},
        {text: 'Questões', value: 4},
        {text: 'Resumo', value: 5},
      ],
      modal: {
        disciplinaIndex: 0,
        show: false,
        afinidade: 1,
        horas: "00:00:00",
        horasAlteradas: false,
        disciplina_ciclo_id: 0,
        titulo: "",
        options: [
          { value: 1, text: "Iniciante" },
          { value: 2, text: "Mediano" },
          { value: 3, text: "Expert" },
        ],
      },
    };
  },
  created() {
    this.checkedHabilitarEdicaoCiclo = store.getters['controller/getCheckedHabilitarEdicaoCiclo'];
  },
  methods: {
    alterouHora()
    {
      this.modal.horasAlteradas = true;
    },
    onDrop(evt) {
      // Ajustar Indicies
      this.ajustarIndices();
      // Abrir Modal
      if (evt.to.id === "minhas_disciplinas") {
        this.dragged.idx = store.getters[
          "controller/getMinhasDisciplinas"
        ].findIndex((e) => e.nome === this.dragged.nome);

        this.toggleModal(this.dragged.idx);
      }
    },
    onDrag(evt) {
      this.dragged = evt.draggedContext.element;
    },
    toggleModal(index) {
      this.modal.show = !this.modal.show;
      if (this.modal.show && index != null) {
        const minhasDisciplinas = store.getters["controller/getCiclo"];
        this.changeModalInfo(minhasDisciplinas[index], index);
      }
    },
    changeModalInfo(json, index) {
      this.modal.titulo = json.nome;
      this.modal.disciplina_ciclo_id = json.id;
      this.modal.afinidade = json.afinidade;
      this.modal.horas = json.horas;
      this.modal.horas_corridas = json.horas_corridas;
      this.modal.disciplinaIndex = index;
      this.modal.horasAlteradas = false;
    },
    atualizarDisciplina() {
      const vm = this;
      //Verifica se precisa atualizar horas no banco
      if(this.modal.horasAlteradas)
      {
        this.$http.put(`ciclos/${this.$route.params.id}/disciplinas/${this.modal.disciplina_ciclo_id}/editHora`, {horas: this.modal.horas}).then( function (response)
        {
          store.commit("controller/ATUALIZAR_DISCIPLINA_CICLO", vm.modal);
        });
      }
      //Verificar se o usuário quer alterar as horas corridas da disciplina
      if(this.inputFinalizarDisciplina.length === 8) //Ele alterou o horário e ta no tamanho correto
        this.$http.put(`ciclos/${this.$route.params.id}/disciplinas/${this.modal.disciplina_ciclo_id}/editHorasCorridas`, {horas_corridas: this.inputFinalizarDisciplina}).then( function (response)
        {
          vm.modal.horas_corridas = vm.inputFinalizarDisciplina;
          store.commit("controller/ATUALIZAR_DISCIPLINA_CICLO", vm.modal);
          vm.inputFinalizarDisciplina = ""; // setar zero novamente
          //Verificar se o usuário já bateu o tempo
          const horas = new Date(`2021-01-01 ${vm.modal.horas}`);
          const horas_corridas = new Date(`2021-01-01 ${vm.modal.horas_corridas}`);
          if(horas_corridas.getTime() >= horas.getTime())// Usuario bateu o tempo
            {
              store.commit('controller/ALTERAR_STATUS_DISCIPLINA', [vm.modal.disciplinaIndex, 5]);
              store.dispatch('controller/atualizarDisciplina', vm.modal.disciplinaIndex);
            }

        });        

    },
    statusCard(status) {
      if (status === 1) {
        return "secondary";
      }
      if (status === 4) {
        return "success";
      }
      if (status === 2) {
        return "info";
      }
      if (status === 5) {
        return "primary";
      }

      return "warning";
    },
    finalizarDisciplina(disciplina, idx) {
      if (disciplina.status_id > 4) {
        store.commit("controller/ALTERAR_STATUS_DISCIPLINA", [idx, 4]);
        store.commit("controller/CRO_ZERAR");
        store.dispatch("controller/atualizarDisciplina", [idx, 4]);
        this.toggleCronometro("pausar");
        this.modalTipoEstudo = true;
        this.ultimaDisciplinaFinalizada = disciplina.id;
      }
    },
    iniciarNovaDisciplina() {
      alert(this.selectedEstudoOpcoes);
      const proxDisciplina = store.getters["controller/getProxDisciplina"];
      if (proxDisciplina != null && proxDisciplina !== undefined) {
        // Setar as horas corridas da disciplina no cronometro, assim sempre começa de onde o usuario parou
        store.commit(
          "controller/SET_HORAS_CORRIDAS",
          proxDisciplina.horas_corridas
        );
        this.$root.$emit("eventing", "iniciar");
        // store.commit('controller/ALTERAR_STATUS_DISCIPLINA', [proxDisciplina.index, 'iniciado'])
      } else {
        alert("Acabou!");
        //Fechar historico e abrir novo
        const disciplinas = store.getters["controller/getCiclo"];
        this.$http
        .put(`ciclos/${this.$route.params.id}/restart`, {disciplinas: disciplinas})
        .then((response) => location.reload())
        .catch((response) => console.log(response));
      }
      //Adicionar Tipos de Estudos
      this.inserirTipoEstudo();
      //Limpar opções selecionadas
      this.selectedEstudoOpcoes = [];
    },
    inserirTipoEstudo()
    {
      this.$http.post(`ciclos/${this.$route.params.id}/disciplinas/${this.ultimaDisciplinaFinalizada}/tipos_estudos/store`, {tipos: this.selectedEstudoOpcoes})
      .then(function(data)
      {
        console.log('data');
        console.log(data);
      })
    },
    toggleCronometro(valor) {
      this.$root.$emit("eventing", valor);
    },
    ajustarIndices() {
      // Reajustar na lista
      store.commit("controller/AJUSTAR_INDICES");
      const disciplinasCiclo = store.getters["controller/getCiclo"];
      // Atualizar no Banco
      this.$http
        .put(`ciclos/${this.$route.params.id}/disciplinas/updateIndex`, {
          disciplinas: disciplinasCiclo,
        })
        .then((response) => console.log(response))
        .catch((response) => console.log(response));
    },
    deletarDisciplina(idx, disciplinaId) {
      store.dispatch("controller/deletarDisciplina", [idx, disciplinaId, this.$route.params.id]);
    },
  },
  watch: {
    checkedHabilitarEdicaoCiclo () {
      store.commit('controller/CHECK_EDITAR_CICLO')
    }
  }
};
</script>

<style>
.nao_iniciado {
  color: tomato;
}
.rodando {
  color: teal;
}
.parado {
  color: orange;
}
.finalizado {
  color: olivedrab;
}

.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>