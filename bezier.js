function generate_bezier_curve() {
    // initialize
    const
        svg = document.getElementById('mysvg'),
        NS = svg.getAttribute('xmlns'),
        vb = svg.getAttribute('viewBox').split(' ').map(v => +v),
        box = {
            xMin: vb[0],
            xMax: vb[0] + vb[2] - 1,
            yMin: vb[1],
            yMax: vb[1] + vb[3] - 1
        }
    node = {};

    'p1,p2,c1,c2,l1,l2,l3,curve,path'.split(',').map(s => {
        node[s] = document.getElementById(s);
    });

    // events
    svg.addEventListener('pointerdown', dragHandler);
    document.addEventListener('pointermove', dragHandler);
    document.addEventListener('pointerup', dragHandler);

    drawCurve();


    // drag handler
    let drag;

    function dragHandler(event) {

        event.preventDefault();

        const
            target = event.target,
            type = event.type,
            svgP = svgPoint(svg, event.clientX, event.clientY);

        // fill toggle
        if (!drag && type === 'pointerdown' && target === node.curve) {

            node.curve.classList.toggle('fill');
            drawCurve();

        }

        // start drag
        if (!drag && type === 'pointerdown' && target.classList.contains('control')) {

            drag = {
                node: target,
                start: getControlPoint(target),
                cursor: svgP
            };

            drag.node.classList.add('drag');

        }

        // move element
        if (drag && type === 'pointermove') {

            updateElement(
                drag.node, {
                    cx: Math.max(box.xMin, Math.min(drag.start.x + svgP.x - drag.cursor.x, box.xMax)),
                    cy: Math.max(box.yMin, Math.min(drag.start.y + svgP.y - drag.cursor.y, box.yMax))
                }
            );

            drawCurve();

        }

        // stop drag
        if (drag && type === 'pointerup') {

            drag.node.classList.remove('drag');
            drag = null;

        }

    }


    // translate page to SVG co-ordinate
    function svgPoint(element, x, y) {

        var pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(element.getScreenCTM().inverse());

    }


    // update element
    function updateElement(element, attr) {

        for (a in attr) {
            let v = attr[a];
            element.setAttribute(a, isNaN(v) ? v : Math.round(v));
        }

    }


    // get control point location
    function getControlPoint(circle) {

        return {
            x: Math.round(+circle.getAttribute('cx')),
            y: Math.round(+circle.getAttribute('cy'))
        }

    }

    // update curve
    function drawCurve() {

        const
            p1 = getControlPoint(node.p1),
            p2 = getControlPoint(node.p2),
            c1 = getControlPoint(node.c1);
            c2 = getControlPoint(node.c2);

        // control line 1
        updateElement(
            node.l1, {
                x1: p1.x,
                y1: p1.y,
                x2: c1.x,
                y2: c1.y
            }
        );

        // control line 2
        updateElement(
            node.l2, {
                x1: p2.x,
                y1: p2.y,
                x2: c2.x,
                y2: c2.y
            }
        );

        // control line 3
        updateElement(
            node.l3, {
                x1: c1.x,
                y1: c1.y,
                x2: c2.x,
                y2: c2.y
            }
        );

        var mydata = []
       

        for (var i=0; i<=1; i+=0.05){
            var p = getBezierXY(i, p1.x, p1.y, c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
            
            mydata.push({
                x: p.x,
                y: p.y,
                radius: 3,
                color: "black"
            });
        }

        var pt_array = [p1, c1, c2, p2];
        for(i = 0; i < pt_array.length; i++)
        {
            mydata.push({
                x: pt_array[i].x,
                y: pt_array[i].y,
                radius: 5,
                color: "black"
            });
        }

        var circles = d3.select('#part_2')
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
}

function getBezierXY(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
    return {
      x: Math.pow(1-t,3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x 
        + 3 * t * t * (1 - t) * cp2x + t * t * t * ex,
      y: Math.pow(1-t,3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y 
        + 3 * t * t * (1 - t) * cp2y + t * t * t * ey
    };
}
