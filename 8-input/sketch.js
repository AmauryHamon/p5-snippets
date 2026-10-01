// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let nameInput;
let button;
let greeting;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("orangered");

  greeting = createElement("h2", "What is your name?");
  greeting.position(width / 2 - 100, height / 4 );

  nameInput = createInput();
  nameInput.position(width / 2 - 100, height / 4 * 3);

  let button = createButton("Submit");
  button.position(nameInput.x + nameInput.width, nameInput.y);

  button.mousePressed(greet);

}

function draw() {
  

  
}

function greet() {
  const name = nameInput.value();
  greeting.html(`Hello ${name}!`);
  nameInput.value('');

  textSize(100);
  textAlign(CENTER, CENTER);
  text(name, width / 2, height / 2);
}
