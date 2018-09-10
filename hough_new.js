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
	let last_touch_y_pos = 0

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
			.on("touchstart", svg1TouchStart)
			.on("touchmove", svg1TouchMove)
			.on("touchend", svg1TouchEnd)

	function svg1HoverInsertLines(x, y, show_point){
		svg1_point = svg1.append("circle")
				  .attr("id", svg1_id + "-hover-point")
					.attr("display", show_point ? "initial": "none")
					.attr("r", 5)
					.attr("fill", "grey")
		svg2_line = svg2.append("path")
          .attr("id", svg1_id + "-hover-line")
          .datum(d3.range(x_range2[0], x_range2[1], 1))
          .attr("fill", "none")
          .attr("stroke", "grey")
					.style("stroke-dasharray", "3, 3")
          .attr("stroke-width", 1.5)
		_svg1HoverSetHoverLinePos(x, y, svg1_point, svg2_line)
	}

	function _svg1HoverSetHoverLinePos(x, y,
			svg1_point, svg2_line
	){
		svg1_point
			.attr("cx", xScale1(x))
			.attr("cy", yScale1(y))
		svg2_line
			.attr("d", d3.line()
				.x(theta => xScale2(theta))
				.y(theta => yScale2(
						r(theta, x, y)
					)
				)
			)
	}

	function svg1HoverSetHoverLinePos(x, y){
		_svg1HoverSetHoverLinePos(x, y,
			d3.select("#" +  svg1_id + "-hover-point"),
			d3.select("#" +  svg1_id + "-hover-line")
		)
	}

	function svg1HoverRemoveLines(){
		d3.select("#" +  svg1_id + "-hover-line").remove();
		d3.select("#" +  svg1_id + "-hover-point").remove();
	}

	function svg1MouseEnter(){
    svg1HoverInsertLines(
			xScale1.invert(d3.mouse(this)[0]),
			yScale1.invert(d3.mouse(this)[1]),
			false
		)
  }

	function svg1MouseMove(){
		svg1HoverSetHoverLinePos(
			xScale1.invert(d3.mouse(this)[0]),
			yScale2.invert(d3.mouse(this)[1])
		)
	}

	function svg1MouseLeave(){
		svg1HoverRemoveLines();
	}

	function svg1TouchStart(){
		d3.event.preventDefault();
    d3.event.stopPropagation();
    if (d3.touches(this).length == 1){
      svg1HoverInsertLines(
				xScale1.invert(d3.touches(this)[0][0]),
				yScale1.invert(d3.touches(this)[0][1]) + 4,
				true
			);
    }else {
      svg1HoverRemoveLines();
    }
		// two finger scrolling
		if (d3.touches(this).length == 2){
			let touches = d3.touches(document.documentElement)
			last_touch_y_pos = (touches[0][1] + touches[1][1]) / 2;
    }
	}

	function svg1TouchEnd(){
		d3.event.preventDefault();
    d3.event.stopPropagation();
    svg1HoverRemoveLines();
	}

	function svg1TouchMove(){
		d3.event.preventDefault();
    d3.event.stopPropagation();
    if (d3.touches(this).length == 1){
      svg1HoverSetHoverLinePos(
				xScale1.invert(d3.touches(this)[0][0]),
				yScale1.invert(d3.touches(this)[0][1]) + 4
			);
    }else if (d3.touches(this).length == 2){
			// two finger scrolling
			let touches = d3.touches(document.documentElement)
      let touch_y_pos = (touches[0][1] + touches[1][1]) / 2;
      let diff = touch_y_pos - last_touch_y_pos;
      document.documentElement.scrollTop -= diff;
    }
	}

	svg2.on("touchstart", svg2TouchStart)
      .on("touchmove", svg2TouchMove)
      .on("touchend", svg2TouchEnd)
      .on("mouseenter", svg2MouseEnter)
      .on("mousemove", svg2MouseMove)
      .on("mouseleave", svg2MouseLeave);



	function svg2HoverSetHoverLinePos(theta, d){
		_svg2HoverSetHoverLinePos(theta, d,
      d3.select("#" + svg1_id + "-hover-svg1-d"),
			d3.select("#" + svg1_id + "-hover-svg1-line"),
			d3.select("#" + svg1_id + "-hover-svg2-d"),
			d3.select("#" + svg1_id + "-hover-svg2-theta"),
			d3.select("#" + svg1_id + "-hover-svg1-theta"),
    )
	}

	function _svg2HoverSetHoverLinePos(theta, d,
			svg1_d, svg1_line, svg2_d, svg2_theta, svg1_theta
	){
		var p2 = [Math.cos(theta*2*Math.PI/360)*d, Math.sin(theta*2*Math.PI/360)*d];
    var p3 = [p2[0] + Math.cos((theta-90)*2*Math.PI/360)*30,
              p2[1] + Math.sin((theta-90)*2*Math.PI/360)*30]
    var p4 = [p2[0] + Math.cos((theta+90)*2*Math.PI/360)*30,
              p2[1] + Math.sin((theta+90)*2*Math.PI/360)*30]
    svg1_d
        .attr("x1", xScale1(0))
        .attr("y1", yScale1(0))
        .attr("x2", xScale1(p2[0]))
        .attr("y2", yScale1(p2[1]));
    svg1_line
        .attr("x1", xScale1(p3[0]))
        .attr("y1", yScale1(p3[1]))
        .attr("x2", xScale1(p4[0]))
        .attr("y2", yScale1(p4[1]));
    svg2_d
        .attr("x1", xScale2(theta))
        .attr("y1", yScale2(0))
        .attr("x2", xScale2(theta))
        .attr("y2", yScale2(d));
    svg2_theta
        .attr("x1", xScale2(0))
        .attr("y1", yScale2(0))
        .attr("x2", xScale2(theta))
        .attr("y2", yScale2(0));
    let rad = xScale1(d)-xScale1(0);
    let offset = rad < 0 ? -90: 90;
    svg1_theta
        .attr("d", d3.arc()
                     .innerRadius(Math.abs(rad))
                     .outerRadius(Math.abs(rad))
                     .startAngle(offset * (Math.PI/180))
                     .endAngle((offset-theta) * (Math.PI/180))
        ).attr("transform", "translate("+xScale1(0)+","+yScale1(0)+")")
	}

	function svg2HoverInsertLines(theta, d){
		svg1_d = svg1.append("line")
	     .attr("id", svg1_id + "-hover-svg1-d")
	     .attr("stroke", "red")
	     .attr("stroke-width", 1.5)
	  svg1_line = svg1.append("line")
	     .attr("id", svg1_id + "-hover-svg1-line")
	     .attr("stroke", "#444")
	     .attr("stroke-width", 1.5)
	  svg2_d = svg2.append("line")
	     .attr("id", svg1_id + "-hover-svg2-d")
	     .attr("stroke", "red")
	     .attr("stroke-width", 1.5)
	  svg2_theta = svg2.append("line")
	     .attr("id", svg1_id + "-hover-svg2-theta")
	     .attr("stroke", "green")
	     .attr("stroke-width", 1.5)
	  svg1_theta = svg1.append("path")
		   .attr("id", svg1_id + "-hover-svg1-theta")
	     .attr("fill", "none").attr("stroke-width", 1.5)
	     .attr("stroke", "green")
		_svg2HoverSetHoverLinePos(theta, d,
			svg1_d, svg1_line, svg2_d, svg2_theta, svg1_theta
		)
	}

	function svg2HoverRemoveLines(){
		d3.select("#" + svg1_id + "-hover-svg1-d").remove()
		d3.select("#" + svg1_id + "-hover-svg1-line").remove()
		d3.select("#" + svg1_id + "-hover-svg2-d").remove()
		d3.select("#" + svg1_id + "-hover-svg2-theta").remove()
		d3.select("#" + svg1_id + "-hover-svg1-theta").remove()
	}

  // top-level event handlers

	function svg2MouseEnter(){
		svg2HoverInsertLines(
			xScale2.invert(d3.mouse(this)[0]),
			yScale2.invert(d3.mouse(this)[1])
		);
	}

	function svg2MouseMove(){
		svg2HoverSetHoverLinePos(
			xScale2.invert(d3.mouse(this)[0]),
			yScale2.invert(d3.mouse(this)[1])
		);
	}

	function svg2MouseLeave(){
		svg2HoverRemoveLines();
	}

	function svg2TouchStart(){
    d3.event.preventDefault();
    d3.event.stopPropagation();
    if (d3.touches(this).length == 1){
      svg2HoverInsertLines(
				xScale2.invert(d3.touches(this)[0][0]),
				yScale2.invert(d3.touches(this)[0][1]) + 4
			);
    }else {
      svg2HoverRemoveLines();
    }
		// two finger scrolling
		if (d3.touches(this).length == 2){
			let touches = d3.touches(document.documentElement)
			last_touch_y_pos = (touches[0][1] + touches[1][1]) / 2;
    }
  }

	function svg2TouchMove(){
    d3.event.preventDefault();
    d3.event.stopPropagation();
    if (d3.touches(this).length == 1){
      svg2HoverSetHoverLinePos(
				xScale2.invert(d3.touches(this)[0][0]),
				yScale2.invert(d3.touches(this)[0][1]) + 4
			);
    }else if (d3.touches(this).length == 2){
			// two finger scrolling
			let touches = d3.touches(document.documentElement)
      let touch_y_pos = (touches[0][1] + touches[1][1]) / 2;
      let diff = touch_y_pos - last_touch_y_pos;
      document.documentElement.scrollTop -= diff;
    }
  }

	function svg2TouchEnd(){
		d3.event.preventDefault();
    d3.event.stopPropagation();
    svg2HoverRemoveLines();
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
