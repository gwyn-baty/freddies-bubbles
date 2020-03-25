// ---------
  // Functions
  // ---------

  var canvas = document.querySelector('canvas');
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
  var ctx = canvas.getContext('2d');
  var count = canvas.height;
  var bubbles = [];
  var bubbleCount = 30;
  var bubbleSpeed = 1;
  var popLines = 6;
  var popDistance = 40;
  var mouseOffset = {
    x: 0,
    y: 0
  }



  // --------------
  // Animation Loop
  // --------------

  function animate() {



    // ------------
    // Clear Canvas
    // ------------

    ctx.clearRect(0, 0, canvas.width, canvas.height);



    // ------------
    // Draw Bubbles
    // ------------

    ctx.beginPath();
    for (var i = 0; i < bubbles.length; i++) {
      // first num = distance between waves
      // second num = wave height
      // third num = move the center of the wave away from the edge
      bubbles[i].position.x = Math.sin(bubbles[i].count/bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff;
      bubbles[i].position.y = bubbles[i].count;
      bubbles[i].render();

      if(bubbles[i].count < 0 - bubbles[i].radius) {
        bubbles[i].count = canvas.height + bubbles[i].yOff;
      } else {
        bubbles[i].count -= bubbleSpeed;
      }
      
      if (bubbles[i].position.y <= 130) {
        bubbles[i].radius -= .2;
        if (bubbles[i].radius <= 0.2) {
          bubbles[i].popping = true;
          bubbles[i].resetPosition();
        }
      }
    }

    
    
    // ---------------
    // On Bubble Hover
    // ---------------

//     for (var i = 0; i < bubbles.length; i++) {
//       if(mouseOffset.x > bubbles[i].position.x - bubbles[i].radius && mouseOffset.x < bubbles[i].position.x + bubbles[i].radius) {
//         if(mouseOffset.y > bubbles[i].position.y - bubbles[i].radius && mouseOffset.y < bubbles[i].position.y + bubbles[i].radius) {
//           for (var a = 0; a < bubbles[i].lines.length; a++) {
//             popDistance = bubbles[i].radius * 0.5;
//             bubbles[i].lines[a].popping = true;
//             bubbles[i].popping = true;
//           }
//         }
//       }
//     }

//     window.requestAnimationFrame(animate);
//   }

//   window.requestAnimationFrame(animate);

    // ---------------
    // On Bubble Click
    // ---------------

    // change these two to make closer/further clicks pop bubbles
    var popRangeX = 3;
    var popRangeY = 3;
    
    for (var i = 0; i < bubbles.length; i++) {
      if(mouseClick.x > bubbles[i].position.x - (bubbles[i].radius * popRangeX) && mouseClick.x < bubbles[i].position.x + (bubbles[i].radius * popRangeX)) {
        if(mouseClick.y > bubbles[i].position.y - (bubbles[i].radius * popRangeY) && mouseClick.y < bubbles[i].position.y + (bubbles[i].radius * popRangeY)) {
        // if(mouseClick.y > bubbles[i].position.y - bubbles[i].radius && mouseClick.y < bubbles[i].position.y + bubbles[i].radius) {
          for (var a = 0; a < bubbles[i].lines.length; a++) {
            popDistance = bubbles[i].radius * 0.3;
            bubbles[i].lines[a].popping = true;
            bubbles[i].popping = true;
          }
        }
      }
    }

    mouseClick.x = -100;
    mouseClick.y = -100;
    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);


  // ------------------
  // Bubble Constructor
  // ------------------

  var createBubble = function() {
    this.position = {x: 0, y: 0};
    this.radius = 8 + Math.random() * 10;
    this.xOff = Math.random() * canvas.width - this.radius;
    this.yOff = Math.random() * canvas.height;
    this.distanceBetweenWaves = 50 + Math.random() * 40;
    this.count = canvas.height + this.yOff;
    //this.color = '#8bc9ee';
    var colorArray = ["#eb8533", "#462b2b"]; //, "#f1b52f"];
    // this.stroke = "#964b00";
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
    this.lines = [];
    this.popping = false;
    this.shrinkHeight = Math.floor(Math.random() * 150) + 20;

    // Populate Lines
    for (var i = 0; i < popLines; i++) {
      var tempLine = new createLine();
          tempLine.bubble = this;
          tempLine.index = i;

      this.lines.push(tempLine);
    }

    this.resetPosition = function() {
      this.position = {x: 0, y: 0};
      this.radius = 8 + Math.random() * 6;
      this.xOff = Math.random() * canvas.width - this.radius;
      this.yOff = Math.random() * canvas.height;
      this.distanceBetweenWaves = 50 + Math.random() * 40;
      this.count = canvas.height + this.yOff;
      this.popping = false;
    }

    // Render the circles
    this.render = function() {

      ctx.save();
      ctx.translate(this.position.x, this.position.y);

      if(!this.popping) {
        ctx.beginPath();
        
        // var colorArray = ["#ffa500", "#964b00", "#ffd700"];
        // ctx.strokeStyle = colorArray[Math.floor(Math.random()*colorArray.length)];

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);

        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      ctx.restore();

      // Draw the lines
      for (var a = 0; a < this.lines.length; a++) {
        if(this.lines[a].popping) {
          if(this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
            this.lines[a].popDistance += 0.06;
          } else {
            if(this.lines[a].popDistance >= 0) {
              this.lines[a].inversePop = true;
              this.lines[a].popDistanceReturn += 1;
              this.lines[a].popDistance -= 0.03;
            } else {
              this.lines[a].resetValues();
              this.resetPosition();
            }
          }

          this.lines[a].updateValues();
          this.lines[a].render();
        }
      }
    }
  }


  // ----------------
  // Populate Bubbles
  // ----------------

  for (var i = 0; i < bubbleCount; i++) {
    var tempBubble = new createBubble();

    bubbles.push(tempBubble);
  }



  // ----------------
  // Line Constructor
  // ----------------

  function createLine() {
    this.lineLength = 0;
    this.popDistance = 0;
    this.popDistanceReturn = 0;
    this.inversePop = false; // When the lines reach full length they need to shrink into the end position
    this.popping = false;

    this.resetValues = function() {
      this.lineLength = 0;
      this.popDistance = 0;
      this.popDistanceReturn = 0;
      this.inversePop = false;
      this.popping = false;

      this.updateValues();
    }

    this.updateValues = function() {
      this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) * Math.cos(2 * Math.PI * this.index / this.bubble.lines.length);
      this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) * Math.sin(2 * Math.PI * this.index / this.bubble.lines.length);
      this.lineLength = this.bubble.radius * this.popDistance;
      this.endX = this.lineLength;
      this.endY = this.lineLength;
    }

    this.render = function() {
      this.updateValues();

      ctx.beginPath();
      ctx.strokeStyle = this.bubble.color;
      ctx.lineWidth = 2;
      ctx.moveTo(this.x, this.y);
      if(this.x < this.bubble.position.x) {
        this.endX = this.lineLength * -1;
      }
      if(this.y < this.bubble.position.y) {
        this.endY = this.lineLength * -1;
      }
      if(this.y === this.bubble.position.y) {
        this.endY = 0;
      }
      if(this.x === this.bubble.position.x) {
        this.endX = 0;
      }
      ctx.lineTo(this.x + this.endX, this.y + this.endY);
      ctx.stroke();
    };
  }



  // ---------------
  // Event Listeners
  // ---------------

  // canvas.addEventListener('mousemove', mouseMove);
  document.addEventListener('click', mouseClick);

function mouseClick(e) {
  mouseClick.x = e.clientX;
  mouseClick.y = e.clientY;
}

  // function mouseMove(e) {
  //   mouseOffset.x = e.offsetX;
  //   mouseOffset.y = e.offsetY;
  // }

  window.addEventListener('resize', function() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  });


  // ---------------
  // Event Listeners
  // ---------------