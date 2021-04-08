export const GSHEET_NAME = "idSheet-Lysed";

export const VALUES_TITLE = "Mesures sur le territoire - 2030";
export const RESULTS_TITLE = "Impacts sur le territoire - 2030";

export const RESULTS_SAMPLE_DISPLAY = [
  {
    key: "climate",
    subtitle: "Émissions Totales",
    title: "Climat",
    graphType: "Chart",
    priority: "main",
    graphYMaximum: 150,
    indicatorObjectives: -40
  },
  {
    key: "energy",
    subtitle: "Consommation",
    title: "Energie",
    graphType: "Compo",
    priority: "main",
    graphYMaximum: 700,
    indicatorObjectives: -20
  },
  { key: "air", title: "Qualité de l'air et consommation foncière", graphType: null, priority: "secondary", indicatorObjectives: [-60, -50, -40] },
];
