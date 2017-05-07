function createGraph1(){
  var margin = {top: 45, right: 20, bottom: 40, left: 65},
      width = 900 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#graph1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("Graph1Data.csv",function(error,data){
    var count = 0;
    var yAxisTitles = ["BAYVIEW","CENTRAL","INGLESIDE","MISSION","NORTHERN","PARK","RICHMOND","SOUTHERN","TARAVAL","TENDERLOIN"];
    var districtCounter = [0,0,0,0,0,0,0,0,0,0];

    data.forEach(function(d){
      if(d.PdDistrict === "BAYVIEW"){
        districtCounter[0] = districtCounter[0]+1;
      }else if(d.PdDistrict === "CENTRAL"){
        districtCounter[1] = districtCounter[1]+1;
      }else if(d.PdDistrict === "INGLESIDE"){
        districtCounter[2] = districtCounter[2]+1;
      }else if (d.PdDistrict === "MISSION"){
        districtCounter[3] = districtCounter[3]+1;
      }else if (d.PdDistrict === "NORTHERN"){
        districtCounter[4] = districtCounter[4]+1;
      }else if(d.PdDistrict === "PARK"){
        districtCounter[5] = districtCounter[5]+1;
      }else if(d.PdDistrict === "RICHMOND"){
        districtCounter[6] = districtCounter[6]+1;
      }else if(d.PdDistrict === "SOUTHERN"){
        districtCounter[7] = districtCounter[7]+1;
      }else if(d.PdDistrict === "TARAVAL"){
        districtCounter[8] = districtCounter[8]+1;
      }else if(d.PdDistrict === "TENDERLOIN"){
        districtCounter[9] = districtCounter[9]+1;
      }
    });

    var data1 = [
    {name: yAxisTitles[0],    value:  districtCounter[0]},
    {name: yAxisTitles[1],    value:  districtCounter[1]},
    {name: yAxisTitles[2],    value:  districtCounter[2]},
    {name: yAxisTitles[3],    value:  districtCounter[3]},
    {name: yAxisTitles[4],    value:  districtCounter[4]},
    {name: yAxisTitles[5],    value:  districtCounter[5]},
    {name: yAxisTitles[6],    value:  districtCounter[6]},
    {name: yAxisTitles[7],    value:  districtCounter[7]},
    {name: yAxisTitles[8],    value:  districtCounter[8]},
    {name: yAxisTitles[9],    value:  districtCounter[9]}
  ];
  
    x.domain(data1.map(function(d) { return d.name; }));
    y.domain([0, 30000]);

    svg.selectAll(".bar")
          .data(data1)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("width", x.bandwidth() - 20) // width of the bar
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .style("fill",function(d){
          	if(d.value < 10000){
          		return "#ff704d";
          	}else if(d.value > 10000 && d.value < 15000){
          		return "#ff3300";
          	}else if(d.value > 15000 && d.value < 20000){
          		return "#cc2900";
          	}else{
          		return "#b32400";
          	}
          })
          .attr("transform","translate(10,0)"); // center the bar

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //add graph titles
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "30px") 
      .style("text-decoration", "underline")  
      .text("Number of Crimes of Different Districts");
        
  	});

  //Add axis titles 
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width - 350)
	    .attr("y", height + 40)
	    .attr("font-size", "20px")
	    .text("Distrcit Names");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", -65)
	    .attr("x",-140)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .attr("font-size", "20px")
	    .text("Number of Crimes");
}
createGraph1();

//////////////////////////////////////////////////////////
//Graph 2

function createGraph2(district){
  var width = 400;
  var height = 400;
  var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory20b);

  var legendRectSize = 18;  
  var legendSpacing = 4;

  var svg = d3.select('#'+district+'Graph')
    .append('svg')
    .attr('width', width+300)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
      ',' + (height / 2) + ')');

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  //Tool Tip Initialization
  var tooltip = d3.select('#'+district+'Graph')
    .append('div')
    .attr('class','tooltip');
  tooltip.append('div')
    .attr('class','type');
  tooltip.append('div')
    .attr('class','count');
  tooltip.append('div')
    .attr('class','percent');
  
  district = district.toUpperCase();
  d3.csv("Graph2Data.csv",function(error,data){
    var crimeType = ["ASSAULT","BURGLARY","DRUG/NARCOTIC","LARCENY/THEFT",
                    "NON-CRIMINAL","VANDALISM","WEAPON LAWS", "WARRANTS",
                    "VEHICLE THEFT","ROBBERY","OTHER OFFENSES"];
    var crimeCounter = [0,0,0,0,0,0,0,0,0,0,0];
    var counter = 0;
    data.forEach(function(d){
      if(d.PdDistrict == district){
        if(d.Category === crimeType[0]){
          crimeCounter[0] = crimeCounter[0]+1;
        }else if(d.Category === crimeType[1]){
          crimeCounter[1] = crimeCounter[1]+1;
        }else if(d.Category === crimeType[2]){
          crimeCounter[2] = crimeCounter[2]+1;
        }else if(d.Category === crimeType[3]){
          crimeCounter[3] = crimeCounter[3]+1;
        }else if(d.Category === crimeType[4]){
          crimeCounter[4] = crimeCounter[4]+1;
        }else if(d.Category === crimeType[5]){
          crimeCounter[5] = crimeCounter[5]+1;
        }else if(d.Category === crimeType[6]){
          crimeCounter[6] = crimeCounter[6]+1;
        }else if(d.Category === crimeType[7]){
          crimeCounter[7] = crimeCounter[7]+1;
        }else if(d.Category === crimeType[8]){
          crimeCounter[8] = crimeCounter[8]+1;
        }else if(d.Category === crimeType[9]){
          crimeCounter[9] = crimeCounter[9]+1;
        }else{
          crimeCounter[10] = crimeCounter[10]+1;
        }
        counter++;
      }
    });
    
    
    var data1 = [
    {type: crimeType[0], percent:crimeCounter[0]/counter,count:crimeCounter[0]},
    {type: crimeType[1], percent:crimeCounter[1]/counter,count:crimeCounter[1]},
    {type: crimeType[2], percent:crimeCounter[2]/counter,count:crimeCounter[2]},
    {type: crimeType[3], percent:crimeCounter[3]/counter,count:crimeCounter[3]},
    {type: crimeType[4], percent:crimeCounter[4]/counter,count:crimeCounter[4]},
    {type: crimeType[5], percent:crimeCounter[5]/counter,count:crimeCounter[5]},
    {type: crimeType[6], percent:crimeCounter[6]/counter,count:crimeCounter[6]},
    {type: crimeType[7], percent:crimeCounter[7]/counter,count:crimeCounter[7]},
    {type: crimeType[8], percent:crimeCounter[8]/counter,count:crimeCounter[8]},
    {type: crimeType[9], percent:crimeCounter[9]/counter,count:crimeCounter[9]},
    {type: crimeType[10],percent:crimeCounter[10]/counter,count:crimeCounter[10]}
    ];
    var pie = d3.pie()
      .value(function(d) { return d.percent; })
      .sort(null);
    var path = svg.selectAll('path')
      .data(pie(data1))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        return color(d.data.type);
      });

    path.on('mouseover', function(d) {
      tooltip.select('.type').html(d.data.type);
      tooltip.select('.count').html(d.data.count);
      tooltip.select('.percent').html((Math.round(d.data.percent * 10000) / 100)+'%');
      tooltip.style('display', 'block');
    });

    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });

    path.on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX + 10) + 'px');
    });

    //handles the legend of the Graph
    var legend = svg.selectAll('.legend')                     
      .data(color.domain())                                   
      .enter()                                                
      .append('g')                                            
      .attr('class', 'legend')                                
      .attr('transform', function(d, i) {                     
        var height = legendRectSize + legendSpacing;          
        var offset =  height * color.domain().length / 2;     
        var horz = 15 * legendRectSize;                       
        var vert = i * height - offset;                       
        return 'translate(' + horz + ',' + vert + ')';        
      });                                                     

    legend.append('rect')                                     
      .attr('width', legendRectSize)                          
      .attr('height', legendRectSize)                         
      .style('fill', color)                                   
      .style('stroke', color);                                
    legend.append('text') 
      .data(data1)                                  
      .attr('x', legendRectSize + legendSpacing)              
      .attr('y', legendRectSize - legendSpacing)           
      .text(function(d) { return d.type+ ":"+Math.round(d.percent * 100) / 100; });

    //handles the tool-tip

   

  });
}

createGraph2("southern");
createGraph2('richmond');



////////////////////////////////////////////////////
/////Graph 3 
function createGraph3(){
  var margin = {top: 20, right: 20, bottom: 55, left: 75},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]); //scale by time only if we had use the time parser 
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return  x(d.time); })
      .y(function(d) { return y(d.count); });


  //tool tip
  var div = d3.select("body").append("div") 
    .attr("class", "tooltipGraph3")       
    .style("opacity", 0);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  var svg = d3.select("#graph3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("Graph3Data.csv",function(error,data){
    if(error) throw error;
    var time = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var timeRanges = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17',
              '18','19','20','21','22','23'];


    data.forEach(function(d){
      if(d.Time[0] === timeRanges[0]){
        time[0] = time[0]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === ":"){
        time[1] = time[1]+1;
      }else if(d.Time[0] === timeRanges[2] && d.Time[1] === ":"){
        time[2] = time[2]+1;
      }else if(d.Time[0] === timeRanges[3]){
        time[3] = time[3]+1;
      }else if(d.Time[0] === timeRanges[4]){
        time[4] = time[4]+1;
      }else if(d.Time[0] === timeRanges[5]){
        time[5] = time[5]+1;
      }else if(d.Time[0] === timeRanges[6]){
        time[6] = time[6]+1;
      }else if(d.Time[0] === timeRanges[7]){
        time[7] = time[7]+1;
      }else if(d.Time[0] === timeRanges[8]){
        time[8] = time[8]+1;
      }else if(d.Time[0] === timeRanges[9]){
        time[9] = time[9]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "0"){
        time[10] = time[10]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "1"){
        time[11] = time[11]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "2"){
        time[12] = time[12]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "3"){
        time[13] = time[13]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "4"){
        time[14] = time[14]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "5"){
        time[15] = time[15]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "6"){
        time[16] = time[16]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "7"){
        time[17] = time[17]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "8"){
        time[18] = time[18]+1;
      }else if(d.Time[0] === timeRanges[1] && d.Time[1] === "9"){
        time[19] = time[19]+1;
      }else if(d.Time[0] === timeRanges[2] && d.Time[1] === "0"){
        time[20] = time[20]+1;
      }else if(d.Time[0] === timeRanges[2] && d.Time[1] === "1"){
        time[21] = time[21]+1;
      }else if(d.Time[0] === timeRanges[2] && d.Time[1] === "2"){
        time[22] = time[22]+1;
      }else if(d.Time[0] === timeRanges[2] && d.Time[1] === "3"){
        time[23] = time[23]+1;
      }
    });
    
    var data1 = [];
    var len = time.length;
    for(var i = 0; i < len;i++){
      data1.push({
        time:timeRanges[i],
        count:time[i]
      });
    }

    data1.forEach(function(d){
      d.time = +d.time;
      d.count = +d.count;
    });


    // Scale the range of the data
    x.domain(d3.extent(data1, function(d) { return d.time; })); //not changing x-axis values
    y.domain([0, d3.max(data1, function(d) { return d.count; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data1));

    //Add the points for the scatter plot
    svg.selectAll("dot")  
        .data(data1)     
    .enter().append("circle")               
        .attr("r", 5)   
        .attr("cx", function(d) { return x(d.time); })     
        .attr("cy", function(d) { return y(d.count); })   
        .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(d.time + "<br/>"  + d.count)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Add axis titles
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width - 320)
        .attr("y", height + 50)
        .attr("font-size", "20px")
        .text("Hour of the Day (24 Hour Clock)");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -65)
        .attr("x",-140)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "20px")
        .text("Number of Crimes");
  });
}
createGraph3();