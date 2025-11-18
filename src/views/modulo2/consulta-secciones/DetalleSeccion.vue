<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Detalle de Sección</span>
        <v-btn
          color="primary"
          prepend-icon="ri-file-list-3-line"
          @click="irACalificaciones"
        >
          Gestionar Calificaciones
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <div><strong>Jornada:</strong> {{ detalle.jornada }}</div>
            <div><strong>Código:</strong> {{ detalle.codigo }}</div>
            <div><strong>Estado:</strong> {{ detalle.estado }}</div>
            <div><strong>Grado:</strong> {{ detalle.grado }}</div>
            <div><strong>Año Lectivo:</strong> {{ detalle.anio_lectivo }}</div>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="materiaSeleccionada"
              :items="materias"
              label="Materia"
              item-title="nombre"
              item-value="id"
              @update:modelValue="cambiarMateria"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="trimestreSeleccionado"
              :items="trimestres"
              label="Trimestre"
              item-title="text"
              item-value="value"
              @update:modelValue="cambiarMateria"
            />
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div>
          <h3>Alumnos</h3>
          <v-data-table :headers="headersAlumnos" :items="detalle.alumnos || []" class="mb-4">
            <template v-slot:header.id>
              <span>ID</span>
            </template>
            <template v-slot:header.nombre>
              <span>Nombre</span>
            </template>
            <template v-slot:header.apellido>
              <span>Apellido</span>
            </template>
            <template v-slot:header.email>
              <span>Correo</span>
            </template>
          </v-data-table>
        </div>
        <div>
          <h3>Calificaciones ({{ materiaSeleccionada ? (materias.find(m => m.id === materiaSeleccionada)?.nombre || '') : '' }})</h3>
          <v-data-table :headers="headersCalificaciones" :items="calificacionesMateria" class="mb-4">
            <template v-slot:header.alumno>
              <span>Alumno</span>
            </template>
            <template v-slot:header.nota>
              <span>Nota</span>
            </template>
          </v-data-table>
        </div>
        <!-- Asistencia temporalmente oculta -->
        <!--
        <div>
          <h3>Asistencia</h3>
          <v-data-table :headers="headersAsistencia" :items="asistenciasMapeadas">
            <template v-slot:header.alumno>
              <span>Alumno</span>
            </template>
            <template v-slot:header.fecha>
              <span>Fecha</span>
            </template>
            <template v-slot:header.estado>
              <span>Estado</span>
            </template>
          </v-data-table>
        </div>
        -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'DetalleSeccion',
  data() {
    return {
      detalle: {},
      materias: [],
      materiaSeleccionada: null,
      trimestreSeleccionado: 'todos',
      trimestres: [
        { value: 'todos', text: 'Todos los trimestres' },
        { value: 1, text: '1er Trimestre' },
        { value: 2, text: '2do Trimestre' },
        { value: 3, text: '3er Trimestre' }
      ],
      calificacionesMateria: [],
      asistenciasMapeadas: [],
      headersAlumnos: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Correo', value: 'email' }
      ],
      headersCalificaciones: [
  { text: 'Alumno', value: 'alumno' },
  { text: 'Nota', value: 'nota' }
      ],
      headersAsistencia: [
  { text: 'Alumno', value: 'alumno' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Estado', value: 'estado' }
      ]
    }
  },
  async created() {
  const id = this.$route.params.id;
  const response = await axios.get(`http://localhost:8000/api/secciones/${id}/detalle`);
  this.detalle = response.data;
  
  // Filtrar alumnos únicos (eliminar duplicados por ID)
  if (this.detalle.alumnos && Array.isArray(this.detalle.alumnos)) {
    const alumnosUnicos = [];
    const idsVistos = new Set();
    
    this.detalle.alumnos.forEach(alumno => {
      if (!idsVistos.has(alumno.id)) {
        idsVistos.add(alumno.id);
        alumnosUnicos.push(alumno);
      }
    });
    
    this.detalle.alumnos = alumnosUnicos;
  }
  
  // Cargar todas las materias desde el endpoint global
  const materiasResp = await axios.get('http://localhost:8000/api/materias');
  this.materias = materiasResp.data || [];
  this.materiaSeleccionada = this.materias.length ? this.materias[0].id : null;
  this.actualizarCalificaciones();
  // Asistencia temporalmente deshabilitada
  // this.actualizarAsistencias();
  },
  methods: {
    cambiarMateria() {
      this.actualizarCalificaciones();
    },
    actualizarCalificaciones() {
      if (this.detalle.alumnos && this.materiaSeleccionada) {
        const materiaId = Number(this.materiaSeleccionada);
        console.log('Materia seleccionada:', materiaId);
        console.log('Trimestre seleccionado:', this.trimestreSeleccionado);
        console.log('Alumnos:', this.detalle.alumnos);
        console.log('Calificaciones:', this.detalle.calificaciones);
        
        this.calificacionesMateria = this.detalle.alumnos.map(alumno => {
          // Filtrar calificaciones por materia y opcionalmente por trimestre
          let calificacionesFiltradas = (this.detalle.calificaciones || []).filter(c => 
            c.alumno_id === alumno.id && Number(c.materia_id) === materiaId
          );
          
          // Si hay trimestre seleccionado (y no es 'todos'), filtrar también por trimestre
          if (this.trimestreSeleccionado && this.trimestreSeleccionado !== 'todos') {
            calificacionesFiltradas = calificacionesFiltradas.filter(c => 
              c.trimestre === this.trimestreSeleccionado
            );
          }
          
          const nota = calificacionesFiltradas[0]; // Tomar la primera que coincida
          console.log(`Alumno ${alumno.id}: nota encontrada`, nota);
          
          return {
            alumno: `${alumno.nombre} ${alumno.apellido}`,
            nota: nota ? nota.valor : ''
          };
        });
      } else {
        this.calificacionesMateria = [];
      }
    },
    actualizarAsistencias() {
      if (this.detalle.asistencias && this.detalle.alumnos) {
        this.asistenciasMapeadas = this.detalle.asistencias.map(a => {
          const alumno = this.detalle.alumnos.find(al => al.id === a.alumno_id);
          return {
            alumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : a.alumno_id,
            fecha: a.fecha,
            estado: a.estado
          };
        });
      } else {
        this.asistenciasMapeadas = [];
      }
    },
    irACalificaciones() {
      // Navegar a Calificar Actividades con filtros pre-aplicados
      this.$router.push({
        path: '/calificaciones/calificar',
        query: {
          anio_lectivo: this.detalle.anio_lectivo,
          grado: this.detalle.grado,
          codigo: this.detalle.codigo
        }
      })
    }
  }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
