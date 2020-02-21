/* CONSTANTS & GLOBALS
variables we will access or change in the rest of the code */

// Constants
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = {
    top: 20,
    bottom: 50,
    left: 60,
    right: 40
  },
  radius = 5;

// Globals
let svg;
let xScale;
let yScale;
let colorScale;
let div;


/* APPLICATION STATE
variable to store current state of data */
let state = {
  data: [],
  selectedGenre: "All",
  selectedAgreement: "All"
};


/* LOAD DATA 
load data and run the init() function */
d3.csv("../data/gameRatings.csv", d3.autoType).then(raw_data => {
  console.log("loaded data!");
  state.data = raw_data;
  init()
  console.log("initialized!")
});


/* INITIALIZING FUNCTION 
runs one time to set up scales, axes, and UI */
function init() {

  // Scales
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.user_score))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.critic_score))
    .range([height - margin.bottom, margin.top]);

  colorScale = d3
    .scaleOrdinal()
    .domain(d3.map(state.data, d => d.user_diff).keys())
    .range(["#044F66", "#50A1BA", "#3EA2C0"])


  // Axes
  const xAxis = (d3.axisBottom(xScale));
  const yAxis = (d3.axisLeft(yScale));


  // UI element setup
  const selectElementGenre = d3.select("#dropdown").on("change", function () {
    console.log("The new selected genre is", this.value);
    state.selectedGenre = this.value;
    draw();
  });

  const selectElementAgree = d3.select("#agree-dropdown").on("change", function () {
    console.log("The new selected agreement is", this.value);
    state.selectedAgreement = this.value;
    draw();
  });

  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  // add in dropdown options from data
  const genreArray = d3.map(state.data, d => d.genre).keys().sort()
  genreArray.unshift(["All"])

  const agreementArray = d3.map(state.data, d => d.user_diff).keys().sort()
  agreementArray.unshift(["All"])

  selectElementGenre
    .selectAll("option")
    .data(genreArray)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  selectElementAgree
    .selectAll("option")
    .data(agreementArray)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // SVG setup
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("User Rating");

  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Critic Rating");

  // Draw
  draw()
  console.log("data redrawn!")
}


/* DRAW FUNCTION
called every time the data/state is updated */
function draw() {

  // Filters
  let filteredData = state.data;

  if (state.selectedGenre !== "All" && state.selectedAgreement !== "All") {
    filteredData = state.data.filter(d => d.genre === state.selectedGenre && d.user_diff === state.selectedAgreement);
  } else if (state.selectedGenre !== "All" && state.selectedAgreement == "All") {
    filteredData = state.data.filter(d => d.genre === state.selectedGenre && "All" === state.selectedAgreement);
  } else if (state.selectedGenre == "All" && state.selectedAgreement !== "All") {
    filteredData = state.data.filter(d => "All" === state.selectedGenre && d.user_diff === state.selectedAgreement);
  }

  // SVG: Enter, update, and exit
  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.game)
    .join(

      // enter
      enter => enter
      .append("circle")
      .attr("class", "dot")
      .attr("opacity", 0)
      .attr("r", radius)
      .attr("cy", d => yScale(d.critic_score))
      .attr("cx", d => xScale(d.user_score))
      .attr("fill", "white")
      .attr("stroke", "grey")
      .attr("stroke-width", "0.01px")
      .attr("stroke-opacity", 50)
      .on('mouseover', d => {
        div
          .transition()
          .duration(50)
          .style('opacity', 0.9);
        div
          .html(
            "<h2><strong>" + d.game + "</strong></h2>" + "<p style='color: #044F66; font-size:14px; '><strong> Users and Critics " + d.user_diff + '</strong></p>' + '<p><strong> User Rating: </strong>' + d.user_score + ' / 100 </p>' + '<p><strong> Critic Rating: </strong>' + d.critic_score + ' / 100 </p>' + "<p style='color: grey;'>" + d.genre + ' | ' + d.date + '</p>')
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', () => {
        div
          .transition()
          .duration(100)
          .style('opacity', 0);
      })
      .call(enter =>
        enter
        .transition()
        .delay(d => 3 * d.user_score)
        .duration(250)
        .attr("fill", d => colorScale(d.user_diff))
        .attr("opacity", 0.65)
      ),

      // update
      update =>
      update.call(update =>
        update
        .transition()
        .delay(d => 3 * d.user_score)
        .duration(250)
        .attr("fill", d => colorScale(d.user_diff))
      ),

      // exit
      exit => exit.call(exit =>
        exit
        .transition()
        .delay(d => 3 * d.user_score)
        .duration(250)
        .attr("opacity", 0)
        .remove()
      ),

      console.log("data joined!")
    );
}