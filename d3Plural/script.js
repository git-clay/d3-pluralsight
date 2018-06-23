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
let largerPadding = 30
let minDate = getDate(lineDateData[0]['month'])
let maxDate = getDate(lineDateData[lineDateData.length - 1]['month'])
let xScale = d3.scaleTime()
    .domain([minDate, maxDate]) //input min/max
    .range([largerPadding, w - largerPadding]) //output pixels for svg

let yScale = d3.scaleLinear()
    .domain([
        d3.min(lineDateData, d => d.sales),
        d3.max(lineDateData, d => d.sales)
    ])
    .range([h - largerPadding, largerPadding])

let xAxis = d3.axisBottom()
    .scale(xScale).tickFormat(d3.timeFormat('%b'))
let yAxis = d3.axisLeft()
    .scale(yScale)

let scaleLineSvg = d3.select('#scaleLine')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

let scaleLine = d3.line()
    .x(d => xScale(getDate(d.month)))
    .y(d => yScale(d.sales))

scaleLineSvg.append('g')
    .call(xAxis)
    .attr('class', 'axis')
    .attr('transform', `translate(0,${h-largerPadding})`)

scaleLineSvg.append('g')
    .call(yAxis)
    .attr('class', 'axis')
    .attr('transform', `translate(${largerPadding},0)`)

scaleLineSvg.append('path')
    .attr('d', scaleLine(lineDateData))
    .attr('stroke', 'purple')
    .attr('fill', 'none')
    .attr('stroke-width', 3)
//#endregion
//#region filter
let filterSvg = d3.select('#filter')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

filterSvg.selectAll('circle')
    .data(lineData)
    .enter()
    .append('circle')
    .attr('cx', d => d.month * 3)
    .attr('cy', d => h - d.sales)
    .attr('r', 3)
    .attr('fill', 'blue')
filterSvg.selectAll('text')
    .data(lineData)
    .enter()
    .append('text')
    .text(d => showMinMax(lineData, 'sales', d.sales, 'all'))
    .attr('x', d => d.month * 3)
    .attr('y', d => h - d.sales)

d3.select('select')
    .on('change', d => {
        let sel = d3.select('#label-option').node().value
        filterSvg.selectAll('text')
            .data(lineData)
            .text(d => showMinMax(lineData, 'sales', d.sales, sel))
    })
//#endregion