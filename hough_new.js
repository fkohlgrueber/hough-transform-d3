function create_svg(id, x_range, y_range, x_label, y_label){
	let w = 300;
  let h = w;
	let scale_padding = 20;
  let base_padding = 7;
	let padding = scale_padding + base_padding;
	let label_padding = 7;

	svg = d3.select(id)
					.append("svg")
						.attr("viewBox", "0 0 "+ w + " " + h)
						.attr("cursor", "crosshair")

  // scales
  let xScale = d3.scaleLinear()
                 .domain(x_range)
							   .range([padding, w - padding]);
  let yScale = d3.scaleLinear()
 	  						 .domain(y_range)
 		  					 .range([padding, h - padding]);

	// axes
	let xAxis = y_range[0] === 0 ? d3.axisTop(): d3.axisBottom()
	xAxis.scale(xScale)
	if (x_label === "Θ"){
		xAxis.tickValues(d3.range(0, x_range[1]+1, 60))
	}else{
		xAxis.ticks(5)
	}
  let yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
	svg.append("g")
	   .attr("transform", "translate(0,"+yScale(0)+")")
		 .call(xAxis);
	svg.append("g")
	   .attr("transform", "translate("+xScale(0)+",0)")
		 .call(yAxis);

	// labels
	//
	// direction of the x/y axis
	let x_dir = x_range[1] > x_range[0] ? 1: -1
	let y_dir = y_range[1] > y_range[0] ? 2: -1
	let x_label_pos = Math.max(x_range[0], x_range[1])
	let y_label_pos = Math.max(y_range[0], y_range[1])
	svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", xScale(x_label_pos)-label_padding*x_dir)
      .attr("y", yScale(0)+label_padding*y_dir)
      .attr("font-size", "10pt")
      .text(x_label);
	svg.append("text")
	    .attr("text-anchor", "start")
	    .attr("x", xScale(0)+label_padding*x_dir)
	    .attr("y", yScale(y_label_pos)-label_padding*y_dir)
	    .attr("font-size", "10pt")
	    .text(y_label);

  return [svg, xScale, yScale];
}

// function performing the actual hough transform
function r(theta, x, y) {
	return x * Math.cos(theta*2*Math.PI/360) + y * Math.sin(theta*2*Math.PI/360);
}

function insert_hough_plots(svg1_id, svg2_id){
	let x_range = [-10, 10]
	let x_range2 = [0, 360]
	let y_range = [10, -10]
	let [svg1, xScale1, yScale1] = create_svg("#"+svg1_id, x_range, y_range, "x", "y")
	let [svg2, xScale2, yScale2] = create_svg("#"+svg2_id, x_range2, y_range, "Θ", "d")

	let data = [[5, 5, "black"]];
	let next_idx = 0

	data.forEach(p => insert_point(xScale1(p[0]), yScale1(p[1])))

	svg1.on("click", function(){
	  insert_point(d3.mouse(this)[0], d3.mouse(this)[1])
  });

	function insert_point(x, y) {
		idx = next_idx++
		color = d3.schemeCategory10[idx%10]
		// point in svg1
		svg1.append("circle")
		    .attr("id", svg1_id + "-" + idx)
				.attr("cx", x)
        .attr("cy", y)
        .attr("r", 10)
        .attr("cursor", "move")
        .attr("fill", color)
        .on("click", delete_point)
        .call(d3.drag()
                .on("drag", dragged))
		// line in svg2
		svg2.append("path")
        .attr("id", svg1_id + "-" + idx + "-line")
        .datum(d3.range(x_range2[0], x_range2[1], 1))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", gen_hough_line(x, y))
	}

	function gen_hough_line(x, y){
		return d3.line()
			.x(theta => xScale2(theta))
			.y(theta => yScale2(
					r(theta, xScale1.invert(x), yScale1.invert(y))
				)
			);
	}

	function delete_point(){
    d3.event.stopPropagation();
    d3.select(this).remove();
		d3.select("#" + this.id + "-line").remove();
  }

	function dragged(d) {
    let x = Math.max(xScale1(-10), Math.min(xScale1(10), d3.event.x));
    let y = Math.max(yScale1(10), Math.min(yScale1(-10), d3.event.y));
		// update point
		d3.select(this).attr("cx", x).attr("cy", y);
		// update line
		d3.select("#" + this.id + "-line").attr("d", gen_hough_line(x, y))
  }


  svg1.on("mouseenter", svg1MouseEnter)
	    .on("mousemove", svg1MouseMove)
			.on("mouseleave", svg1MouseLeave)

	function svg1MouseEnter(){
    svg2.append("path")
          .attr("id", svg1_id + "-hover-line")
          .datum(d3.range(x_range2[0], x_range2[1], 1))
          .attr("fill", "none")
          .attr("stroke", "grey")
					.style("stroke-dasharray", "3, 3")
          .attr("stroke-width", 1.5)
          .attr("d", gen_hough_line(d3.mouse(this)[0], d3.mouse(this)[1]))
  }

	function svg1MouseMove(){
		d3.select("#" +  svg1_id + "-hover-line")
		  .attr("d", gen_hough_line(d3.mouse(this)[0], d3.mouse(this)[1]))
	}

	function svg1MouseLeave(){
		d3.select("#" +  svg1_id + "-hover-line").remove();
	}

	//let svg2 = create_svg(svg2_id, color2, 400)
 	/*let svg2_div = document.createElement("div")
  svg2_div.classList.add("hough-wrapper")
  let canvas = document.createElement("canvas")
  svg2_div.appendChild(canvas)
  svg2_div.appendChild(svg2)
  document.getElementById(svg1_id).insertBefore(svg1, null)
  document.getElementById(svg2_id).insertBefore(svg2_div, null)

  function update_canvas(){
    let w = svg2.getBoundingClientRect().width;
    let h = svg2.getBoundingClientRect().height;
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(30,30);
    ctx.stroke();
  }

	update_canvas()
  window.addEventListener("resize", function() {
      return update_canvas();
  	}
  );
	*/
}


function insert_hough_plots_2(svg1_id, svg2_id){
	let x_range = [0, 200]
	let x_range2 = [0, 180]
	let y_range = [0, 200]
	let y_range2 = [300, -300]
	let svg1 = create_svg(svg1_id, x_range, y_range, "x", "y")
	let svg2 = create_svg(svg2_id, x_range2, y_range2, "Θ", "d")
}
