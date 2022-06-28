<template>
	<b-container>
		<b-container fluid>
			<h1>Nome</h1>
			<b-row>
				<b-col>
					<b-form-input
						placeholder="Nome do concurso"
						v-model="concursoNome"
						:disabled="disbleNome"
					></b-form-input>
				</b-col>
			</b-row>
		</b-container>
	</b-container>
</template>

<script>
import {
	BRow,
	BCol,
	BButton,
	BFormInput,
	BContainer,
	BFormCheckbox,
} from "bootstrap-vue";

import store from '@/store'
export default {
	components: {
		BRow,
		BCol,
		BButton,
		BFormInput,
		BContainer,
		BFormCheckbox,
	},
	data: () => ({
		disbleNome: false,
		concursoNome: null,
		timeDigitando: null,
		cicloId: null
	}),
	methods: {
        setNomeConcurso(){
			this.$http.post('ciclos/store', { nome: this.concursoNome }).then( response => {
				this.disbleNome = true
				let id = response.data
				this.cicloId = id
				this.$emit("can-continue", { value: true });
				let concursoData = store.getters['controller/getNovoCicloPorConcursoInsert']
				store.commit('controller/SET_NOVO_CICLO_POR_CONCURSO_DATA', {
					...concursoData,
					nome: this.concursoNome,
					cicloId: this.cicloId
				})
				console.log(store.getters['controller/getNovoCicloPorConcursoInsert'])
				console.log(this.cicloId)
			})
		}
	},
	watch: {
		concursoNome () {
			clearTimeout(this.timeDigitando);
			if (this.concursoNome &&  this.concursoNome != '') {
				this.timeDigitando = setTimeout(() => {
					this.setNomeConcurso()
				}, 2000)
			}else{
                this.$emit("can-continue", { value: false });
            }
		},
	}
};
</script>

<style>
</style>