var data = {
    "name": "A1",
    "children": [{
            "name": "B1",
            "children": [{
                    "name": "C1",
                    "value": 100
                },
                {
                    "name": "C2",
                    "value": 800
                },
                {
                    "name": "C3",
                    "value": 200
                }
            ]
        },
        {
            "name": "B2",
            "value": 200
        }
    ]
}

var clusterLayout = d3.cluster()
    .size([400, 200])

var root = d3.hierarchy(data)

clusterLayout(root)

// Nodes
let nodes = d3.select('svg g.nodes')
    .selectAll('circle.node')
    .data(root.descendants())
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', function (d) {
        return d.x;
    })
    .attr('cy', function (d) {
        return d.y;
    })
    .attr('r', 4)

nodes.append('title')
    .text(d => d.data.name)

// Links
let links = d3.select('svg g.links')
    .selectAll('line.link')
    .data(root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .attr('x1', function (d) {
        return d.source.x;
    })
    .attr('y1', function (d) {
        return d.source.y;
    })
    .attr('x2', function (d) {
        return d.target.x;
    })
    .attr('y2', function (d) {
        return d.target.y;
    });


nodes.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    console.log(d)
    d3.select(this)
        // .attr("x", d.x = d3.event.x)
        .attr("cy", d.y = d3.event.y)
        .attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("active", false);
}