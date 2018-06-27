import * as d3 from 'https://unpkg.com/d3?module'
// import '../node_modules/d3-selection';
// import '../node_modules/d3-selection-multi';


let w = 300,
    h = 200,
    padding = 2

let getDate = (d) => {
    let strDate = new String(d)
    let year = strDate.substr(0, 4),
        month = strDate.substr(4, 2) - 1,
        day = strDate.substr(6, 2)
    return new Date(year, month, day)
}
let showMinMax = (ds, col, val, type) => {
    let max = d3.max(ds, d => d[col]),
        min = d3.min(ds, d => d[col])
    return type === 'min' && val == min ? val :
        type === 'max' && val == max ? val :
        type == 'all' ? val : null;
}
//#region data
let barData = [5, 10, 15, 20, 25, 30, 35, 4, 21, 5]
let lineData = [{
    'month': 10,
    'sales': 170
}, {
    'month': 20,
    'sales': 20
}, {
    'month': 40,
    'sales': 90
}, {
    'month': 60,
    'sales': 10
}, {
    'month': 70,
    'sales': 50
}, {
    'month': 80,
    'sales': 60
}, {
    'month': 90,
    'sales': 75
}];
let lineDateData = [{
    'month': 20180101,
    'sales': 170
}, {
    'month': 20180201,
    'sales': 20
}, {
    'month': 20180301,
    'sales': 90
}, {
    'month': 20180401,
    'sales': 10
}, {
    'month': 20180501,
    'sales': 50
}, {
    'month': 20180601,
    'sales': 60
}, {
    'month': 20180701,
    'sales': 75
}, {
    'month': 20180801,
    'sales': 400
}, {
    'month': 20180901,
    'sales': 50
}, {
    'month': 20181001,
    'sales': -15
}, {
    'month': 20181101,
    'sales': -45
}, {
    'month': 20181201,
    'sales': -105
}];
//#endregion
//#region basic bar chart

let colorPicker = v => v <= 30 ? `rgb(0,${v*10},0)` : 'red'
let barSvg = d3.select('#bar')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

barSvg.selectAll('rect')
    .data(barData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * (w / barData.length))
    .attr('y', d => h - d * 4)
    .attr('width', (d, i) => w / barData.length - padding)
    .attr('height', d => d * 4)
    .attr('fill', d => colorPicker(d))
barSvg.selectAll('text')
    .data(barData)
    .enter()
    .append('text')
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => i * (w / barData.length) + (w / barData.length - padding) / 2)
    .attr('y', d => (h - d * 4) + 12)
    .attr('fill', '#f0f0f0')
    .attr('font-size', '11')
//#endregion
//#region basic line chart

let lineSvg = d3.select('#line')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

let line = d3.line()
    .x(d => d.month * 3)
    .y(d => h - d.sales)
    .curve(d3.curveBasis)

lineSvg.append('path')
    .attr('d', line(lineData))
    .attr('stroke', 'pink')
    .attr('stroke-width', '2')
    .attr('fill', 'none')

lineSvg.selectAll('text')
    .data(lineData)
    .enter()
    .append('text')
    .text(d => d.sales)
    .attr('x', d => d.month * 3)
    .attr('y', d => h - d.sales)
    .attr('font-size', 11)
    .attr('text-anchor', 'start')
    .attr('dy', '.35em')
    .attr('font-weight', (d, i) => i === 0 || i == lineData.length - 1 ? 'bold' : 'normal')
//#endregion
//#region scatter
let scatterSvg = d3.select('#scatter')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

scatterSvg.selectAll('circle')
    .data(lineData)
    .enter()
    .append('circle')
    .attr('cx', d => d.month * 3)
    .attr('cy', d => h - d.sales)
    .attr('r', 3)
    .attr('fill', 'blue')

//#endregion
//#region scaling data
const largerPadding = 30
const minDate = getDate(lineDateData[0]['month']),
    maxDate = getDate(lineDateData[lineDateData.length - 1]['month']);
const scaleLineSvg = d3
    .select('#scaleLine')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

// scale and draw line
let xScale = d3
    .scaleTime()
    .domain([minDate, maxDate]) // input
    .range([largerPadding, w - largerPadding]); // output
let yScale = d3
    .scaleLinear()
    .domain([
        d3.min(lineDateData, d => d.sales),
        d3.max(lineDateData, d => d.sales)
    ])
    .range([h - largerPadding, largerPadding]);
let scaleLine = d3 // resizes data line 
    .line()
    .x(d => xScale(getDate(d.month)))
    .y(d => yScale(d.sales));

scaleLineSvg // draw data line
    .append('path')
    .attr('d', scaleLine(lineDateData))
    .attr('stroke', 'purple')
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .attr('id', `lineGraphPath`);

// axes
let xAxisGen = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat('%b'));
let yAxisGen = d3.axisLeft()
    .scale(yScale);

scaleLineSvg // xAxisGen
    .append('g')
    .call(xAxisGen)
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${h-largerPadding})`);
scaleLineSvg // yAxisGen
    .append('g')
    .call(yAxisGen)
    .attr('class', 'y-axis')
    .attr('transform', `translate(${largerPadding},0)`);


//#endregion
//#region filter
let filterSvg = d3
    .select('#filter')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

filterSvg
    .selectAll('circle')
    .data(lineData)
    .enter()
    .append('circle')
    .attr('cx', d => d.month * 3)
    .attr('cy', d => h - d.sales)
    .attr('r', 3)
    .attr('fill', 'blue')
filterSvg
    .selectAll('text')
    .data(lineData)
    .enter()
    .append('text')
    .text(d => showMinMax(lineData, 'sales', d.sales, 'all'))
    .attr('x', d => d.month * 3)
    .attr('y', d => h - d.sales)

d3
    .select('#label-option')
    .on('change', d => {
        let sel = d3
            .select('#label-option')
            .node()
            .value;
        filterSvg
            .selectAll('text')
            .data(lineData)
            .text(d => showMinMax(lineData, 'sales', d.sales, sel))
    })
//#endregion
//#region force-directed relation graph -- broken
const relationData = (d3.json("https://cdn.rawgit.com/mbostock/4062045" +
    "/raw/5916d145c8c048a6e3086915a6be464467391c62" +
    "/miserables.json"))
let links, link, nodes, node;
relationData.then(res => {
    links = res.links.map(d => Object.create(d));
    createLine();
});
relationData.then(res => {
    nodes = res.nodes.map(d => Object.create(d));
    createNode();
});

const scale = d3.scaleOrdinal(d3.schemeCategory10);
const color = d => scale(d.group);
const ticked = () => {
    console.log()
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}
const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(w / 2, h / 2))
    // .on("tick", ticked);
let drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
const relationSvg = d3
    .select('#force')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

let createLine = () => {

    link = relationSvg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        console.log(link)
}

let createNode = () => {

    node = relationSvg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", color)
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);
        node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}




//#endregion
