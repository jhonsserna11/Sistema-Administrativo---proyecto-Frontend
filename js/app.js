
/* =========================================
   APLICACIÓN PRINCIPAL
========================================= */

// Importar componente lateral
import { renderSidebar } from "./components/sidebar.js";

// Importar pantallas
import { renderDashboard } from "./pages/dashboard.js";
import { renderVentas } from "./pages/ventas.js";
import { renderInventario } from "./pages/inventario.js";
import { renderReportes } from "./pages/reportes.js";


/* =========================================
   CONFIGURACIÓN DE PANTALLAS
========================================= */

const pages = {

    dashboard: {
        title: "Panel Principal",
        render: renderDashboard
    },

    ventas: {
        title: "Ventas",
        render: renderVentas
    },

    inventario: {
        title: "Inventario",
        render: renderInventario
    },

    reportes: {
        title: "Reportes",
        render: renderReportes
    }

};


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const sidebarContainer = document.getElementById("sidebar-container");
const pageContainer = document.getElementById("page-container");
const pageTitle = document.getElementById("page-title");


/* =========================================
   ESTADO DE LA APLICACIÓN
========================================= */

let activePage = "dashboard";


/* =========================================
   NAVEGACIÓN
========================================= */

function navigateTo(page) {

    // Verificar que la pantalla exista
    if (!pages[page]) {
        return;
    }

    activePage = page;

    renderApp();

}


/* =========================================
   RENDERIZADO PRINCIPAL
========================================= */

function renderApp() {

    const currentPage = pages[activePage];

    // Actualizar título
    pageTitle.textContent = currentPage.title;

    // Renderizar menú lateral
    renderSidebar(
        sidebarContainer,
        activePage,
        navigateTo
    );

    // Renderizar pantalla seleccionada
    currentPage.render(pageContainer);

}


/* =========================================
   INICIALIZACIÓN
========================================= */

renderApp();
