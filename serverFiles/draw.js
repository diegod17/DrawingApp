const canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 400;

let context = canvas.getContext("2d");
let startColor = "white";
context.fillStyle = startColor;
context.fillRect(0, 0, canvas.width, canvas.height);

let drawTool = "pen"

let drawColor = "black";
let drawSize = "2";
let isDrawing = false;
var startX;
var startY;

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

let prevStrokes = [];
let index = -1;

canvas.addEventListener("touchstart",start, false);
canvas.addEventListener("touchmove",draw, false);
canvas.addEventListener("mousedown",start, false);
canvas.addEventListener("mousemove",draw, false);

canvas.addEventListener("touchend",stop, false);
canvas.addEventListener("mouseup",stop, false);
canvas.addEventListener("mouseout",stop, false);

function start(event) {
	isDrawing = true;
	context.beginPath();
	context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

	event.preventDefault();
}

function changeColor(color) {
	drawColor = color.style.background;
	drawTool = "pen";
}

function erase() {
	drawColor = "white";
}

function background() {
	//need to only fill specific portions of drawing
	context.fillStyle = drawColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw(event) {
	console.log(drawTool);
	if (drawTool == "pen") {
		if(isDrawing) {
			context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
			context.strokeStyle = drawColor;
			context.lineWidth = drawSize;
			context.lineCap = "round";
			context.lineJoin = "round";
			context.stroke();
			
		}
	}
	if (drawTool == "rectangle") {
		mouseX = parseInt(event.clientX - offsetX);
	    mouseY = parseInt(event.clientY - offsetY);
		if (isDrawing) {
	        
	        context.beginPath();
	        context.fillStyle = drawColor;
	        context.rect(startX, startY, mouseX - startX, mouseY - startY);
	        context.fill();	       
	        canvas.style.cursor = "default";
	    } else {
	        
	        startX = mouseX;
	        startY = mouseY;
	        canvas.style.cursor = "crosshair";
	    }
    }
    if (drawTool == "circle") {
		mouseX = parseInt(event.clientX - offsetX);
	    mouseY = parseInt(event.clientY - offsetY);
		if (isDrawing) {
	        
	        context.beginPath();
	        context.fillStyle = drawColor;
	        context.arc(startX, startY, 1, 0, 2*Math.PI);
	        context.fill();	       
	        canvas.style.cursor = "default";
	    } else {
	        
	        startX = mouseX;
	        startY = mouseY;
	        canvas.style.cursor = "crosshair";
	    }
    }
	event.preventDefault();

}

function rectangle() {
	drawTool = "rectangle";
}

function stop(event) {
	if(isDrawing) {
		context.stroke();
		context.closePath();
		isDrawing = false;
	}
	event.preventDefault();

	if(event.type != 'mouseout'){
		prevStrokes.push(context.getImageData(0, 0, canvas.width, canvas.height));
		index += 1;
	}
}

function clearCanvas() {
	context.fillStyle = startColor;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);

	prevStrokes = []
	index = -1;
}

function undo() {
	if(index <= 0) {
		clearCanvas();
	}
	else{
		index -= 1
		prevStrokes.pop();
		context.putImageData(prevStrokes[index], 0, 0);
	}
}


let socket = io();
function setImage()
{
	//console.log(isCanvasBlank(document.getElementById("canvas")));
	if(!(isCanvasBlank(document.getElementById("canvas"))) && $('#username').val() != '') {
		var canvas = document.getElementById("canvas");
		var img    = canvas.toDataURL("image/png");
		const base64 = img.replace(/.*base64,/, '');
		socket.emit('base64file', base64,$('#username').val());
		clearCanvas();
		$('#username').val('Name');
		}
		//else
		//	console.log("error");
}

function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');

  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
//4294967295 is the pixel value for white
  return !pixelBuffer.some(color => color !== 4294967295);
}

