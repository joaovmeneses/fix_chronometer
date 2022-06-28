<template>
	<b-container>
		<b-container fluid>
			<h1>Afinidade</h1>
			<b-row>
				<b-col v-if="afinidadeSelected">
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
								value=1
							></b-form-radio>
						</template>
						<template #cell(intermediario)="data">
							<b-form-radio
								@input="afinidadeSelectedCheck(data)"
								v-model="
									afinidadeSelected[data.index].afinidade
								"
								:name="'iniciante' + data.index"
								value=2
							></b-form-radio>
						</template>
						<template #cell(avancado)="data">
							<b-form-radio
								@input="afinidadeSelectedCheck(data)"
								v-model="
									afinidadeSelected[data.index].afinidade
								"
								:name="'iniciante' + data.index"
								value=3
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
			{ key: "disciplina", label: "Disciplina" },
			{ key: "iniciante", label: "Iniciante" },
			{ key: "intermediario", label: "Intermediário" },
			{ key: "avancado", label: "Avançado" },
		],
		disciplinas: [],
		afinidadeSelected: null,
		cicloId: null,
		concursoId: null,
		cargoId: null
	}),
	methods: {
		async getDisciplinasCargo() {
			const ciclo = store.getters['controller/getNovoCicloPorConcursoInsert']
			this.cicloId = await ciclo.cicloId
			this.concursoId = await ciclo.concursoId
			this.cargoId = await ciclo.cargoId
			
			await this.$http
				.get(`ciclos/${this.cicloId}/concursos/${this.concursoId}/cargos/${this.cargoId}/disciplinas`)
				.then((response) => {
					this.afinidadeSelected = response.data.map((disciplina) => {
						return {
							afinidade: null,
							disciplina_id: disciplina.id,
						};
					});
					this.disciplinas = response.data;
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
					let concursoData = store.getters['controller/getNovoCicloPorConcursoInsert']
					store.commit('controller/SET_NOVO_CICLO_POR_CONCURSO_DATA', {
						...concursoData,
						horas_ciclo: this.afinidadeSelected.length <= 12 ? 24 : 36,
						afinidade: this.afinidadeSelected
					})
					console.log(store.getters['controller/getNovoCicloPorConcursoInsert'])
				}
			}
		},
	},
	created() {
		this.getDisciplinasCargo()

		this.$root.$on('change-cargo-id', () => {
			this.getDisciplinasCargo()
		})
	},
};
</script>

<style>
</style>