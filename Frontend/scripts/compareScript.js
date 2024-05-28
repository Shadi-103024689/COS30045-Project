var color = d3.scaleOrdinal()
.domain(["bottomQuintile", "topQuintile"])
.range(["#32c6b5", "#ff7f0e"]);

var height = 350;
var width = 350;
var padding = 60;

function fetchData(country, callback) {
d3.csv("HealthStatusOECD.csv", function (d) {
    return {
        year: +d.Year,
        bottomQuintile: d[country + "BQ"] !== ".." ? +d[country + "BQ"] : null,
        topQuintile: d[country + "TQ"] !== ".." ? +d[country + "TQ"] : null,
    };
}).then(callback).catch(function (error) {
    console.error('Error loading or parsing data:', error);
});
}

function updateChart(chartId, country) {
fetchData(country, function (data) {
    console.log(`Updating ${chartId} for ${country}`);
    d3.select(`#${chartId}`).html(""); // Clear existing content

    var svg = d3.select(`#${chartId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([padding, width - padding]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale).ticks(5));

    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - padding, padding]);

    svg.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yScale));

    // Append Y Axis Title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2) + 10)
        .attr("dy", "1em")
        .attr("font-family", "Arial")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Percentage with perceived 'good' health status");

    // Append X Axis Title
    svg.append("text")
        .attr("y", height - (padding / 2))
        .attr("x", width / 2)
        .attr("dy", "1em")
        .attr("font-family", "Arial")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Year");

    // Append a legend to the top of the SVG
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

    legend.selectAll("rect")
        .data(["topQuintile", "bottomQuintile"])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (d, i) { return i * 20; })
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color);

    legend.selectAll("text")
        .data(["Top Quintile", "Bottom Quintile"])
        .enter()
        .append("text")
        .attr("x", 15)
        .attr("y", function (d, i) { return i * 20 + 6; })
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .text(function (d) { return d; });

    ["bottomQuintile", "topQuintile"].forEach(function (quintile) {
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color(quintile))
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .defined(function (d) { return d[quintile] !== null; })
                .x(function (d) { return xScale(d.year); })
                .y(function (d) { return yScale(d[quintile]); })
            );

        svg.selectAll(`dot.${quintile}`)
            .data(data.filter(d => d[quintile] !== null))
            .enter()
            .append("circle")
            .attr("fill", color(quintile))
            .attr("cx", function (d) { return xScale(d.year); })
            .attr("cy", function (d) { return yScale(d[quintile]); })
            .attr("r", 7)
            .on("mouseover", function (event, d) {
                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy"));

                var tooltipText = `Year: ${d.year}, ${d[quintile]}%`;
                var textWidth = tooltipText.length * 6; // Approximate width calculation
                var textHeight = 18; // Approximate height

                svg.append("rect")
                    .attr("id", "tooltip-bg")
                    .attr("x", xPosition + 5)
                    .attr("y", yPosition - textHeight)
                    .attr("width", textWidth)
                    .attr("height", textHeight)
                    .attr("fill", "white")
                    .attr("stroke", "black");

                svg.append("text")
                    .attr("id", "tooltip-text")
                    .attr("x", xPosition + 10)
                    .attr("y", yPosition - 5)
                    .text(tooltipText)
                    .attr("font-family", "Arial")
                    .attr("font-size", "12px")
                    .attr("fill", "black");

                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "orange");
            })
            .on("mouseout", function (d) {
                d3.select("#tooltip-bg").remove();
                d3.select("#tooltip-text").remove();
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", color(quintile));
            });
    });
});
}