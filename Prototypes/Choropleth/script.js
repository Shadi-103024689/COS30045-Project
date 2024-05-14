w = 2500;
h = 750;

var colour = d3.scaleQuantize()
                .range([ "rgb(122,1,119)", "rgb(197,27,138)", "rgb(247,104,161)", "rgb(251,180,185)", "rgb(254,235,226)" ])

var projection = d3.geoMercator()
                    .center([145, -36.5])
                    .translate([w / 2, h - 175])
                    .scale(150);

//create svg path
var path = d3.geoPath().projection(projection);

var svg = d3.select("body").append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .attr("fill", "grey");

d3.csv("SocialProtection.csv").then(function(data){  
    //determine colour domain
    colour.domain([
        d3.min(data, function(d){ return d.value; }),
        d3.max(data, function(d){ return d.value; })
    ])

    d3.json("worldCountries.geo.json").then(function(json){
        for(var i = 0; i < data.length; i++){
            var dataset = data[i].country;
            var dataValue = parseFloat(data[i].value);

            for(var j = 0; j < json.features.length; j++){

                var jsonCountry = json.features[j].properties.name
                
                if(dataset == jsonCountry){
                    json.features[j].properties.value = dataValue;

                    break;
                }
            }
        }

        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d){
            var value = d.properties.value;
                if(value) {
                    return colour(value);
                } else {
                    return "#black"
                }
        })
        .attr("class", function(d){ return "country"})
        .style("opacity", .8)
        .style("stroke", "transparent")
        .on("mouseover", function(d){
            d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("opacity", .5)
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
        })
        .on("mouseout", function(d){
            d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("opacity", .8)
            d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
        })
    })
})