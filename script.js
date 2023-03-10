const fileInput = document.getElementById('myfile');
var imagePreview = document.getElementById('image-preview');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var originalData;// to store original image data for restoration
var selectedShape = "rectangle"; // global variable for selecting rectangle or ellipse shape
//global variable for selected area
var x1, y1, x2, y2, w, h;
// load image into canvas
$(document).ready(function () {
  $('#image-preview').imgAreaSelect({
    handles: true,
    onSelectEnd: function (img, selection) {
      var selectedArea = selection; // set the global variable
      setTimeout(function () {
        // use selectedArea after a delay of 1 second
        if (selectedArea !== null) {
          x1 = selectedArea.x1;
          y1 = selectedArea.y1;
          x2 = selectedArea.x2;
          y2 = selectedArea.y2;
          w = selection.width;
          h = selection.height;
          console.log(x1, y1, x2, y2);
          // perform further processing
        }
      }, 1000);
    }
  });

});

// 3 buttons
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
var content = document.getElementById('block-space');
// html for buttons
// Define the HTML content for each button
// html for button1(pixelate button)
const html1 = `<h4 style="width: 110px">Block size(px)</h4>
<div class="is-flex">
<input type="text" class="mr-2" value="50" id="sliderValue" style="width:30px">
<input type="range" min="0" max="100" value="50" id="slider">
</div>`;

// selecting rectangle shape
document.getElementById("rectangle").addEventListener("click", () => {
  document.getElementById("rectangle").style.backgroundColor = "#171b68";
  document.getElementById("ellipse").style.backgroundColor = "#171b68";
  document.getElementById("rectangle").style.backgroundColor = "#6262cd";
  selectedShape = "rectangle";
  console.log(selectedShape);
});

// selecting ellipse shape
document.getElementById("ellipse").addEventListener("click", () => {
  document.getElementById("rectangle").style.backgroundColor = "#171b68";
  document.getElementById("ellipse").style.backgroundColor = "#171b68";
  document.getElementById("ellipse").style.backgroundColor = "#6262cd";
  selectedShape = "ellipse";
  console.log(selectedShape);
});

// loading dynamic html for button1
button1.addEventListener("click", () => {
  button1.style.backgroundColor = "#171b68";
  button2.style.backgroundColor = "#171b68";
  button3.style.backgroundColor = "#171b68";
  button1.style.backgroundColor = "#6262cd";
  clickedButton = 1;
  content.innerHTML = html1;
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("sliderValue");
  slider.addEventListener("input", () => {
    sliderValue.value = slider.value;
  });

  sliderValue.addEventListener("input", () => {
    slider.value = sliderValue.value;
  });
});



// html for button 2(Blur button)
const html2 = `<h4 style="width: 60px">Radius</h4>
<div class="is-flex">
<input type="text" class="mr-2" value="50" id="sliderValue" style="width:30px">
<input type="range" min="0" max="100" value="50" id="slider">
</div>`;

// Add event listeners to the button2
button2.addEventListener("click", () => {
  button1.style.backgroundColor = "#171b68";
  button2.style.backgroundColor = "#171b68";
  button3.style.backgroundColor = "#171b68";
  button2.style.backgroundColor = "#6262cd";
  clickedButton = 2;
  content.innerHTML = html2;
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("sliderValue");
  slider.addEventListener("input", () => {
    sliderValue.value = slider.value;
  });

  sliderValue.addEventListener("input", () => {
    slider.value = sliderValue.value;
  });
});

// html for button 3
const html3 = `<h4 style="width: 60px">Color</h4>
<div class="is-flex">
<input type="color" id="myColor" name="myColor" value="#ff0000">
</div>`;

// Add event listener to button 3 
button3.addEventListener("click", () => {
  button1.style.backgroundColor = "#171b68";
  button2.style.backgroundColor = "#171b68";
  button3.style.backgroundColor = "#171b68";
  button3.style.backgroundColor = "#6262cd";
  clickedButton = 3;
  content.innerHTML = html3;
});

$('#myfile').change(function () {
  var file = this.files[0];
  var image = new Image();
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');

  // Load the image into the canvas and resize it
  var reader = new FileReader();
  reader.onload = function (event) {
    image.src = event.target.result;
    image.onload = function () {
      var canvasWidth = image.width;
      var canvasHeight = image.height;
      if (canvasWidth > 500) {
        canvasHeight = canvasHeight * (500 / canvasWidth);
        canvasWidth = 500;
      }
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      $('#image-preview').attr('src', canvas.toDataURL()).css('display', 'inline');
      originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(file);
});



// working of sensor button
function sensor() {
  if (clickedButton == 1) {
    pixelate();
  }
  else if (clickedButton == 2) {
    blur();
  }
  else if (clickedButton == 3) {
    color();
  }
}

// function to pixelate selected image area
function pixelate() {
  ctx.putImageData(originalData, 0, 0);
  var canvasX1, canvasY1, canvasX2, canvasY2;
  let pixelSize = document.getElementById("sliderValue").value;
  pixelSize = parseInt(pixelSize);
  pixelSize = pixelSize / 5;
  var img = $('img#image-preview')[0];
  var imgWidth = img.naturalWidth;
  var imgHeight = img.naturalHeight;
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var ratioX = canvasWidth / imgWidth;
  var ratioY = canvasHeight / imgHeight;
  canvasX1 = x1 * ratioX;
  canvasY1 = y1 * ratioY;
  canvasX2 = x2 * ratioX;
  canvasY2 = y2 * ratioY;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (var y = canvasY1; y < canvasY2; y += pixelSize) {
    for (var x = canvasX1; x < canvasX2; x += pixelSize) {
      var red = 0;
      var green = 0;
      var blue = 0;
      var count = 0;

      // Calculate the average color of the surrounding pixels.
      for (var dy = 0; dy < pixelSize; dy++) {
        for (var dx = 0; dx < pixelSize; dx++) {
          var index = ((y + dy) * imageData.width + (x + dx)) * 4;
          red += imageData.data[index];
          green += imageData.data[index + 1];
          blue += imageData.data[index + 2];
          count++;
        }
      }

      red /= count;
      green /= count;
      blue /= count;

      // Set the color of the pixel to the average color of the surrounding pixels.
      for (var dy = 0; dy < pixelSize; dy++) {
        for (var dx = 0; dx < pixelSize; dx++) {
          var index = ((y + dy) * imageData.width + (x + dx)) * 4;
          imageData.data[index] = red;
          imageData.data[index + 1] = green;
          imageData.data[index + 2] = blue;
        }
      }
    }
  }

  // Update the canvas with the modified image data.
  ctx.putImageData(imageData, 0, 0);
  console.log("pixelated");
  //   }
  //  });

}




// function to blur selected image area
function blur() {
  ctx.putImageData(originalData, 0, 0);
  let radius = document.getElementById("sliderValue").value;
  radius = parseInt(radius);
  blurRegion(x1, y1, w, h, radius / 10);
}

function blurRegion(x, y, width, height, radius) {
  const blurAmount = Math.min(radius, 10); // Set a maximum blur radius of 10 pixels
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(canvas, x, y, width, height,x,y,width,height);
}

// function to color selected image area
function color() {
  ctx.putImageData(originalData, 0, 0);
  let color = document.getElementById("myColor").value;
  if (selectedShape == "rectangle") {
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, w, h);
  }
  else {
    ctx.ellipse(x1 + w / 2, y1 + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

//add eventListner to JPG download button
// add event listener to button
document.getElementById("imageJPG").addEventListener("click", function () {
  // get the canvas data as a JPG image
  let imageData = canvas.toDataURL("image/jpeg");

  // create a link element and set its download attribute
  const link = document.createElement("a");
  link.download = "img.jpg";

  // set the href attribute to the canvas data
  link.href = imageData;

  // add the link to the document and simulate a click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


//add eventListner to PNG download button
// add event listener to button
document.getElementById("imagePNG").addEventListener("click", function () {
  // get the canvas data as a JPG image
  let imageData = canvas.toDataURL("image/png");

  // create a link element and set its download attribute
  const link = document.createElement("a");
  link.download = "img.png";

  // set the href attribute to the canvas data
  link.href = imageData;

  // add the link to the document and simulate a click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
