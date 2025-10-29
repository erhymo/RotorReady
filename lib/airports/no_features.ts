export type AirportFeatures = {
  runways?: string[]; // e.g. ["01L/19R", "01R/19L"]
  ils?: boolean;
  rnp?: boolean;
};

export const NO_AIRPORT_FEATURES: Record<string, AirportFeatures> = {
  ENGM: { runways: ["01L/19R", "01R/19L"], ils: true, rnp: true },
  ENBR: { runways: ["17/35"], ils: true, rnp: true },
  ENZV: { runways: ["18/36", "11/29"], ils: true, rnp: true },
  ENVA: { runways: ["09/27"], ils: true, rnp: true },
  ENBO: { runways: ["07/25"], ils: true, rnp: true },
  ENTC: { runways: ["01/19"], ils: true, rnp: true },
  ENAL: { runways: ["07/25"], ils: true, rnp: true },
  ENCN: { runways: ["03/21"], ils: true, rnp: true },
  ENTO: { runways: ["18/36"], ils: true, rnp: true },
  ENHD: { runways: ["13/31"], ils: true, rnp: true },
  ENML: { runways: ["07/25"], ils: true, rnp: true },
  ENKB: { runways: ["07/25"], ils: true, rnp: true },
  ENEV: { runways: ["17/35"], ils: true, rnp: true },
  // The following entries have partial/placeholder details for now
  ENKR: { runways: ["06/24"], ils: true, rnp: true },
  ENMS: { runways: ["14/32"], rnp: true },
  ENRO: {},
  ENHF: {},
  ENNA: {},
  ENBV: {},
  ENDU: {},
  ENAT: {},
  ENSD: {},
  ENOV: {},
  ENFL: {},
  ENMH: {},
};

