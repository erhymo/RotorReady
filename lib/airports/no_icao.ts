export type Airport = { icao: string; name: string; lat: number; lon: number };

// Norway ICAO airports (subset, enough for nearest-5 logic)
export const NO_AIRPORTS: Airport[] = [
  { icao: "ENGM", name: "Oslo/Gardermoen", lat: 60.1939, lon: 11.1004 },
  { icao: "ENBR", name: "Bergen/Flesland", lat: 60.2934, lon: 5.2181 },
  { icao: "ENZV", name: "Stavanger/Sola", lat: 58.8767, lon: 5.6378 },
  { icao: "ENVA", name: "Trondheim/Værnes", lat: 63.4578, lon: 10.9240 },
  { icao: "ENBO", name: "Bodø", lat: 67.2692, lon: 14.3653 },
  { icao: "ENTC", name: "Tromsø/Langnes", lat: 69.6766, lon: 18.9189 },
  { icao: "ENKR", name: "Kirkenes/Høybuktmoen", lat: 69.7258, lon: 29.8913 },
  { icao: "ENAL", name: "Ålesund/Vigra", lat: 62.5625, lon: 6.1197 },
  { icao: "ENCN", name: "Kristiansand/Kjevik", lat: 58.2042, lon: 8.0854 },
  { icao: "ENTO", name: "Sandefjord/Torp", lat: 59.1867, lon: 10.2586 },
  { icao: "ENHD", name: "Haugesund/Karmøy", lat: 59.3453, lon: 5.2084 },
  { icao: "ENML", name: "Molde/Årø", lat: 62.7447, lon: 7.2625 },
  { icao: "ENKB", name: "Kristiansund/Kvernberget", lat: 63.1117, lon: 7.8245 },
  { icao: "ENEV", name: "Evenes/Harstad–Narvik", lat: 68.4913, lon: 16.6781 },
  { icao: "ENMS", name: "Mosjøen/Kjærstad", lat: 65.7840, lon: 13.2172 },
  { icao: "ENRO", name: "Røros", lat: 62.5784, lon: 11.3423 },
  { icao: "ENHF", name: "Hammerfest", lat: 70.6797, lon: 23.6689 },
  { icao: "ENNA", name: "Lakselv/Banak", lat: 70.0688, lon: 24.9735 },
  { icao: "ENBV", name: "Berlevåg", lat: 70.8714, lon: 29.0356 },
  { icao: "ENDU", name: "Bardufoss", lat: 69.0558, lon: 18.5403 },
  { icao: "ENAT", name: "Alta", lat: 69.9761, lon: 23.3717 },
  { icao: "ENSD", name: "Sandane/Anda", lat: 61.8300, lon: 6.1050 },
  { icao: "ENOV", name: "Ørsta–Volda/Hovden", lat: 62.1800, lon: 6.0740 },
  { icao: "ENFL", name: "Florø", lat: 61.5836, lon: 5.0247 },
  { icao: "ENMH", name: "Mehamn", lat: 71.0297, lon: 27.8267 }
];

