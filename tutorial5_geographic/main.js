/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
  geojson: null,
  earthquakes: null,
  hover: {
    latitude: null,
    longitude: null,
    state: null,
  },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  /* d3.json("../data/map_world_countries.json"), */
  d3.json("../data/world-map.geo.json"),
  d3.csv("../data/earthquakes.csv", d3.autoType),
]).then(([geojson, data]) => {
  // + SET STATE WITH DATA
    state.geojson = geojson;
    state.data = data;
  console.log("earthquakes: ", state.data);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // create an svg element in our main `d3-container` element

  // GEOJSON TO PROJECTION
  const projection = d3.geoNaturalEarth1().fitSize([width, height], state.geojson);
  const path = d3.geoPath().projection(projection);

  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + SET UP PROJECTION
  svg
    .selectAll(".land")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "land")
    .attr("fill", "white")
    draw();

  // + SET UP GEOPATH

  svg
    .selectAll(".circle")
    .data(state.data)
    .join("circle")
    .attr("r", 4)
    .attr("fill", "green")
    .attr("opacity", 0.4)
    .attr("transform", d => {
      const [x, y] = projection([+d.longitude, +d.latitude]);
      return `translate(${x}, ${y})`;
    });

  // + DRAW BASE MAP PATH
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
}
