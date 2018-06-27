var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
    logo = g.append('svg').attr("width", 140).attr('height', 140).attr('x', -68).attr('y', -68),
    total;
console.log(svg)
var color = d3.scaleOrdinal(["#98abcc", "#bb89a6", "#34ff88"]);
var pie = d3.pie()
    .sort(null)
    .value(d => d.population);

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(80);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var getPercent = val => Math.round(val / total * 100);

let newNodeAndLink = (d) => {
    console.log(d,width / 2,height / 2)
    console.log('label',label.centroid(d))
    console.log('path',path.centroid(d))

}

d3.xml("./clinkup-lines.svg").mimeType("image/svg+xml").get((error, xml) => {
    if (error) throw error;
    logo.node().appendChild(xml.documentElement);
});

d3.csv("data.csv", d => {
    d.population = +d.population;
    return d;
}, (error, data) => {
    if (error) throw error;

    total = d3.sum(data, d => d.population);
    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", d => color(d.data.age));

    arc.append("text")
        .attr("transform", d => "translate(" + label.centroid(d) + ")")
        .attr("dy", "0.35em")
        .text(d => d.data.age)
    arc.append("text")
        .attr("transform", d => "translate(" + label.centroid(d) + ")")
        .attr("dy", "1.35em")
        .text(d => `${getPercent(d.data.population)}%`)
    arc.on('click', d => {
        newNodeAndLink(d);
    })

});