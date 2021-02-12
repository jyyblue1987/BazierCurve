function generate_random_circles() {

    var mydata = []
    for (i = 0; i < 20; i++) {
        mydata.push({
            x: Math.random() * 400,
            y: Math.random() * 300,
            radius: 7,
            color: "gray"
        });
    }

    var circles = d3.select('#part_1')
    var update = circles.selectAll("circle").data(mydata);
    update.exit().remove();
    update.enter().append("circle").merge(update)
        .attr("cx", function(data, index) {
            return data.x;
        })
        .attr("cy", function(data, index) {
            return data.y;
        })
        .attr("r", function(data, index) {
            return data.radius;
        })
        .style("fill", function(data, index) {
            return data.color;
        })

}

function remove_circles() {
    var rem = d3.select('#part_1')
    var remo = rem.selectAll("circle").remove();
}