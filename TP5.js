/*
Just linked your HTML's file
*/
const tooltip=d3.select("body")
.append("div")
.attr("id","tooltip")
.style("opacity",0)
.style("visibility","hidden")
const w=1560,h=1350;
const svg=d3.select("body")
.append("svg")
.attr("viewBox", [0, 0, w, h])
      .attr("width", w+40)
      .attr("height", h+200)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
.then(Response=>Response.json())
.then(Data=>{
    d3.select("#title")
    .html(Data.name+" Sales")

    d3.select("#description")
    .html("Top 100 "+Data.name+" Sales")
    const tree=d3.hierarchy(Data).sum((d)=>d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);
    const color = d3.scaleOrdinal(Data.children.map(d => d.name), d3.schemeTableau10);
    const root=d3.treemap().size([w,h]).padding(2)(tree);
    console.log(root.leaves());
    const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);
    const format = d3.format(",d");
      leaf.append("rect")
      .attr("class","tile")
      .attr("data-name",(d)=>d.data.name)
      .attr("data-category",(d)=>d.data.category)
      .attr("data-value",(d)=>d.data.value)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .on("mouseover",function(event,d){
         tooltip.transition().duration(300)
         tooltip.style("opacity",0.9).style("visibility","visible")
         tooltip.attr("data-value",d.data.value)
         .style("top",event.pageY+"px")
         .style("left",event.pageX+"px")
         tooltip.html("<strong>Name: </strong> "+d.data.name+"<br><strong>Value: </strong>"
          +d.data.value+"<br><strong>Category: </strong>"+d.data.category)
      })
      .on("mouseout",function(){
        tooltip.style("opacity",0).style("visibility","hidden")
      })
      leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d)
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d.data.value)
      
  const g= svg.append("g")
  .attr("id","legend")
  .attr("transform",`translate(${w-1300},${h+20})`)
  const gr=g.selectAll("g")
    .data(Data.children)
    .enter()
    .append("g")
    gr.append("text")
    .text((d)=>d.name)
    .attr("x",(d,i)=>150*i-80)
    .attr("y",20)
    .style("font-size","18px")
    gr.append("rect")
    .attr("height",40)
    .attr("width",60)
    .attr("class","legend-item")
    .attr("fill",(d)=>color(d.name))
    .attr("x",(d,i)=>150*i)
})
