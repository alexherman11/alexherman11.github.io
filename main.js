import './webmap-style.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {fromLonLat} from 'ol/proj.js';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import CircleStyle from 'ol/style/Circle.js';

// Approximate lon/lat coords for each city.
const cityData = [
  {
    name: 'Ashley: Santa Maria, CA',
    coords: [-120.4357, 34.9530],
    color: 'red',
  },
  {
    name: 'Alex Herman: Santa Cruz, CA',
    coords: [-122.0308, 36.9741],
    color: 'green',
  },
  {
    name: 'Dave: Orlando, FL',
    coords: [-81.3792, 28.5383],
    color: 'blue',
  },
  {
    name: 'Andrew: Camas, WA',
    coords: [-122.3995, 45.5870],
    color: 'orange',
  },
  {
    name: 'Mason: Golden, CO',
    coords: [-105.2211, 39.7555],
    color: 'purple',
  },
  {
    name: 'Geneva: Los Alamitos, CA',
    coords: [-118.0728, 33.8032],
    color: 'cyan',
  },
  {
    name: 'Thomas: Marina, CA',
    coords: [-121.8022, 36.6844],
    color: 'pink',
  }
];

// Create one Feature per city, each with its own style.
const features = cityData.map((city) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(city.coords)),
    name: city.name,
  });
  
  // Set a unique circle color on each feature
  feature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: city.color,
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2,
        }),
      }),
    })
  );
  return feature;
});

// Create a vector source and layer with our city features
const citySource = new VectorSource({
  features: features,
});

const cityLayer = new VectorLayer({
  source: citySource,
});

// Create the map, centered roughly over the United States
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    cityLayer,
  ],
  view: new View({
    center: fromLonLat([-95, 38]),  // center on U.S.
    zoom: 4,
  }),
});
