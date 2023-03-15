// Select the input file element
const fileInput = document.querySelector('#file-input');
var originalData;
var x1,y1,x2,y2;
var canvas = document.getElementById('image-canvas');
var ctx = canvas.getContext("2d");


$('#file-input').change(function () {
    var file = this.files[0];
    var image = new Image();

    // Load the image into the canvas and resize it
    var reader = new FileReader();
    reader.onload = function (event) {
        image.src = event.target.result;
        image.onload = function () {
            var canvasWidth = image.width;
            var canvasHeight = image.height;
            if (canvasWidth > 300) {
                canvasHeight = canvasHeight * (300 / canvasWidth);
                canvasWidth = 300;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
            $('#image-preview').attr('src', canvas.toDataURL()).css('display', 'inline');
            originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const initImgAreaSelect = function () {
                console.log("function is called");
                var selectionArea;
                $('#image-preview').imgAreaSelect({
                    handles: true,
                    onSelectEnd: function (img, selection) {
                        selectedArea = selection; // set the global variable
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
                                pixelate();
                            }
                        }, 1000);
                    },
                    onSelectChange: function(img,selection) {
                        selectionArea = selection;
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
                                pixelate();
                            }
                        }, 1000);
                    }
                });
            };
            if (canvas.width && canvas.height) {
                console.log("canvas is complete");
                initImgAreaSelect();
            } else {
                console.log("canvas is not complete");
                canvas.addEventListener('load', initImgAreaSelect);
            }
        };
    };
    reader.readAsDataURL(file);
});


// function to pixelate selected image area
function pixelate() {
    ctx.putImageData(originalData, 0, 0);
    var canvasX1, canvasY1, canvasX2, canvasY2;
    let pixelSize = 10;
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
