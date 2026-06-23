# GRCAtlas

<p align="center">
  <img src="https://raw.githubusercontent.com/4nebreda/GRCAtlas/main/src/assets/logo.png" alt="GRCAtlas logo" width="600" />
</p>

<p align="center">
  <strong>Grafo interactivo de Gobernanza, Riesgos y Cumplimiento para empresas españolas</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-D4A84B?style=flat-square" alt="License: MIT" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" /></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=20232A" alt="React" /></a>
  <a href="https://reactflow.dev/"><img src="https://img.shields.io/badge/React_Flow-FF0072?style=flat-square" alt="React Flow" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs_Welcome-3FB950?style=flat-square" alt="PRs Welcome" /></a>
  <img src="https://img.shields.io/badge/Español-FF4444?style=flat-square" alt="Español" />
</p>

---

## Sobre el proyecto

GRCAtlas es una herramienta de código abierto que permite visualizar de forma interactiva los marcos de **Gobernanza, Riesgos y Cumplimiento (GRC)** aplicables a empresas españolas.

Nace de la necesidad de tener una referencia visual clara de cómo se relacionan las diferentes normativas y cómo sus controles se cruzan y complementan.

El proyecto toma como punto de partida un esquema diseñado en Lucidchart y lo transforma en una experiencia navegable construida con **React Flow**.

## Características

- 🗺️ **Mapa visual interactivo** de marcos normativos españoles construido con React Flow
- 🔗 **Relaciones entre normativas** — visualiza cómo se conectan RGPD, ENS, LOPD-GDD, LMDSI, etc.
- 📊 **Controles cruzados** — identifica requisitos que aparecen en múltiples marcos regulatorios
- 🎯 **Navegación por áreas** — filtra por gobernanza, riesgos operativos, ciberseguridad, privacidad...
- 🔧 **Extensible y modular** — añade nuevos marcos y relaciones de forma sencilla
- 🇪🇸 **Enfoque en el ecosistema normativo español**


La aplicación estará disponible en `http://localhost:5173`.

## Artefactos principales

| Archivo | Descripción |
|---|---|
| `src/graph.json` | Definición del grafo (nodos, aristas, notas) |
| `utils/schema.csv` | Exportación original desde Lucidchart |
| `utils/transform.py` | Script de transformación CSV → graph.json |

Para regenerar `graph.json` desde el CSV:

```bash
python utils/transform.py
```

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React](https://reactjs.org/) | Biblioteca de interfaz de usuario |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Lenguaje principal |
| [React Flow](https://reactflow.dev/) | Visualización de grafos y diagramas interactivos |
| [Vite](https://vitejs.dev/) | Bundler y entorno de desarrollo |

## Instalación

```bash
git clone https://github.com/4nebreda/GRCAtlas.git
cd GRCAtlas
npm install
npm run dev
```

## Changelog

Consulta [CHANGELOG.md](CHANGELOG.md) para ver el historial de cambios.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
