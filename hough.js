(function() {


  let w = 300;
  let h = w;
  let scale_padding = 20;
  let padding = 10;
  let data = [[5, 5, "black"]];
  let c = 0; // color index

  // function performing the actual hough transform
  function r(theta, x, y) {
    return x * Math.cos(theta*2*Math.PI/360) + y * Math.sin(theta*2*Math.PI/360);
  }

  // create graphs
  let svg = d3.select("#svg1");
  let svg2 = d3.select("#svg2");

  // axis scales
  let xScale = d3.scaleLinear()
                 .domain([-10, 10])
                 .range([padding + scale_padding, w - padding]);
  let yScale = d3.scaleLinear()
                 .domain([-10, 10])
                 .range([h - padding - scale_padding, padding]);
  let xScale2 = d3.scaleLinear()
                  .domain([0, 360])
                  .range([padding + scale_padding, w - padding])
  let yScale2 = d3.scaleLinear()
                  .domain([-10, 10])
                  .range([h - padding - scale_padding, padding]);

  let hough_range = d3.range(0, 360, 1);


  // axis
  let xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5)
  let yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
  let xAxis2 = d3.axisBottom()
                 .scale(xScale2)
                 .tickValues(d3.range(0, 370, 60));
  let yAxis2 = d3.axisLeft()
                 .scale(yScale2)
                 .ticks(5);
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (padding + (h - 2 * padding - scale_padding)/2) + ")")
     .call(xAxis);
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + (padding + scale_padding + (w - 2 * padding - scale_padding)/2) + ",0)")
     .call(yAxis);
  svg2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (padding + (h - 2 * padding - scale_padding)/2) + ")")
      .call(xAxis2);
  svg2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (padding + scale_padding) + ",0)")
      .call(yAxis2);

  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", xScale(9.5))
      .attr("y", yScale(0.5))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("x");
  svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(0.5))
      .attr("y", yScale(9))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("y");
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", xScale2(350))
      .attr("y", yScale2(0.5))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("Θ")
  svg2.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale2(10))
      .attr("y", yScale2(9))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("d");


  // points in first graph

  svg.selectAll("circle")
    .data(data.map(p => [xScale(p[0]), yScale(p[1]), p[2]]))
    .enter()
    .call(insert_point);

  svg.on("click", function(){
            svg.data([[d3.mouse(this)[0],
                       d3.mouse(this)[1],
                       d3.schemeCategory10[c++%10]
                     ]]).call(insert_point)
  });

  function delete_point(){
    d3.event.stopPropagation();
    d3.select(this).remove();
    update_points();
  }

  function insert_point(selection){
    selection
        .append("circle")
        .attr("class", "input-point")
        .attr("cx", p => p[0])
        .attr("cy", p => p[1])
        .attr("r", 10)
        .attr("cursor", "move")
        .attr("fill", p => p[2])
        .on("click", delete_point)
        .call(d3.drag()
                .on("drag", dragged)
                .on("start", handleMouseOut)
                .on("end", handleMouseOver));
    update_points();
  }

  function dragged(d) {
    let x = Math.max(xScale(-10), Math.min(xScale(10), d3.event.x));
    let y = Math.max(yScale(10), Math.min(yScale(-10), d3.event.y));
    d3.select(this).attr("cx", x).attr("cy", y);
    update_points();
  }

  function update_points(){
      let coords = [];
      d3.selectAll(".input-point").each(function() {
        coords.push([xScale.invert(d3.select(this).attr("cx")),
                     yScale.invert(d3.select(this).attr("cy")),
                     d3.select(this).attr("fill")])
      });
      data = coords;
      plot_lines();
    }




  // plot lines in second plot

  function plot_lines() {
    d3.selectAll(".hough-line").remove();
    data.forEach(p => plot_line(p));
  }

  function plot_line(point){
    let line = d3.line()
                 .x(d => xScale2(d))
                 .y(d => yScale2(r(d, point[0], point[1])));

    svg2.append("path")
        .classed("hough-line", true)
        .datum(hough_range)
        .attr("fill", "none")
        .attr("stroke", point[2])
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }




  // hovering the first graph

  svg.on("mouseenter", handleMouseOver)
     .on("mousemove", handleMouseMove)
     .on("mouseleave", handleMouseOut);

  function handleMouseOver(){
    /*svg.append("circle").attr("id", "hover-point")
          .attr("r", 10).attr("cx", d3.mouse(this)[0])
          .attr("cy", d3.mouse(this)[1])
          .attr("fill", "grey")*/
    svg2.append("path")
          .attr("id", "hover-line")
          .datum(hough_range)
          .attr("fill", "none")
          .attr("stroke", "grey")
          .style("stroke-dasharray", "3, 3")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
                       .x(d => xScale2(d))
                       .y(d => yScale2(r(d, xScale.invert(d3.mouse(this)[0]), yScale.invert(d3.mouse(this)[1])))));
  }

  function handleMouseMove() {
    /*d3.selectAll("#hover-point")
      .attr("cx", d3.mouse(this)[0])
      .attr("cy", d3.mouse(this)[1])*/
    d3.selectAll("#hover-line")
      .attr("d", d3.line()
                   .x(d => xScale2(d))
                   .y(d => yScale2(r(d,
                     xScale.invert(d3.mouse(this)[0]),
                     yScale.invert(d3.mouse(this)[1])))));
  }

  function handleMouseOut(){
    /*d3.selectAll("#hover-point").remove();*/
    d3.selectAll("#hover-line").remove();
  }




  // hovering the second graphs

  svg2.on("touchstart", handleTouchStart2)
      .on("touchmove", handleTouchMove2)
      .on("touchend", handleTouchEnd2)
      .on("mouseenter", handleMouseOver2)
      .on("mousemove", handleMouseMove2)
      .on("mouseleave", handleMouseOut2);

  function calcHoverLines2(theta, d){
    _calcHoverLines2(theta, d,
      d3.selectAll("#hover-line-2"),
      d3.selectAll("#hover-line-3"),
      d3.selectAll("#hover-line-4"),
      d3.selectAll("#hover-line-5"),
      d3.selectAll("#hover-arc"),
    )
  }

  function _calcHoverLines2(theta, d, l2, l3, l4, l5, larc) {
    var p2 = [Math.cos(theta*2*Math.PI/360)*d, Math.sin(theta*2*Math.PI/360)*d];
    var p3 = [p2[0] + Math.cos((theta-90)*2*Math.PI/360)*30,
              p2[1] + Math.sin((theta-90)*2*Math.PI/360)*30]
    var p4 = [p2[0] + Math.cos((theta+90)*2*Math.PI/360)*30,
              p2[1] + Math.sin((theta+90)*2*Math.PI/360)*30]
    l2
        .attr("x1", xScale(0))
        .attr("y1", yScale(0))
        .attr("x2", xScale(p2[0]))
        .attr("y2", yScale(p2[1]));
    l3
        .attr("x1", xScale(p3[0]))
        .attr("y1", yScale(p3[1]))
        .attr("x2", xScale(p4[0]))
        .attr("y2", yScale(p4[1]));
    l4
        .attr("x1", xScale2(theta))
        .attr("y1", yScale2(0))
        .attr("x2", xScale2(theta))
        .attr("y2", yScale2(d));
    l5
        .attr("x1", xScale2(0))
        .attr("y1", yScale2(0))
        .attr("x2", xScale2(theta))
        .attr("y2", yScale2(0));
    let rad = xScale(d)-xScale(0);
    let offset = rad < 0 ? -90: 90;
    larc
        .attr("d", d3.arc()
                     .innerRadius(Math.abs(rad))
                     .outerRadius(Math.abs(rad))
       .startAngle(offset * (Math.PI/180))
       .endAngle((offset-theta) * (Math.PI/180))

      ).attr("transform", "translate("+xScale(0)+","+yScale(0)+")")
  }

function insertLines2(theta, d){
  l2 = svg.append("line")
     .attr("id", "hover-line-2")
     .attr("stroke", "red")
     .attr("stroke-width", 1.5)
  l3 = svg.append("line")
     .attr("id", "hover-line-3")
     .attr("stroke", "#444")
     .attr("stroke-width", 1.5)
  l4 = svg2.append("line")
     .attr("id", "hover-line-4")
     .attr("stroke", "red")
     .attr("stroke-width", 1.5)
  l5 = svg2.append("line")
     .attr("id", "hover-line-5")
     .attr("stroke", "green")
     .attr("stroke-width", 1.5)
  larc = svg.append("path").attr("id", "hover-arc")
      .attr("fill", "none").attr("stroke-width", 1.5)
      .attr("stroke", "green")
  _calcHoverLines2(theta, d, l2, l3, l4, l5, larc)
}

  function handleMouseOver2(){
    console.log("mouse over 2", d3.mouse(this));
    insertLines2(xScale2.invert(d3.mouse(this)[0]), yScale2.invert(d3.mouse(this)[1]));
  }

  function handleMouseMove2() {
    calcHoverLines2(xScale2.invert(d3.mouse(this)[0]), yScale2.invert(d3.mouse(this)[1]));
  }

  function handleTouchStart2(){
    console.log("start")
    d3.event.preventDefault();
    d3.event.stopPropagation();
    insertLines2(xScale2.invert(d3.touches(this)[0][0]), yScale2.invert(d3.touches(this)[0][1])+4);
  }

  function handleTouchMove2() {
    console.log("move")
    d3.event.preventDefault();
    d3.event.stopPropagation();
    calcHoverLines2(xScale2.invert(d3.touches(this)[0][0]), yScale2.invert(d3.touches(this)[0][1])+4);
  }

  function handleTouchEnd2() {
    console.log("end")
    d3.event.preventDefault();
    d3.event.stopPropagation();
    handleMouseOut2();
  }

  function handleMouseOut2(){
    d3.selectAll("#hover-line-2").remove();
    d3.selectAll("#hover-line-3").remove();
    d3.selectAll("#hover-line-4").remove();
    d3.selectAll("#hover-line-5").remove();
    d3.selectAll("#hover-arc").remove();
  }

})();
