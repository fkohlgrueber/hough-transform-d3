(function() {


  window.onresize = function(){
    update_canvas_size();
  };

  let w = 300;
  let h = w;
  let scale_padding = 20;
  let padding = 10;
  let idx = 0;
  let data = [[5, 22], [6, 23], [8, 25], [9, 26], [10, 27], [11, 28], [12, 29], [81, 29], [13, 30], [82, 30], [127, 30], [14, 31], [83, 31], [15, 32], [84, 33], [130, 33], [67, 34], [85, 34], [114, 34], [18, 35], [68, 35], [86, 35], [112, 35], [115, 35], [19, 36], [69, 36], [87, 36], [111, 36], [112, 36], [116, 36], [117, 36], [20, 37], [70, 37], [88, 37], [111, 37], [118, 37], [119, 37], [21, 38], [89, 38], [110, 38], [119, 38], [120, 38], [22, 39], [90, 39], [109, 39], [110, 39], [121, 39],  [122, 39], [23, 40], [91, 40], [109, 40], [122, 40], [123, 40], [24, 41], [92, 41], [108, 41], [124, 41], [139, 41], [25, 42], [26, 42], [76, 42], [107, 42], [125, 42], [126, 42], [26, 43], [27, 43], [94, 43], [107, 43], [127, 43], [27, 44], [28, 44], [95, 44], [106, 44], [128, 44], [28, 45], [29, 45], [96, 45], [105, 45], [130, 45], [29, 46], [30, 46], [97, 46], [104, 46], [105, 46], [131, 46], [132, 46], [30, 47], [31, 47], [98, 47], [104, 47], [133, 47], [31, 48], [32, 48], [99, 48], [103, 48], [134, 48], [135, 48], [32, 49], [100, 49], [102, 49], [103, 49], [136, 49], [33, 50], [102, 50], [137, 50], [138, 50], [34, 51], [101, 51], [139, 51], [140, 51], [35, 52], [100, 52], [140, 52], [141, 52], [142, 52], [36, 53], [100, 53], [142, 53], [143, 53], [144, 53], [37, 54], [99, 54], [144, 54], [145, 54], [98, 55], [146, 55], [147, 55], [39, 56], [97, 56], [98, 56], [147, 56], [148, 56], [149, 56], [40, 57], [97, 57], [149, 57], [150, 57], [151, 57], [41, 58], [96, 58], [151, 58], [152, 58], [153, 58], [42, 59], [95, 59], [153, 59], [154, 59], [155, 59], [43, 60], [95, 60], [155, 60], [156, 60], [44, 61], [94, 61], [157, 61], [45, 62], [93, 62], [157, 62], [158, 62], [46, 63], [92, 63], [93, 63], [157, 63], [47, 64], [74, 64], [75, 64], [92, 64], [156, 64], [157, 64], [48, 65], [75, 65], [76, 65], [91, 65], [156, 65], [49, 66], [76, 66], [90, 66], [91, 66], [155, 66], [156, 66], [50, 67], [51, 67], [90, 67], [154, 67], [155, 67], [51, 68], [89, 68], [154, 68], [52, 69], [88, 69], [153, 69], [154, 69], [53, 70], [80, 70], [88, 70], [153, 70], [54, 71], [81, 71], [87, 71], [152, 71], [153, 71], [55, 72], [78, 72], [82, 72], [86, 72], [151, 72], [152, 72], [83, 73], [86, 73], [151, 73], [85, 74], [150, 74], [80, 75], [81, 75], [84, 75], [149, 75], [150, 75], [81, 76], [83, 76], [84, 76], [149, 76], [83, 77], [148, 77], [61, 78], [82, 78], [147, 78], [148, 78], [62, 79], [81, 79], [147, 79], [81, 80], [146, 80], [64, 81], [80, 81], [146, 81], [65, 82], [79, 82], [145, 82], [66, 83], [79, 83], [144, 83], [145, 83], [67, 84], [78, 84], [144, 84], [77, 85], [143, 85], [76, 86], [77, 86], [143, 86], [76, 87], [142, 87], [72, 88], [75, 88], [141, 88], [72, 89], [74, 89], [75, 89], [140, 89], [141, 89], [74, 90], [140, 90], [73, 91], [139, 91], [140, 91], [72, 92], [73, 92], [138, 92], [139, 92], [72, 93], [138, 93], [71, 94], [137, 94], [70, 95], [137, 95], [69, 96], [70, 96], [136, 96], [69, 97], [135, 97], [136, 97], [68, 98], [135, 98], [67, 99], [68, 99], [134, 99], [67, 100], [133, 100], [134, 100], [66, 101], [133, 101], [65, 102], [132, 102], [133, 102], [135, 102], [136, 102], [64, 103], [65, 103], [131, 103], [132, 103], [136, 103], [64, 104], [131, 104], [137, 104], [63, 105], [130, 105], [131, 105], [138, 105], [62, 106], [63, 106], [130, 106], [139, 106], [62, 107], [129, 107], [139, 107], [61, 108], [128, 108], [129, 108], [60, 109], [61, 109], [128, 109], [59, 110], [60, 110], [127, 110], [59, 111], [126, 111], [58, 112], [59, 112], [126, 112], [57, 113], [58, 113], [125, 113], [57, 114], [124, 114], [125, 114], [56, 115], [124, 115], [55, 116], [56, 116], [123, 116], [55, 117], [123, 117], [54, 118], [122, 118], [127, 118], [53, 119], [54, 119], [121, 119], [123, 119], [124, 119], [52, 120], [53, 120], [121, 120], [125, 120], [52, 121], [120, 121], [126, 121], [51, 122], [52, 122], [119, 122], [127, 122], [50, 123], [51, 123], [119, 123], [128, 123], [166, 123], [50, 124], [118, 124], [129, 124], [167, 124], [49, 125], [117, 125], [118, 125], [48, 126], [49, 126], [117, 126], [47, 127], [48, 127], [116, 127], [47, 128], [115, 128], [116, 128], [47, 129], [48, 129], [115, 129], [48, 130], [49, 130], [50, 130], [114, 130], [115, 130], [50, 131], [51, 131], [52, 131], [114, 131], [173, 131], [52, 132], [53, 132], [113, 132], [53, 133], [54, 133], [55, 133], [112, 133], [113, 133], [139, 133], [55, 134], [56, 134], [112, 134], [56, 135], [57, 135], [58, 135], [111, 135], [58, 136], [59, 136], [110, 136], [111, 136], [142, 136], [60, 137], [61, 137], [109, 137], [110, 137], [61, 138], [62, 138], [63, 138], [109, 138], [63, 139], [64, 139], [108, 139], [65, 140], [66, 140], [108, 140], [66, 141], [67, 141], [107, 141], [68, 142], [69, 142], [106, 142], [107, 142], [69, 143], [70, 143], [106, 143], [71, 144], [72, 144], [105, 144], [106, 144], [2, 145], [3, 145], [72, 145], [73, 145], [105, 145], [3, 146], [4, 146], [74, 146], [75, 146], [104, 146], [4, 147], [76, 147], [77, 147], [104, 147], [5, 148], [77, 148], [78, 148], [103, 148], [5, 149], [6, 149], [79, 149], [80, 149], [102, 149], [103, 149], [6, 150], [80, 150], [81, 150], [101, 150], [102, 150], [82, 151], [83, 151], [101, 151], [83, 152], [84, 152], [100, 152], [85, 153], [86, 153], [99, 153], [100, 153], [86, 154], [87, 154], [99, 154], [88, 155], [89, 155], [98, 155], [89, 156], [90, 156], [98, 156], [91, 157], [92, 157], [97, 157], [92, 158], [93, 158], [94, 159], [95, 159], [169, 160], [177, 167]]

  let image_width = 200
  let image_height = 200
  let diag = Math.sqrt(image_width*image_width + image_height*image_height)
  let image_max = Math.max(image_width, image_height)

  // function performing the actual hough transform
  function r(theta, x, y) {
    return x * Math.cos(theta*2*Math.PI/360) + y * Math.sin(theta*2*Math.PI/360);
  }

  // create graphs
  let svg = d3.select("#svg3");
  let svg2 = d3.select("#svg4");

  let canvas = document.getElementById("mycanvas");

  set_canvas_size();


  // axis scales
  let xScale = d3.scaleLinear()
                 .domain([0, image_max])
                 .range([padding + scale_padding, w - padding]);
  let yScale = d3.scaleLinear()
                 .domain([image_max, 0])
                 .range([h - padding - scale_padding, padding]);
  let xScale2 = d3.scaleLinear()
                  .domain([0, 180])
                  .range([padding + scale_padding, w - padding])
  let yScale2 = d3.scaleLinear()
                  .domain([-300, 300])
                  .range([h - padding - scale_padding, padding]);


  let hough_range = d3.range(0, 180, 1);


  // axis
  let xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5)
  let yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
  let xAxis2 = d3.axisBottom()
                 .scale(xScale2)
                 .tickValues(d3.range(0, 190, 60));
  let yAxis2 = d3.axisLeft()
                 .scale(yScale2)
                 .ticks(5);
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (h -  padding - scale_padding) + ")")
     .call(xAxis);
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + (padding + scale_padding) + ",0)")
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
      .attr("x", xScale(195))
      .attr("y", yScale(195))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("x");
  svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(5))
      .attr("y", yScale(10))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("y");
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", xScale2(175))
      .attr("y", yScale2(15))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("Θ")
  svg2.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale2(5))
      .attr("y", yScale2(270))
      //.attr("font-style", "italic")
      .attr("font-size", "10pt")
      .text("d");


  // plot lines in second plot

  function plot_line(point){
    scale_factor = document.getElementById('svg4').getBoundingClientRect().width / w;
    xScaleCanvas = d3.scaleLinear()
                         .domain([0, 180])
                         .range([(padding + scale_padding)*scale_factor, (w - padding)*scale_factor])
    yScaleCanvas = d3.scaleLinear()
                         .domain([-300, 300])
                         .range([(h - padding - scale_padding)*scale_factor, padding*scale_factor]);

  /*
    svg2.append("path")
        .classed("hough-line", true)
    	  .datum(hough_range)
        .attr("fill", "none")
        .attr("stroke", "black")
      .attr('stroke-opacity', 0.05)
        .attr("stroke-width", 1)
    	  .attr("d", line);
  */
    let context = canvas.getContext("2d");
    const line2 = d3.line()
      .x(d => xScaleCanvas(d))
      .y(d => yScaleCanvas(r(d, point[0], point[1])))
      .context(context);

    context.beginPath();
    line2(hough_range);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(0, 0, 0, 0.05)";
    context.stroke();
    context.closePath();
  }

  function clear_canvas(){
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function plot_point(point){
    let line = d3.line()
                 .x(d => xScale2(d))
                 .y(d => yScale2(r(d, point[0], point[1])));

    svg.append("rect").attr("x", xScale(point[0]))
                      .attr("y", yScale(point[1]))
                      .attr("fill", "black")
                      .attr("width", 1.5)
                      .attr("height", 1.5);
  }

  function plot_next(){
    plot_line(data[idx])
    //plot_point(data[idx])
    idx++
    if (idx < data.length){
      setTimeout(plot_next, 5)
    }
  }

  function set_canvas_size(){
    let w = document.getElementById('svg4').getBoundingClientRect().width;
    let h = document.getElementById('svg4').getBoundingClientRect().height;
    document.getElementById("mycanvas").width = w;
    document.getElementById("mycanvas").height = h;
  }

  function update_canvas_size() {
    console.log("update")
    set_canvas_size();
    clear_canvas();
    data.forEach(p => plot_line(p));
  }

  data.forEach(p => plot_line(p));
  data.forEach(p => plot_point(p));

  //plot_next();








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
          .attr("stroke", "darkred")
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

  svg2.on("mouseenter", handleMouseOver2)
     .on("mousemove", handleMouseMove2)
     .on("mouseleave", handleMouseOut2);

  function calcHoverLines2(theta, d) {
    var p2 = [Math.cos(theta*2*Math.PI/360)*d, Math.sin(theta*2*Math.PI/360)*d];
    var p3 = [p2[0] + Math.cos((theta-90)*2*Math.PI/360)*diag,
              p2[1] + Math.sin((theta-90)*2*Math.PI/360)*diag]
    var p4 = [p2[0] + Math.cos((theta+90)*2*Math.PI/360)*diag,
              p2[1] + Math.sin((theta+90)*2*Math.PI/360)*diag]
    d3.selectAll("#hover-line-3")
        .attr("x1", xScale(p3[0]))
        .attr("y1", yScale(p3[1]))
        .attr("x2", xScale(p4[0]))
        .attr("y2", yScale(p4[1]));
  }

  function handleMouseOver2(){
    svg.append("line")
       .attr("id", "hover-line-3")
       .attr("stroke", "darkred")
       .attr("stroke-width", 1.5)
    calcHoverLines2(xScale2.invert(d3.mouse(this)[0]), yScale2.invert(d3.mouse(this)[1]));
  }

  function handleMouseMove2() {
    calcHoverLines2(xScale2.invert(d3.mouse(this)[0]), yScale2.invert(d3.mouse(this)[1]));
  }

  function handleMouseOut2(){
    d3.selectAll("#hover-line-3").remove();
  }


})();
