# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [Unreleased]

### Añadido
- Carpeta `utils/` con `schema.csv` y `transform.py`
- Árbol interactivo horizontal con React Flow
- Resaltado en rojo de nodos y vínculos conectados al último nodo clickado
- Panel lateral de notas que aparece solo cuando el nodo seleccionado tiene contenido
- Tipografía JetBrains Mono y paleta de colores azul oscuro
- Nodos expandidos marcados en amarillo

## [0.1.0] - 2026-06-23

### Añadido
- Estructura inicial del proyecto con Vite + React
- Script `transform.py` para convertir el esquema Lucidchart (CSV) a `graph.json`
- Visualización radial del grafo con React Flow y d3-hierarchy
- README con badges, descripción y guía de instalación
