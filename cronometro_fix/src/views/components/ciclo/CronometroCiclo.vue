<template>
  <card-basico>
    <h6 class="text-primary font-weight-bold mb-2">
      Cronômetro
    </h6>
    <b-card-text class="mb-0 font-weight-bold">
      <b-row align-h="center">
        <h2>{{ horas_corridas }}</h2>
      </b-row>
      <b-row align-h="center">
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-1"
            v-model="selecionado"
            button-variant="outline-primary"
            :options="optionsRadio"
            buttons
            name="radios-btn-default"
            @change="start_stop"
          />
        </b-form-group>
      </b-row>
    </b-card-text>
  </card-basico>
</template>

<script>
import {
  BRow, BFormRadioGroup, BFormGroup, BCardText,
} from 'bootstrap-vue'
import CardBasico from '@/views/components/card/CardBasico.vue'
import store from '@/store'
import Ripple from 'vue-ripple-directive'

export default {
  name: 'CronometroCiclo',
  components: {
    BRow,
    CardBasico,
    BFormRadioGroup,
    BFormGroup,
    BCardText,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      selecionado: 'pausado',
      optionsRadio: [
        { text: 'Ligar', value: 'rodando' },
        { text: 'Pausar', value: 'pausado' },
      ],
      horas_corridas: '00:00:00',
      cron: '',
      tempo: 1000,
    }
  },
  mounted() {
    this.$root.$on('eventing', data => {
      if (data === 'pausar') this.pausar()
      else this.start_stop()
    })
  },
  methods: {
    // Iniciar | Pausar
    start_stop() {
      if (this.selecionado === 'rodando') {
        const disciplina = store.getters['controller/getProxDisciplina']
        if (disciplina != null) {
          store.commit('controller/ALTERAR_STATUS_DISCIPLINA', [
            disciplina.idx,
            2,
          ])
          store.dispatch('controller/atualizarDisciplina', [disciplina.idx, this.$route.params.id ])
          store.commit('controller/SET_HORAS_CORRIDAS', disciplina.horas_corridas)
          this.cron = setInterval(() => {
            this.timer(disciplina)
          }, this.tempo)
        } else {
          alert('acabou ladrao')
        }
      } else {
        this.pausar()
      }
    },
    timer(disciplina) {
      const hora = store.getters['controller/getHora']
      const minuto = store.getters['controller/getMinuto']
      const segundo = store.getters['controller/getSegundo']
      // S E G U N D O S
      let ssAux = parseInt(segundo, 10)
      ssAux += 1
      store.commit('controller/CRO_MUDAR_SEGUNDO', ssAux)
      //
      if (parseInt(ssAux, 10) < 10) store.commit('controller/CRO_MUDAR_SEGUNDO', `0${ssAux}`)
      // M I N U T O S
      if (segundo >= 59) {
        store.commit('controller/CRO_MUDAR_SEGUNDO', '00')
        let mmAux = parseInt(minuto, 10)
        mmAux += 1
        store.commit('controller/CRO_MUDAR_MINUTO', mmAux)
        //
        if (parseInt(mmAux, 10) < 10) store.commit('controller/CRO_MUDAR_MINUTO', `0${mmAux}`)
        //
        store.dispatch('controller/atualizarDisciplina', [disciplina.idx, this.$route.params.id])
      }
      // H O R A S
      if (minuto >= 59) {
        store.commit('controller/CRO_MUDAR_MINUTO', '00')
        let hhAux = parseInt(hora, 10)
        hhAux += 1
        store.commit('controller/CRO_MUDAR_HORA', hhAux)
        //
        if (parseInt(hhAux, 10) < 10) store.commit('controller/CRO_MUDAR_HORA', `0${hhAux}`)
      }
      this.horas_corridas = `${store.getters['controller/getHora']}:${store.getters['controller/getMinuto']}:${store.getters['controller/getSegundo']}`
      // Atualizar horas corridas da disciplina no ciclo
      store.commit('controller/ATUALIZAR_HORAS_CORRIDAS_DISCIPLINA', [disciplina.idx, this.horas_corridas])
      // Verificar se bateu o tempo da disciplina
      this.verificarFinalCronometro(disciplina)
    },
    pausar() {
      clearInterval(this.cron)
      const indexDisciplinaRodando = this.$store.getters['controller/getIndexRodando']
      this.$store.commit('controller/ALTERAR_STATUS_DISCIPLINA', [indexDisciplinaRodando, 3])
      store.dispatch('controller/atualizarDisciplina', [indexDisciplinaRodando,  this.$route.params.id])
      this.selecionado = 3
    },
    mudarParaHorasCorridasDisciplina(horasCorridas) {
      alert(horasCorridas)
    },
    verificarFinalCronometro(disciplina) {
      const segundo = store.getters['controller/getSegundo']
      const minuto = store.getters['controller/getMinuto']
      const hora = store.getters['controller/getHora']
      const horas = this.horasToMinutos(disciplina.horas);
      const horasCorridas = this.horasToMinutos(`${hora}:${minuto}:${segundo}`);
      console.log(horas)
      console.log(horasCorridas)
      if(horasCorridas >= horas && disciplina.status_id === 2){
        this.makeToast(disciplina.nome, 'success')
        this.mudarStatusDisciplina()
      }
    },
    mudarStatusDisciplina() {
      const indexDisciplinaRodando = this.$store.getters['controller/getIndexRodando']
      store.commit('controller/ALTERAR_STATUS_DISCIPLINA', [indexDisciplinaRodando, 5])
      store.dispatch('controller/atualizarDisciplina', indexDisciplinaRodando)
      // store.commit('controller/CRO_ZERAR')
      // this.pausar()
      // return false
    },
    makeToast(nomeDisciplina, variant) {
      this.$bvToast.toast(nomeDisciplina, {
        title: 'Matéria Concluida!',
        variant,
        solid: true,
      })
    },
    minutosToHoras (minutos)
    {
      var mins_num = parseFloat(minutos, 10); // don"t forget the second param
      var hours   = Math.floor(mins_num / 60);
      var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
      var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

      // Appends 0 when unit is less than 10
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+":"+minutes+":"+seconds;
    },
    horasToMinutos(hora)
    {
      let f0 = hora.split(":");
      return ((Number(f0[0])*60)+Number(f0[1]));
    }
  },
}
</script>