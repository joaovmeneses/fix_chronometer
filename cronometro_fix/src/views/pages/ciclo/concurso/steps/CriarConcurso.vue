<template>
	<b-container>
		<b-container fluid>
			<h1>Nome</h1>
			<b-row>
				<b-col>
					<b-form-input
						:disabled="disbleNome"
						placeholder="Nome do concurso"
						v-model="concursoNome"
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
		concursoExists: false,
		concursos: [],
		concursoNome: null,
		disbleNome: false,
	}),
	methods: {
		getAllConcursos() {
			this.$http.get("ciclos/concursos/all").then((response) => {
				this.concursos = response.data;
			});
		},
        setNomeConcurso(){
			this.$http.post('ciclos/store', { nome: this.concursoNome }).then( response => {
				this.disbleNome = true
				let id = response.data
				this.cicloId = id
				this.$emit("can-continue", { value: true });
				store.commit('controller/SET_NOVO_CONCURSO_DATA', {
					nome: this.concursoNome,
					cicloId: this.cicloId
				})
				console.log(store.getters['controller/getNovoConcursoInsert'])
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
	},
	created() {
		this.getAllConcursos()
	},
};
</script>

<style>
</style>