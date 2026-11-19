
/* =========================================
   1. PRODUCTOS
========================================= */

export const productos = [
    {
        id: 1,
        nombre: "Martillo de Acero 16oz",
        categoria: "Herramientas",
        precio: 45000,
        stock: 45,
        minimo: 10
    },
    {
        id: 2,
        nombre: "Pintura Látex Blanco 1G",
        categoria: "Pinturas",
        precio: 72000,
        stock: 8,
        minimo: 10
    },
    {
        id: 3,
        nombre: "Cinta Métrica 5m Stanley",
        categoria: "Medición",
        precio: 18000,
        stock: 32,
        minimo: 10
    },
    {
        id: 4,
        nombre: "Destornillador Phillips",
        categoria: "Herramientas",
        precio: 12000,
        stock: 7,
        minimo: 10
    },
    {
        id: 5,
        nombre: "Clavos de Hierro 2 Pulg",
        categoria: "Ferretería",
        precio: 8000,
        stock: 85,
        minimo: 15
    },
    {
        id: 6,
        nombre: "Taladro Percutor 12V",
        categoria: "Herramientas",
        precio: 185000,
        stock: 4,
        minimo: 5
    },
    {
        id: 7,
        nombre: "Llave de Paso PVC 1/2",
        categoria: "Plomería",
        precio: 9500,
        stock: 18,
        minimo: 10
    },
    {
        id: 8,
        nombre: "Broca para Concreto 1/4",
        categoria: "Herramientas",
        precio: 6500,
        stock: 0,
        minimo: 10
    }
];


/* =========================================
   2. CANALES DE VENTA
========================================= */

export const canales = [
    {
        id: 1,
        nombre: "Mostrador",
        ventas: 1250000
    },
    {
        id: 2,
        nombre: "WhatsApp",
        ventas: 850000
    },
    {
        id: 3,
        nombre: "Web",
        ventas: 520000
    }
];


/* =========================================
   3. HISTORIAL DE VENTAS
========================================= */

export const ventas = [
    {
        id: 1,
        productoId: 1,
        cantidad: 3,
        precioUnitario: 45000,
        fecha: "2026-11-01",
        canal: "Mostrador"
    },
    {
        id: 2,
        productoId: 2,
        cantidad: 2,
        precioUnitario: 72000,
        fecha: "2026-11-02",
        canal: "WhatsApp"
    },
    {
        id: 3,
        productoId: 3,
        cantidad: 5,
        precioUnitario: 18000,
        fecha: "2026-11-03",
        canal: "Web"
    },
    {
        id: 4,
        productoId: 5,
        cantidad: 10,
        precioUnitario: 8000,
        fecha: "2026-11-04",
        canal: "Mostrador"
    },
    {
        id: 5,
        productoId: 4,
        cantidad: 2,
        precioUnitario: 12000,
        fecha: "2026-11-05",
        canal: "WhatsApp"
    },
    {
        id: 6,
        productoId: 6,
        cantidad: 1,
        precioUnitario: 185000,
        fecha: "2026-11-06",
        canal: "Web"
    },
    {
        id: 7,
        productoId: 1,
        cantidad: 4,
        precioUnitario: 45000,
        fecha: "2026-11-07",
        canal: "Mostrador"
    },
    {
        id: 8,
        productoId: 7,
        cantidad: 6,
        precioUnitario: 9500,
        fecha: "2026-11-08",
        canal: "WhatsApp"
    },
    {
        id: 9,
        productoId: 3,
        cantidad: 3,
        precioUnitario: 18000,
        fecha: "2026-11-09",
        canal: "Web"
    },
    {
        id: 10,
        productoId: 5,
        cantidad: 8,
        precioUnitario: 8000,
        fecha: "2026-11-10",
        canal: "Mostrador"
    }
];
