# GRCAtlas

<p align="center">
  <img src="src/assets/logo.png" alt="GRCAtlas logo" width="600" />
</p>

  **Grafo interactivo de Gobernanza, Riesgos y Cumplimiento para empresas españolas**

  [![License: MIT](https://img.shields.io/badge/License-MIT-D4A84B?style=flat-square)](https://opensource.org/licenses/MIT)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=20232A)](https://reactjs.org/)
  [![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=flat-square)](https://reactflow.dev/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![PRs Welcome](https://img.shields.io/badge/PRs_Welcome-3FB950?style=flat-square)](http://makeapullrequest.com)
  [![Español](https://img.shields.io/badge/Español-FF4444?style=flat-square)]()

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

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React](https://reactjs.org/) | Biblioteca de interfaz de usuario |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Lenguaje principal |
| [React Flow](https://reactflow.dev/) | Visualización de grafos y diagramas interactivos |
| [Vite](https://vitejs.dev/) | Bundler y entorno de desarrollo |

## Instalación

\`\`\`bash
git clone https://github.com/tu-usuario/GRCAtlas.git
cd GRCAtlas
npm install
npm run dev
\`\`\`

## Artefactos pricipales

- `src/graph.json`: Archivo de definicion del grafo
- `utils/schema.csv`: Archivo extraido de la version original en Lucidchart
- `utils/transform.py`: Script de transformacion CSV → graph.json

## Marcos normativos incluidos

- **RGPD** — Reglamento General de Protección de Datos
- **LOPD-GDD** — Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales
- **ENS** — Esquema Nacional de Seguridad
- **LMDSI** — Ley de Medidas para Fortalecer la Ciberseguridad Nacional
- **LSSI-CE** — Ley de Servicios de la Sociedad de la Información y el Comercio Electrónico

## Contribuir

Las contribuciones son bienvenidas. Para participar:

1. Haz un **Fork** del proyecto
2. Crea una rama para tu funcionalidad (\`git checkout -b feature/nuevo-marco\`)
3. Haz commit de tus cambios (\`git commit -m 'Añade nuevo marco normativo'\`)
4. Haz push a la rama (\`git push origin feature/nuevo-marco\`)
5. Abre un **Pull Request**

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
