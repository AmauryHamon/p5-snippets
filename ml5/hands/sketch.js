// https://p5js.org/tutorials/speak-with-your-hands/

let handPose;
let hands = [];
let video;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  img = await new Promise((resolve, reject) =>
    loadImage("assets/hand.jpg", resolve, reject)
  );

  handPose = ml5.handPose();
  await handPose.ready
  handPose.detectStart(video, gotHands);
}

function draw() {

  image(video, 0, 0, width, height);

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function gotHands(results){
  hands = results;
}
