
const canvas = document.getElementById('paint');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
let drawing = false;
let pathsry = [];
let points = [];
let color = 'black';
let size = 1;

var mouse = { x: 0, y: 0 };
var previous = { x: 0, y: 0 };

function changeSize(setSize) {
    document.querySelector("div.sizes > div.active").classList.remove("active");
    document.querySelector(".size-" + setSize).classList.add("active");
    size = setSize;
}

function changeColor(setColor) {
    document.querySelector("div.colors > div.active").classList.remove("active");
    document.querySelector('.' + setColor).classList.add("active");
    color = setColor;
}

canvas.addEventListener('mousedown', function (e) {
    drawing = true;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    previous = { x: mouse.x, y: mouse.y };
    mouse = oMousePos(canvas, e);
    points = [];
    points.push({ x: mouse.x, y: mouse.y })
});

canvas.addEventListener('mousemove', function (e) {
    if (drawing) {
        previous = { x: mouse.x, y: mouse.y };
        mouse = oMousePos(canvas, e);
        // saving the points in the points array
        points.push({ x: mouse.x, y: mouse.y })
        // drawing a line from the previous point to the current point
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
}, false);


canvas.addEventListener('mouseup', function () {
    drawing = false;
    // Adding the path to the array or the paths
    pathsry.push({ points: points, color: color, size: size});
}, false);


undo.addEventListener("click", undoDraw);
clear.addEventListener("click", clearDraw);
download.addEventListener("click", downloadDraw);

function undoDraw() {
    pathsry.splice(-1, 1);
    drawPaths();
}
function clearDraw() {
    pathsry.length = 0;
    drawPaths();
}
function downloadDraw() {
    const canvas = document.getElementById("paint");
    const dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
    const newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
    ctx.toDataURL("image/png");
}

function drawPaths() {
    // delete everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw all the paths in the paths array
    pathsry.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size;
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();
    })
}

// a function to detect the mouse position
function oMousePos(canvas, evt) {
    var ClientRect = canvas.getBoundingClientRect();
    return { //objeto
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
    }
}

dragElement(document.getElementById("panel"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
