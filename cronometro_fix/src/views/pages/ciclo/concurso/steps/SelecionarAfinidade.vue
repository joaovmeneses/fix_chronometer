<template>
	<b-container>
		<b-container fluid>
			<h1>Afinidade</h1>
			<b-row>
				<b-col>
					<b-table
						striped
						hover
						:items="disciplinas"
						:fields="tableHeaders"
					>
						<template #cell(iniciante)="data">
							<b-form-radio
								@input="afinidadeSelectedCheck(data)"
								v-model="
									afinidadeSelected[data.index].afinidade
								"
								:name="'iniciante' + data.index"
								value="1"
							></b-form-radio>
						</template>
						<template #cell(intermediario)="data">
							<b-form-radio
								@input="afinidadeSelectedCheck(data)"
								v-model="
									afinidadeSelected[data.index].afinidade
								"
								:name="'iniciante' + data.index"
								value="2"
							></b-form-radio>
						</template>
						<template #cell(avancado)="data">
							<b-form-radio
								@input="afinidadeSelectedCheck(data)"
								v-model="
									afinidadeSelected[data.index].afinidade
								"
								:name="'iniciante' + data.index"
								value="3"
							></b-form-radio>
						</template>
					</b-table>
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
	BFormSelect,
	BTable,
	BFormRadio,
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
		BFormSelect,
		BTable,
		BFormRadio,
	},
	data: () => ({
		tableHeaders: [
			{ key: "nome", label: "Disciplina" },
			{ key: "iniciante", label: "Iniciante" },
			{ key: "intermediario", label: "Intermediário" },
			{ key: "avancado", label: "Avançado" },
		],
		disciplinas: [],
		afinidadeSelected: null,
        aredId: false
	}),
	methods: {
		getDisciplinas() {
			let diciplinasVuexSelected = store.getters['controller/getNovoConcursoInsert']
			let disciplinasVuex = diciplinasVuexSelected.disciplinas
			console.log(disciplinasVuex)
			this.afinidadeSelected = disciplinasVuex.map((disciplina) => {
				return {
					afinidade: null,
					disciplina_id: disciplina.disciplina_id,
				};
			});
			this.$http
				.get(`disciplinas`)
				.then((response) => {
					for( let disc = 0; disc <= response.data.length; disc++){
						for(let discVuex = 0; discVuex < disciplinasVuex.length; discVuex++){

							if(response.data[disc].id == disciplinasVuex[discVuex].disciplina_id){
								this.disciplinas.push(response.data[disc])
							}

						}
					}
				});
		},
		afinidadeSelectedCheck() {
			if (this.afinidadeSelected) {
				let checkAll = this.afinidadeSelected.filter(
					(afinidadeSelected) => {
						return afinidadeSelected.afinidade == null;
					}
				);

				if (checkAll.length == 0) {
					this.$emit("can-continue", { value: true });
                    let concursoData = store.getters['controller/getNovoConcursoInsert']

					let afinidadeFormat = concursoData.questoes.map((questao, idx) => {
						return {
							...this.afinidadeSelected[idx],
							questoes: parseInt(questao.questoes),
							peso: questao.peso
						}
					})

                    store.commit('controller/SET_NOVO_CONCURSO_DATA', {
                        ...concursoData,
						horas_ciclo: this.afinidadeSelected.length <= 12 ? 24 : 36,
                        afinidade: afinidadeFormat
                    })
                    console.log(store.getters['controller/getNovoConcursoInsert'])
				}
			}
		},
	},
	mounted() {
        this.getDisciplinas();
	},
};
</script>

<style>
</style>