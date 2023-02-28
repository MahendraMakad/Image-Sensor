const fileInput = document.getElementById('myfile');
const imagePreview = document.getElementById('image-preview');
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

button1.addEventListener("click", () => {
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
<input type="color" id="favcolor" name="favcolor" value="#ff0000">
</div>`;

// Add event listener to button 3 
button3.addEventListener("click", () => {
  button3.style.backgroundColor =
    content.innerHTML = html3;
});

//changes to the file input
fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    imagePreview.src = reader.result;
    imagePreview.style.width = "350px";
    imagePreview.style.height = "300px";
  };
  reader.readAsDataURL(file);
  $('#myfile').css("display", "none");
}
);