const margin = { top: 50, right: 220, bottom: 100, left: 100 };
const width = 1600 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Append SVG to the chart div
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define color mapping for each country
const countryColors = {
  Austria: "#000000",
  Belgium: "#080000",
  Canada: "#100000",
  Czechia: "#180000",
  Denmark: "#200000",
  Estonia: "#280000",
  Finland: "#300000",
  France: "#380000",
  Germany: "#400000",
  Greece: "#480000",
  Hungary: "#500000",
  Iceland: "#580000",
  Ireland: "#600000",
  Israel: "#680000",
  Italy: "#700000",
  Latvia: "#780000",
  Lithuania: "#800000",
  Luxembourg: "#880000",
  Netherlands: "#900000",
  "New Zealand": "#980000",
  Norway: "#A00000",
  Poland: "#A80000",
  Portugal: "#B00000",
  "Slovak Republic": "#B80000",
  Slovenia: "#C00000",
  Spain: "#C80000",
  Sweden: "#D00000",
  Switzerland: "#D80000",
  Turkiye: "#E00000",
  "United Kingdom": "#E80000",
  "United States": "#F00000",
};

// Load CSV data
d3.csv("./Datasets/changes/low.csv").then(function (data) {
  // Extract years from the data
  const years = data.columns.slice(1);

  // Set initial year index
  let yearIndex = 0;

  // Define x scale
  const xScaleLow = d3.scaleLinear().domain([0, 100]).range([0, width]);

  // Define y scale
  const yScaleLow = d3
    .scaleBand()
    .domain(data.map((d) => d.Country))
    .range([height, 0])
    .padding(0.1);

  // Draw x axis with percentage format
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleLow).tickFormat((d) => d + "%"));

  // Draw y axis
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScaleLow));

  // Add x axis label
  svg
    .append("text")
    .attr("class", "x-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 40)
    .attr("text-anchor", "middle")
    .text(
      "Good/very good health, total aged 15+, Lowest Income (% of population)"
    )
    .attr("font-weight", "bold")
    .attr("font-size", "18px");

  // Add y axis label
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("OECD Countries")
    .attr("font-weight", "bold")
    .attr("font-size", "18px");

  // Define update function
  function updateLow() {
    // Get data for the current year
    const yearData = data.map((d) => ({
      country: d.Country,
      value: +d[years[yearIndex]],
    }));

    // Update y positions of bars for each country
    yScaleLow.domain(yearData.map((d) => d.country));

    // Update bars
    const bars = svg.selectAll(".bar").data(yearData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScaleLow(d.country))
      .attr("width", (d) => xScaleLow(d.value))
      .attr("height", yScaleLow.bandwidth())
      .attr("fill", (d) => countryColors[d.country])
      .merge(bars)
      .transition()
      .duration(500) // Transition duration for bars
      .ease(d3.easeLinear) // Linear easing for smooth effect
      .attr("x", 0)
      .attr("width", (d) => xScaleLow(d.value))
      .attr("y", (d) => yScaleLow(d.country))
      .attr("height", yScaleLow.bandwidth());

    bars.exit().remove();

    // Remove old text labels
    svg.selectAll(".label").remove();

    // Add text labels to bars with transition
    const labels = svg.selectAll(".label").data(yearData, (d) => d.country);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScaleLow(d.value) + 5)
      .attr("y", (d) => yScaleLow(d.country) + yScaleLow.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .text((d) => d.value.toFixed(2) + "%")
      .merge(labels)
      .transition()
      .duration(1500) // Transition duration for labels (same as bars)
      .ease(d3.easeLinear) // Linear easing for smooth effect
      .delay(1500) // Delay to synchronise with bar transition
      .attr("x", (d) => xScaleLow(d.value) + 5)
      .attr("y", (d) => yScaleLow(d.country) + yScaleLow.bandwidth() / 2);

    // Update year display
    svg.selectAll(".year").remove();
    svg
      .append("text")
      .attr("class", "year")
      .attr("x", width + 100)
      .attr("y", 0 - margin.top / 2)
      .attr("dy", "1em")
      .text(years[yearIndex])
      .attr("font-weight", "bold")
      .attr("font-size", "52px");

    // Increment year index
    yearIndex = (yearIndex + 1) % years.length;
  }

  // Call update function repeatedly
  setInterval(updateLow, 3500);

  // Initial call to update function
  updateLow();
});
/* --------------------------------------------------------------- */
const margin2 = { top: 50, right: 220, bottom: 100, left: 100 };
const width2 = 1600 - margin2.left - margin2.right;
const height2 = 800 - margin2.top - margin2.bottom;

// Append SVG to the chart div
const svg2 = d3
  .select("#charthigh")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Load CSV data
d3.csv("./Datasets/changes/high.csv").then(function (data) {
  // Extract years from the data
  const years = data.columns.slice(1);

  // Set initial year index
  let yearIndex = 0;

  // Define x scale
  const xScaleHigh = d3.scaleLinear().domain([0, 100]).range([0, width2]);

  // Define y scale
  const yScaleHigh = d3
    .scaleBand()
    .domain(data.map((d) => d.Country))
    .range([height2, 0])
    .padding(0.1);

  // Draw x axis
  svg2
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleHigh).tickFormat((d) => d + "%"));

  // Draw y axis
  svg2.append("g").attr("class", "y-axis").call(d3.axisLeft(yScaleHigh));

  // Add x axis label
  svg2
    .append("text")
    .attr("class", "x-label")
    .attr("x", width2 / 2)
    .attr("y", height2 + margin2.bottom - 40)
    .attr("text-anchor", "middle")
    .text(
      "Good/very good health, total aged 15+, Highest Income (% of population)"
    )
    .attr("font-weight", "bold")
    .attr("font-size", "18px");

  // Add y axis label
  svg2
    .append("text")
    .attr("class", "y-label")
    .attr("x", -height2 / 2)
    .attr("y", -margin2.left + 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("OECD Countries")
    .attr("font-weight", "bold")
    .attr("font-size", "18px");

  // Define update function
  function updateHigh() {
    // Get data for the current year
    const yearData = data.map((d) => ({
      country: d.Country,
      value: +d[years[yearIndex]],
    }));

    // Update y positions of bars for each country
    yScaleHigh.domain(yearData.map((d) => d.country));

    // Update bars
    const bars = svg2.selectAll(".bar").data(yearData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScaleHigh(d.country))
      .attr("width", (d) => xScaleHigh(d.value))
      .attr("height", yScaleHigh.bandwidth())
      .attr("fill", (d) => countryColors[d.country])
      .merge(bars)
      .transition()
      .duration(500) // Transition duration for bars
      .ease(d3.easeLinear) // Linear easing for smooth effect
      .attr("x", 0)
      .attr("width", (d) => xScaleHigh(d.value))
      .attr("y", (d) => yScaleHigh(d.country))
      .attr("height", yScaleHigh.bandwidth());

    bars.exit().remove();

    // Remove old text labels
    svg2.selectAll(".label").remove();

    // Add text labels to bars with transition
    const labels = svg2.selectAll(".label").data(yearData, (d) => d.country);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScaleHigh(d.value) + 5)
      .attr("y", (d) => yScaleHigh(d.country) + yScaleHigh.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .text((d) => d.value.toFixed(2) + "%")
      .merge(labels)
      .transition()
      .duration(1500) // Transition duration for labels (same as bars)
      .ease(d3.easeLinear) // Linear easing for smooth effect
      .delay(1500) // Delay to synchronize with bar transition
      .attr("x", (d) => xScaleHigh(d.value) + 5)
      .attr("y", (d) => yScaleHigh(d.country) + yScaleHigh.bandwidth() / 2);

    // Update year display
    svg2.selectAll(".year").remove();
    svg2
      .append("text")
      .attr("class", "year")
      .attr("x", width2 + 100)
      .attr("y", 0 - margin2.top / 2)
      .attr("dy", "1em")
      .text(years[yearIndex])
      .attr("font-weight", "bold")
      .attr("font-size", "52px");

    // Increment year index
    yearIndex = (yearIndex + 1) % years.length;
  }

  // Call update function repeatedly
  setInterval(updateHigh, 3500);

  // Initial call to update function
  updateHigh();
});

/* --------------------------------------------------------------- */
let buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    showBarChart(button.textContent);
  });
});

// Initial setup of the SVG and axes
const margin3 = { top: 50, right: 100, bottom: 50, left: 100 };
const width3 = 1000 - margin3.left - margin3.right;
const height3 = 600 - margin3.top - margin3.bottom;

const svg3 = d3
  .select("#chart-svg")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

const x = d3.scaleLinear().domain([0, 100]).range([0, width3]);

const y = d3
  .scaleBand()
  .domain(["Lowest", "Highest"])
  .range([height3, 0])
  .padding(0.1);

svg3
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height3 + ")")
  .call(d3.axisBottom(x).tickFormat((d) => d + "%"));

svg3.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

svg3
  .append("text")
  .attr("class", "x-axis-text")
  .attr("x", width3 / 2)
  .attr("y", height3 + 40)
  .text("Percentage");

svg3
  .append("text")
  .attr("class", "y-axis-text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height3 / 1.7)
  .attr("y", -margin3.left + 20)
  .text("Income Bracket");

let yearIndex = 0;
let lowPercentages = [];
let highPercentages = [];
let years = [];
let interval;

function updateBars() {
  const selectedIndex = yearIndex % years.length;

  // Get data for the current year
  const lowValue = lowPercentages[selectedIndex] || 0;
  const highValue = highPercentages[selectedIndex] || 0;

  // Update bars and labels
  svg3
    .selectAll(".low-bar")
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("width", x(lowValue));

  svg3
    .selectAll(".high-bar")
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("width", x(highValue));

  svg3
    .selectAll(".bar-label-low")
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("x", x(lowValue) + 5)
    .text(lowValue + "%");

  svg3
    .selectAll(".bar-label-high")
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("x", x(highValue) + 5)
    .text(highValue + "%");

  // Update year label
  svg3.selectAll(".year-label").text(years[selectedIndex]);

  // Increment year index
  yearIndex++;
}

function showBarChart(country) {
  // Clear existing interval to stop updating bars
  if (interval) {
    clearInterval(interval);
  }

  // Reset yearIndex to start from the beginning
  yearIndex = 0;

  d3.csv("./Datasets/changes/low.csv").then(function (lowData) {
    d3.csv("./Datasets/changes/high.csv").then(function (highData) {
      // Filter data for the selected country
      const lowCountryData = lowData.find((d) => d.Country === country);
      const highCountryData = highData.find((d) => d.Country === country);

      // Extract years and percentages
      years = Object.keys(lowCountryData).filter((key) => key !== "Country");
      lowPercentages = years.map(
        (year) => parseFloat(lowCountryData[year]) || 0
      );
      highPercentages = years.map(
        (year) => parseFloat(highCountryData[year]) || 0
      );

      // Remove existing bars and labels
      svg3.selectAll(".bar-group").remove();
      svg3.selectAll(".year-label").remove();
      svg3.selectAll(".country-label").remove();

      const bars = svg3
        .selectAll(".bar-group")
        .data(years)
        .enter()
        .append("g")
        .attr("class", "bar-group");

      bars
        .append("rect")
        .attr("class", "low-bar")
        .attr("y", y("Lowest"))
        .attr("height", y.bandwidth())
        .attr("width", 0)
        .attr("fill", "black");

      bars
        .append("rect")
        .attr("class", "high-bar")
        .attr("y", y("Highest"))
        .attr("height", y.bandwidth())
        .attr("width", 0)
        .attr("fill", "#E00000");

      bars
        .append("text")
        .attr("class", "bar-label-low")
        .attr("x", 5)
        .attr("y", y("Lowest") + y.bandwidth() / 2 + 5)
        .attr("text-anchor", "start");

      bars
        .append("text")
        .attr("class", "bar-label-high")
        .attr("x", 5)
        .attr("y", y("Highest") + y.bandwidth() / 2 + 5)
        .attr("text-anchor", "start");

      svg3
        .append("text")
        .attr("class", "year-label")
        .attr("x", width3 + 50)
        .attr("y", -20)
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "hanging")
        .attr("font-size", "35px")
        .attr("font-weight", "bold");

      svg3
        .append("text")
        .attr("class", "country-label")
        .attr("x", width3 / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .text(country);

      // Initial call to set up the bars
      updateBars();

      // Update the bars every 2 seconds
      interval = setInterval(updateBars, 2000);
    });
  });
}
