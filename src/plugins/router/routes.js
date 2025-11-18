export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true }
      },  
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/usuarios',
        component: () => import('@/pages/modulo1/usuarios-roles-page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/usuarios/:id',
        component: () => import('@/pages/modulo1/perfil-usuario-page.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: '/perfil',
        component: () => import('@/pages/modulo1/mi-perfil-page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/alumnos',
        component: () => import('@/pages/modulo6/tabla-alumnos-view.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/alumnos/:id',
        component: () => import('@/pages/modulo6/perfil-alumno-page.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: 'modulo2/secciones-pages',
        component: () => import('@/pages/modulo2/secciones-pages.vue'),
      },
      {
        path: 'modulo2/consulta-secciones',
        component: () => import('@/pages/modulo2/consulta-secciones.vue'),
      },
      {
        path: 'modulo2/consulta-secciones/detalle/:id',
        component: () => import('@/pages/modulo2/consulta-secciones/detalle/[id].vue'),
      },
      {
        path: 'modulo5/matriculas',
        component: () => import('@/pages/modulo5/matriculas.vue'),
      },
      {
        path: 'calificaciones/configuracion',
        name: 'calificaciones-configuracion',
        component: () => import('@/pages/calificaciones/configuracion.vue'),
      },
      {
        path: 'calificaciones/actividades',
        name: 'calificaciones-actividades',
        component: () => import('@/pages/calificaciones/actividades.vue'),
      },
      {
        path: 'calificaciones/calificar',
        name: 'calificaciones-calificar',
        component: () => import('@/pages/calificaciones/calificar.vue'),
      },
      {
        path: 'calificaciones/notas-finales',
        name: 'calificaciones-notas-finales',
        component: () => import('@/pages/calificaciones/notas-finales.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
