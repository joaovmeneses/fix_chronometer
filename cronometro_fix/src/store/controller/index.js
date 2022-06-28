import axios from '../../libs/axios'
import { getUserData } from '@/auth/utils'

export default {
  namespaced: true,
  state: {
    checkedHabilitarEdicaoCiclo: false,
    minhas_disciplinas: [],
    ciclo_estudos: [],
    todas_disciplinas: [],
    showCiclo: false,
    contador: {
      hh: '00',
      mm: '00',
      ss: '00',
    },
    cron: '',
    selecionado: '',
    selectedAreaCicloInsert: null,
    selectedConcursoCicloInsert: null,
    novoConcursoInsert: [],
    novoCicloPorAreaInsert: [],
    novoCicloPorConcursoInsert: [],
  },
  getters: {
    getMinhasDisciplinas: state => state.minhas_disciplinas,
    getTodasDisciplinas: state => state.todas_disciplinas,
    getCiclo: state => state.ciclo_estudos,
    getInfoDisciplinaCiclo: (state, idx) => state.ciclo_estudos.find(e => e.idx === idx),
    getByUnique: (state, unique) => state.ciclo_estudos.find(e => e.unique === unique),
    getIndexRodando: state => state.ciclo_estudos.findIndex(e => e.status_id === 2),
    getIndexParado: state => state.ciclo_estudos.findIndex(e => e.status_id === 3),
    getHora: state => state.contador.hh,
    getMinuto: state => state.contador.mm,
    getSegundo: state => state.contador.ss,
    getProxDisciplina(state) {
      let proxDisciplina
      for (let i = state.ciclo_estudos.length - 1; i >= 0; i -= 1) {
        if (state.ciclo_estudos[i].status_id === 5) {
          proxDisciplina = state.ciclo_estudos[i]
          proxDisciplina.idx = i
          return proxDisciplina
        }
      }
      for (let i = state.ciclo_estudos.length - 1; i >= 0; i -= 1) {
        if (state.ciclo_estudos[i].status_id === 3) {
          proxDisciplina = state.ciclo_estudos[i]
          proxDisciplina.idx = i
          return proxDisciplina
        }
      }
      for (let i = state.ciclo_estudos.length - 1; i >= 0; i -= 1) {
        if (state.ciclo_estudos[i].status_id === 1) {
          proxDisciplina = state.ciclo_estudos[i]
          proxDisciplina.idx = i
        }
      }
      return proxDisciplina
    },
    getCheckedHabilitarEdicaoCiclo: state => state.checkedHabilitarEdicaoCiclo,
    getSelectedAreaCicloInsert: state => state.selectedAreaCicloInsert,
    getSelectedConcursoCicloInsert: state => state.selectedConcursoCicloInsert,
    getNovoConcursoInsert: state => state.novoConcursoInsert,
    getNovoCicloPorAreaInsert: state => state.novoCicloPorAreaInsert,
    getNovoCicloPorConcursoInsert: state => state.novoCicloPorConcursoInsert,
  },
  mutations: {
    CHECK_EDITAR_CICLO(state){
      state.checkedHabilitarEdicaoCiclo = !state.checkedHabilitarEdicaoCiclo
    },
    ZERAR_CICLO(state) {
      state.ciclo_estudos = []
    },
    ATUALIZAR_HORAS_CORRIDAS_DISCIPLINA(state, array) {
      const [idx, horasCorridas] = array
      state.ciclo_estudos[idx].horas_corridas = horasCorridas
    },
    ATUALIZAR_DISCIPLINA_DRAG(state, json) {
      state.minhas_disciplinas[json.disciplinaIndex].horas = json.horas
      state.minhas_disciplinas[json.disciplinaIndex].afinidade = json.afinidade
    },
    ATUALIZAR_DISCIPLINA_CICLO(state, json) {
      state.ciclo_estudos[json.disciplinaIndex].horas = json.horas
      state.ciclo_estudos[json.disciplinaIndex].horas_corridas = json.horas_corridas
      // state.ciclo_estudos[json.disciplinaIndex].afinidade = json.afinidade
    },
    ATUALIZAR_INDEX_DISCIPLINA_CICLO(state, array)
    {
      const [idx, id] = array
      state.ciclo_estudos[idx].id = id;
    },
    ALTERAR_STATUS_DISCIPLINA(state, array) {
      const [idx, novoStatus] = array
      console.log(state.ciclo_estudos[idx])
      state.ciclo_estudos[idx].status_id = novoStatus
    },
    REMOVER_DISCIPLINA(state, idx) {
      state.ciclo_estudos.splice(idx, 1)
    },
    TOGGLE_MODAL(state, idx) {
      state.modal.show = !state.modal.show
      if (state.modal.show) {
        state.modal.afinidade = state.ciclo_estudos[idx].afinidade
        state.modal.horas = state.ciclo_estudos[idx].hora
        state.modal.titulo = state.ciclo_estudos[idx].nome
      }
    },
    AJUSTAR_INDICES(state) {
      for (let i = 0; i < state.ciclo_estudos.length; i += 1) {
        state.ciclo_estudos[i].idx = i
      }
    },
    MUDAR_HORA(state, array) {
      const [idx, novaHora] = array
      state.minhas_disciplinas[idx].horas = novaHora
    },
    READICIONAR_DISCIPLINA(state, disciplina) {
      console.log(state.todas_disciplinas.length)
      state.todas_disciplinas.splice(3, 0, disciplina)
    },
    ADICIONAR_DISCIPLINA(state, disciplina) {
      state.ciclo_estudos.splice(state.ciclo_estudos.length, 0, disciplina)
    },
    CRO_MUDAR_HORA(state, novaHora) {
      state.contador.hh = novaHora
    },
    CRO_MUDAR_MINUTO(state, novoMinuto) {
      state.contador.mm = novoMinuto
    },
    CRO_MUDAR_SEGUNDO(state, novoSegundo) {
      state.contador.ss = novoSegundo
    },
    CRO_ZERAR(state) {
      state.contador.hh = '00'
      state.contador.mm = '00'
      state.contador.ss = '00'
    },
    PAUSE(state) {
      clearInterval(state.cron)
      state.selecionado = 'pausado'
    },
    SET_HORAS_CORRIDAS(state, horasCorridas) {
      const [hora, minuto, segundo] = horasCorridas.split(':')
      state.contador.ss = segundo
      state.contador.mm = minuto
      state.contador.hh = hora
    },
    SET_SELECTED_AREA_CICLO(state, areaId){
      state.selectedAreaCicloInsert = areaId
    },
    SET_SELECTED_CONCURSO_CICLO(state, concursoId){
      state.selectedConcursoCicloInsert = concursoId
    },
    SET_NOVO_CONCURSO_DATA(state, novoConcursoData){
      state.novoConcursoInsert = novoConcursoData
    },
    SET_NOVO_CICLO_POR_AREA_DATA(state, novoCicloData){
      state.novoCicloPorAreaInsert = novoCicloData
    },
    SET_NOVO_CICLO_POR_CONCURSO_DATA(state, novoCicloData){
      state.novoCicloPorConcursoInsert = novoCicloData
    },
  },
  actions: {
    atualizarDisciplina({ state }, array) {
      const [idx, id] = array
      const user = getUserData();
      console.log(state.ciclo_estudos[idx]);
      axios.put(`ciclos/${id}/disciplinas/edit`, { disciplina: state.ciclo_estudos[idx] })
        .then(resposta => { console.log(resposta) })
        .catch(resposta => { console.log(resposta) })
    },
    deletarDisciplina({ commit }, array) {
      const [idx, disciplinaId, cicloId] = array
      axios.put(`ciclos/${cicloId}/disciplinas/${disciplinaId}/destroy`)
        .then(() => { commit('REMOVER_DISCIPLINA', idx) })
        .catch(resposta => { console.log(resposta) })
    },
  },
}