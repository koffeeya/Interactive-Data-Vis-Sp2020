/* CONSTANTS & GLOBALS
variables we will access or change in the rest of the code */

// Constants
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  radius = 3,
  margin = {
    top: 20,
    bottom: 50,
    left: 60,
    right: 40
  };

// Globals
let svg;
let xScale;
let yScale;
let xAxis;
let yAxis;


/* APPLICATION STATE
variable to store current state of data */
let state = {
  data: []
}


/* LOAD DATA 
load data and run the init() function */
d3.csv("../data/studentLoans.csv", d3.autotype, d => ({
  year: new Date(d.year, 0, 1),
  age: d.age_group,
  amount: +d.amount_owed,
  percent: +d.percent_of_total,
})).then(raw_data => {
  // Nest the data by year and store in state.data
  state.data = raw_data

  nested_data = d3.nest()
    .key(d => d.year)
    .key(d => d.age)
    .entries(state.data)

  init();
  console.log(state.data)
  console.log(nested_data)
  console.log("loaded!")
});



/* INITIALIZING FUNCTION 
runs one time to set up scales, axes, and UI */
function init() {

  // Scales
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.amount)])
    .range([height - margin.bottom, margin.top]);


  // Axes
  xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale);

  // UI element setup


  // SVG setup
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Amount Owed in Billions of Dollars");


  // Draw
  draw();
  console.log("initialized!")
}

/* DRAW FUNCTION
called every time the data/state is updated */
function draw() {

  // Filters

  const lineFunc = d3
    .line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.amount));

  // SVG: Enter, update, and exit
  const dot = svg
    .selectAll(".dot")
    .data(state.data, d => d.year)
    .join(
      // enter
      enter =>
      enter
      .append("circle")
      .attr("class", "dot")
      .attr("r", radius)
      .attr("cy", d => yScale(d.amount))
      .attr("cx", d => xScale(d.year)),

      // update
      update => update,

      // exit
      exit =>
      exit.call(exit =>
        exit
        .remove())

    )

    const line = svg
    .selectAll("path.trend")
    .data(state.data)
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "trend")
          .attr("d", d => lineFunc(d)),
      update => update, // pass through the update selection
      exit => exit.remove()
    )

  console.log("drawn!")
}