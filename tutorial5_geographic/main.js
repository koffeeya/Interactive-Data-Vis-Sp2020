/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = {
    top: 20,
    bottom: 50,
    left: 60,
    right: 40
  };

  const formatTime = d3.timeFormat("%b %d, %Y")

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let radiusScale;
let projection;
let path;
let div;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
  geojson: null,
  earthquakes: null
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

  projection = d3.geoNaturalEarth1().fitSize([width, height], state.geojson);
  path = d3.geoPath().projection(projection);

  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .selectAll(".land")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "land")
    .attr("fill", "white")

  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {

  radiusScale = d3.scaleSqrt()
    .domain(d3.extent(state.data, d => d.mag))
    .range([1, 20]);

  const dot = svg
    .selectAll(".circle")
    .data(state.data, d => d.id)
    .join(
      enter =>
        enter
        .append("circle")
        .attr("class", "dot")
        .attr("opacity", 0)
        .attr("r", d => radiusScale(d.mag)*3)
        .attr("transform", d => {
          const [x, y] = projection([+d.longitude, +d.latitude]);
          return `translate(${x}, ${y})`;
        })
        .on('mouseover', d => {
          div
            .transition()
            .duration(50)
            .style('opacity', 0.8);
          div
            .html(
              "<h2><strong>" + formatTime(new Date (d.date)) + "</strong></h2>" + "<p style=' font-size:14px; '><strong>" + d.place + '</strong></p>' + "<p style='color: #EF233C; font-size:18px; '><strong> Magnitude " + d.mag + '</strong>, ' + d.mag_category + '</p>' + "<p style='color: grey; font-size: 12px'> Effects (on land): " + d.mag_effects + '</p>')
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
          div
            .transition()
            .duration(100)
            .style('opacity', 0);
        }),
      update => update, // pass through the update selection
      exit => exit
      .call(exit => exit.transition()
            .remove())
    )
    .call(selection =>
      selection
        .transition(d3.easeElastic)
        //.delay(d => d.id/2)
        .delay(d => d.id/6)
        //.duration(d => d.id*1.2)
        .attr("opacity", 0.3)
        .attr("fill", "#EF233C")
        .attr("r", d => radiusScale(d.mag))
    );
}