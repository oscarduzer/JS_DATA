/*
Just link this in your html's file and add div element with class .visHolder
*/

const h=460,w=800,padding=50;
const tooltip=d3.select(".visHolder")
.append("div")
.attr("id","tooltip"),
overlay=d3.select(".visHolder")
.append("div")
.attr("id","overlay"),
svg=d3.select(".visHolder")
.append("svg")
.attr("height",h+80)
.attr("width",w+100);
function years(array) {
  var quarter;
  var temp = String(array[0]).substring(5, 7);

  if (temp === '01') {
    quarter = 'Q1';
  } else if (temp === '04') {
    quarter = 'Q2';
  } else if (temp === '07') {
    quarter = 'Q3';
  } else if (temp === '10') {
    quarter = 'Q4';
  }

  return String(array[0]).substring(0, 4) + ' ' + quarter;
};
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(Response => Response.json())
.then(datas =>{
  let dateData=datas.data.map((item)=>{
    var datadate=new Date(item[0])
    return datadate;
  });
  let GDP=datas.data.map((item)=>{
   return item[1];
  });
  const xScale=d3.scaleTime().domain([d3.min(dateData),d3.max(dateData)]).range([padding,w-padding]), xAxis=d3.axisBottom(xScale);
  const yScale=d3.scaleLinear().domain([0,d3.max(GDP)]).range([0,h-padding]),yAxis=d3.axisLeft(d3.scaleLinear().domain([0,d3.max(GDP)]).range([h-padding,0]));
  console.log(dateData[0])

  svg.append("text")
  .attr('transform', 'rotate(-90)')
  .attr('x', -200)
  .attr('y', 80)
  .text('Gross Domestic Product');

  svg.append('text')
      .attr('x', w / 2 + padding)
      .attr('y', h + 50)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

  svg.append("g")
  .attr("id","x-axis")
  .attr("transform","translate(0,"+(h)+")")
  .call(xAxis)

  svg.append("g")
  .attr("id","y-axis")
  .attr("transform","translate("+(padding)+","+padding+")")
  .call(yAxis)

  svg.selectAll("rect")
  .data(datas.data)
  .enter()
  .append("rect")
  .attr("class","bar")
  .attr("height",(d) => yScale(d[1]))
  .attr("width",w/275)
  .attr("data-date",(d)=>d[0])
  .attr("data-gdp",(d)=>d[1])
  .attr("x",(d,i)=>{
    return xScale(dateData[i])
  })
  .attr("y",(d,i)=>{
    return h-yScale(GDP[i])
  })
  .attr("fill","rgb(51, 173, 255)")
  .on('mouseover', function (event,d) {
    // d or datum is the height of the
    // current rect
    overlay
      .transition()
      .duration(0)
      .style('opacity', 0.9)
    tooltip.transition().duration(200).style('opacity', 0.9);
    tooltip
      .html(
        years(d) + '<br>' +'$' + d[1] +' Billion'
      )
      .attr('data-date', d[0]);
  })
  .on('mouseout', function () {
    tooltip.transition().duration(200).style('opacity', 0);
    overlay.transition().duration(200).style('opacity', 0);
  });
})
.catch((e)=>console.log(e))
