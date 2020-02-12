// load in the data
d3.csv("../data/squirrelActivities.csv", d3.autoType).then(data => {
    console.log(data);


    /* CONSTANTS */
    
    // set margins of svg canvas
    const width = window.innerWidth * 0.9
    height = window.innerHeight / 2
    paddingInner = 0.2
    margin = {
        top: 40,
        bottom: 40,
        left: 80,
        right: 40
    };


    /* SCALES */

    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.activity))   // creates an array d with all unique activities in the data - the input
        .range([height - margin.bottom, margin.top])  // set y output to range from left to right margin
        .paddingInner(paddingInner);

    const xScale = d3
        .scaleLinear()  // set up a linear scale
        .domain([0, d3.max(data, d => d.count)])  // set x input values from 0 to max `count` value
        .range([margin.right, width - margin.left]);  // set x output to range from bottom to top margin

    // Set up a bottom-oriented axis, with the number of ticks
    // equal to the number of categories in the data (the length)
    const yAxis = d3.axisLeft(yScale).ticks(data.length);

    // const colorScale = d3.scale.category10()



    /* MAIN CODE */

    // create an svg canvas
    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
    // append rects
    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        // set the coordinates for the top-left corner of each rect as scaled values
        .attr("y", d => yScale(d.activity))
        .attr("x", d => xScale(margin.left))
        // set the width, height, and color of each bar
        .attr("width", d => margin.left + xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");
    
    // append text
    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        // set coordinates for label
        .attr("y", d => yScale(d.activity) + (yScale.bandwidth()/2))
        .attr("x", d => (margin.left + xScale(d.count)/2))
        .text(d => d.count);

    // update the svg element
    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);
});