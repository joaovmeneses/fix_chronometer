<template>
	<b-container>
		<b-container fluid>
			<h1>Questões</h1>
			<b-row>
				<b-col>
					<b-table
						striped
						hover
						:items="disciplinasCadastro"
						:fields="tableHeaders"
					>   
                        <template #cell(disciplina)="data">
							<h5 >{{disciplinaNome(disciplinasCadastro[data.index].disciplina_id)}}</h5>
						</template>
						<template #cell(questoes)="data">
							<b-form-input type="number" v-model="disciplinasCadastro[data.index].questoes"></b-form-input>
						</template>
                        <template #cell(peso)="data">
							<b-form-input type="number" v-model="disciplinasCadastro[data.index].peso"></b-form-input>
						</template>
					</b-table>
				</b-col>
			</b-row>
            <!-- <b-row>
                <b-col>
                    <b-button variant="primary" @click="addDisciplina()">Adicionar disciplina</b-button>
                </b-col>
            </b-row> -->
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
    BTable
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
        BTable
	},
	data: () => ({
		tableHeaders: [
			{ key: "disciplina", label: "Disciplina" },
			{ key: "questoes", label: "Questões", tdClass: 'width-quantidade' },
            { key: "peso", label: "Peso", tdClass: 'width-quantidade' },
		],
		disciplinasCadastro: [],
        disciplinas: []
	}),
	methods: {
        getAllDisciplinas(){
            this.$http.get('disciplinas').then( response => {
                this.disciplinas = response.data
            })

			let diciplinasVuexSelected = store.getters['controller/getNovoConcursoInsert']
			diciplinasVuexSelected.disciplinas.map( disciplina => {
				this.disciplinasCadastro.push(
                	{ 
						disciplina_id: disciplina.disciplina_id,
						questoes: null, 
						peso: 1
					}
            	)
			})
        },
        addDisciplina(){
            this.disciplinasCadastro.push(
                { disciplina_id: null, questoes: null, peso: 1}
            )
        },
		disciplinaNome(disciplina_id){
			let disciplina = this.disciplinas.find( disciplina => disciplina.id == disciplina_id )
			return disciplina.nome
		}
	},
    watch: {
        disciplinasCadastro () {
            if(this.disciplinasCadastro.length >= 1){
                this.$emit("can-continue", { value: true });
                let concursoData = store.getters['controller/getNovoConcursoInsert']
				store.commit('controller/SET_NOVO_CONCURSO_DATA', {
					...concursoData,
					questoes: this.disciplinasCadastro
				})
				console.log(store.getters['controller/getNovoConcursoInsert'])
            }
        }
    },
	mounted() {
        this.getAllDisciplinas()
	},
};
</script>

<style>
    .width-quantidade{
        width: 100px;
    }
</style>