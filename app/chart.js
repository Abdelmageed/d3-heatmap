import * as d3 from 'd3'
import tip from 'd3-tip'
import * as chrom from 'd3-scale-chromatic'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December", ""
];
const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
const chart = () => {
    d3.json(dataUrl, (data) => {
        drawHeatMap(data)
    })
}

const drawHeatMap = (data) => {
    
    const container = {
        width: 960, height: 600
    }
    const margin = {
        top: 80, right: 75, bottom: 80, left: 100
    }
    const chartWidth = container.width - margin.right - margin.left,
          chartHeight = container.height - margin.top - margin.bottom
    
    let baseTemp = data.baseTemperature,
        points = data.monthlyVariance
    
    let yearRange = d3.extent(points,(d=>+d.year))
    
   
    
    let svg = d3.select('body').append('svg')
        .attr('width', container.width)
        .attr('height', container.height)
    let chart = svg
        .append('g')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', `translate(${margin.left},${margin.top})`)
    
    
    
    //x
    let x = d3.scaleTime()
        .domain(yearRange.map(d=>new Date(d, 0)))
        .range([0, chartWidth])
    
    //y
    let y = d3.scalePoint()
        .domain(monthNames)
        .range([chartHeight, 0])
        
    //z
    let z = d3.scaleSequential()
        .interpolator(ineterpolateBuRd)
        .domain(d3.extent(points,(d=>d.variance + baseTemp)))
    
    let xAxis = d3.axisBottom(x)
        .ticks(d3.timeYear.every(25)),
        yAxis = d3.axisLeft(y)
    
    let startYear = new Date(yearRange[0], 0),
        followingYear = new Date(yearRange[0] + 1, 0)
     let boxWidth =  x(followingYear) - x(startYear),
        boxHeight = y(monthNames[0]) - y(monthNames[1])
     
     //tooltip
     const tooltip = tip().html(d=>`
            <div class="tooltip">
                <strong>
                    ${d.year}, ${monthNames[d.month-1]}
                </strong>
                <br>
                <span>
                    ${d3.format('.2f')(d.variance+ baseTemp)}C&deg;
                </span>
                <br>
                <span>
                    ${d3.format('.2f')(d.variance)}C&deg;
                </span>
            </div>
`)
     chart.call(tooltip)
     
    chart.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis)
    chart.append('g')
        .call(yAxis)
    
    chart.append('text')
        .attr('x', chartWidth + 40)
        .attr('text-anchor', 'middle')
        .attr('y', chartHeight / 2 - 65)
        .text('Temp')
    
    //legend
    let legend = chart
        .append('g')
        .selectAll('.legend')
        .data(z.ticks(6).slice(1).reverse()).enter()
        .append('g')
        .attr("class", "legend")
        .attr("transform", (d,i)=>`translate(${chartWidth + 20},${chartHeight / 2 - 50 + i*20})`)
    
    legend.append('rect')
        .attr('width', 10)
        .attr('height', 20)
        .style('fill', z)
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('dy', 5)
        .text(String)
    
    //data points
    chart.selectAll('.tile')
        .data(points).enter()
        .append('rect')
        .attr('class', 'tile')
        .attr('x', d=>x(new Date(d.year, 0)))
        .attr('y', d=>y(monthNames[d.month]))
        .style('fill', d=>z(d.variance + baseTemp))
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .on('mouseover', tooltip.show)
        .on('mouseout')
    
    //labels
    chart.append('text')
        .text('Monthly Global Land-Surface Temperature')
        .attr('text-anchor', 'middle')
        .attr('x', chartWidth/2)
        .attr('y', -margin.top/2)
        .style('font-size', 25)
    
    chart.append('text')
        .text('1753-2015')
        .attr('text-anchor', 'middle')
        .attr('x', chartWidth/2)
        .attr('y', -margin.top/4)
        .style('font-size', 20)
    
    chart.append('text')
        .text('Months')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('x', -chartHeight / 2)
        .attr('y', -margin.right)
        .style('font-size', 18)
    
    chart.append('text')
        .text('Years')
        .attr('text-anchor', 'middle')
        .attr('x', chartWidth/2)
        .attr('y', chartHeight + margin.bottom - 20)
        .style('font-size', 18)
}

const ineterpolateBuRd = t => {
    let white = {
        r:255,
        g:255,
        b:255
    },
        crimson = {
            r: 220,
            g: 20,
            b: 60
        },
        darkslateblue = {
            r: 72,
            g: 61,
            b: 139
        },
        col
    if (t <= 0.5) {
        col = lerpColor(darkslateblue, white, t*2)
    } else {
        col = lerpColor(white, crimson, (t-0.5)*2)
    }
//    let col = lerpColor(lerpColor(darkslateblue, white, t), lerpColor(white, crimson, t), t)
   
    return `rgb(${parseInt(col.r)}, ${parseInt(col.g)}, ${parseInt(col.b)})`
}
const lerpColor = (c1, c2, t) => {
     return{
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t)}
   
}
const lerp = (v0, v1, t) => {
    return (1 - t) * v0 + t * v1
}
export default chart