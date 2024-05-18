let buttons = document.querySelectorAll(".country");
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    updateChart(button.textContent);
  });
});

w = 942.48;
h = 650;

var colour = d3
  .scaleQuantize()
  .range([
    "rgb(254,235,226)",
    "rgb(251,180,185)",
    "rgb(247,104,161)",
    "rgb(197,27,138)",
    "rgb(122,1,119)",
  ]);

var projection = d3
  .geoMercator()
  .center([145, -36.5])
  .translate([850, h - 100])
  .scale(150);

//create svg path
var path = d3.geoPath().projection(projection);

var svg = d3
  .select(".choroContainer")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("fill", "grey")
  .attr("class", function (d) {
    return "choroSVG";
  });

d3.csv("SocialProtection.csv").then(function (data) {
  //determine colour domain
  colour.domain([0, 100]);

  d3.json("worldCountries.geo.json").then(function (json) {
    for (var i = 0; i < data.length; i++) {
      var dataset = data[i].country;
      var dataValue = parseFloat(data[i].value);

      for (var j = 0; j < json.features.length; j++) {
        var jsonCountry = json.features[j].properties.name;

        if (dataset == jsonCountry) {
          json.features[j].properties.value = dataValue;

          break;
        }
      }
    }

    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function (d) {
        var value = d.properties.value;
        if (value) {
          return colour(value);
        } else {
          return "#black";
        }
      })
      .attr("class", function (d) {
        return "country";
      })
      .attr("data-name", function (d) {
        return d.properties.name;
      })
      .attr("data-value", function (d) {
        return d.properties.value;
      })
      .style("opacity", 0.8)
      .style("stroke", "transparent")
      .on("click", function (d) {
        var name = d3.select(this).attr("data-name");
        var value = d3.select(this).attr("data-value");
        if (name == "Chile" || name == "Costa Rica") {
          return;
        }
        if (value) {
          updateChart(name);
        }
      })
      .on("mouseover", function (d) {
        var value = d3.select(this).attr("data-value");
        if (value) {
          d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("opacity", 0.5);
          d3.select(this)
            .attr("cursor", "pointer")
            .transition()
            .duration(200)
            .style("opacity", 1);
        }
      })
      .on("mouseout", function (d) {
        d3.selectAll(".country")
          .transition()
          .duration(200)
          .style("opacity", 0.8);
        d3.select(this).transition().duration(200).style("opacity", 0.8);
      });
  });
});

// set the dimensions and margins of the graph
var lw = 500;
var lh = 500;
var padding = 60;

var lsvg = d3
  .select(".lineContainer")
  .append("svg")
  .attr("width", lw)
  .attr("height", lh)
  .attr("class", function (d) {
    return "lineSVG";
  });

function updateChart(country) {
  d3.csv("HealthStatusOECD.csv", function (d) {
    return {
      year: +d.Year,
      bottomQuintile: d[country + "BQ"] !== ".." ? +d[country + "BQ"] : null,
      topQuintile: d[country + "TQ"] !== ".." ? +d[country + "TQ"] : null,
    };
  }).then(function (data) {
    // Remove existing lines and circles
    lsvg.selectAll("path").remove();
    lsvg.selectAll("circle").remove();

    console.log(data);

    // Add new lines and circles based on the selected country's data
    // Add X axis
    var xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return d.year;
        })
      )
      .range([padding, lw - padding]);
    lsvg
      .append("g")
      .attr("transform", `translate(0, ${lh - padding})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Add Y axis
    var yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([lh - padding, padding]);
    lsvg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(d3.axisLeft(yScale));

    var color = d3
      .scaleOrdinal()
      .domain(["bottomQuintile", "topQuintile"])
      .range(["#e41a1c", "#377eb8"]);

    lsvg
      .selectAll(".dot-bottom")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-bottom")
      .attr("fill", color("bottomQuintile"))
      .attr("cx", function (d) {
        return xScale(d.year);
      })
      .attr("cy", function (d) {
        return yScale(d.bottomQuintile);
      })
      .attr("r", 6)
      .on("mouseover", function (event, d) {
        var xPosition = parseFloat(d3.select(this).attr("cx"));
        var yPosition = parseFloat(d3.select(this).attr("cy"));

        lsvg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xPosition + 5)
          .attr("y", yPosition - 10)
          .text("Year: " + d.year + ", " + d.bottomQuintile + "%")
          .attr("font-family", "Arial")
          .attr("font-size", "12px")
          .attr("fill", "black");

        d3.select(this).transition().duration(200).attr("fill", "orange");
      })
      .on("mouseout", function (d) {
        d3.select("#tooltip").remove();
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", color("bottomQuintile"));
      });

    // Draw circles for every year for upper quintile
    lsvg
      .selectAll(".dot-top")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-top")
      .attr("fill", color("topQuintile"))
      .attr("cx", function (d) {
        return xScale(d.year);
      })
      .attr("cy", function (d) {
        return yScale(d.topQuintile);
      })
      .attr("r", 6)
      .on("mouseover", function (event, d) {
        var xPosition = parseFloat(d3.select(this).attr("cx"));
        var yPosition = parseFloat(d3.select(this).attr("cy"));

        lsvg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xPosition + 5)
          .attr("y", yPosition - 10)
          .text("Year: " + d.year + ", " + d.topQuintile + "%")
          .attr("font-family", "Arial")
          .attr("font-size", "12px")
          .attr("fill", "black");

        d3.select(this).transition().duration(200).attr("fill", "orange");
      })
      .on("mouseout", function (d) {
        d3.select("#tooltip").remove();
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", color("topQuintile"));
      });

    // Draw the bottom quintile line
    lsvg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color("bottomQuintile"))
      .attr("stroke-width", 5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(d.year);
          })
          .y(function (d) {
            return yScale(d.bottomQuintile);
          })
      );

    // Draw the top quintile line
    lsvg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color("topQuintile"))
      .attr("stroke-width", 5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(d.year);
          })
          .y(function (d) {
            return yScale(d.topQuintile);
          })
      );

    // Filter out null values
    var filteredData = data.filter(function (d) {
      return d.bottomQuintile !== null && d.topQuintile !== null;
    });

    // Filter out null values so they do not appear
    lsvg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", color("bottomQuintile"))
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .defined(function (d) {
            return d.bottomQuintile !== null;
          })
          .x(function (d) {
            return xScale(d.year);
          })
          .y(function (d) {
            return yScale(d.bottomQuintile);
          })
      );

    // Draw the top quintile line
    lsvg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", color("topQuintile"))
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .defined(function (d) {
            return d.topQuintile !== null;
          })
          .x(function (d) {
            return xScale(d.year);
          })
          .y(function (d) {
            return yScale(d.topQuintile);
          })
      );

    // Filter out null values so they do not appear
    lsvg
      .selectAll(".dot-bottom")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-bottom")
      .attr("fill", color("bottomQuintile"))
      .attr("cx", function (d) {
        return xScale(d.year);
      })
      .attr("cy", function (d) {
        return yScale(d.bottomQuintile);
      })
      .attr("r", 0);

    // Filter out null values so they do not appear
    lsvg
      .selectAll(".dot-top")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-top")
      .attr("fill", color("topQuintile"))
      .attr("cx", function (d) {
        return xScale(d.year);
      })
      .attr("cy", function (d) {
        return yScale(d.topQuintile);
      })
      .attr("r", 0);

    var legend = lsvg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (lw - 100) + "," + 20 + ")");

    legend
      .selectAll("rect")
      .data(["topQuintile", "bottomQuintile"])
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 20;
      })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color);

    legend
      .selectAll("text")
      .data(["Top Quintile", "Bottom Quintile"])
      .enter()
      .append("text")
      .attr("x", 15)
      .attr("y", function (d, i) {
        return i * 20 + 9;
      })
      .text(function (d) {
        return d;
      })
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  });
}
