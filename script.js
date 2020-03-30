// ---------
  // Functions
  // ---------

  var canvases = document.getElementsByTagName('canvas');
console.log("canvases: " + canvases.length);
//      canvases[i].width = (document.body.clientWidth / 2.5);
//      canvases[i].height = (document.body.clientHeight / 2.5);

// canvas size
var canvasSizeX = 500;
var canvasSizeY = 500;

for (var i=0; i<canvases.length; i++) {
    canvases[i].width = canvasSizeX;
    canvases[i].height = canvasSizeY;
      var ctx = canvases[i].getContext('2d');
      var count = canvases[i].height;
      var bubbles = [];
      var bubbleCount = 50;
      var bubbleSpeed = 1;
      var popLines = 6;
      var popDistance = 40;
      var bubbleEdge = 100;
      var waveHeight = 50;
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

        ctx.clearRect(0, 0, canvasSizeX, canvasSizeY);



        // ------------
        // Draw Bubbles
        // ------------

        ctx.beginPath();
        for (var i = 0; i < bubbles.length; i++) {
          // first num = distance between waves
          // second num = wave height
          // third num = move the center of the wave away from the edge
          bubbles[i].position.x = Math.sin(bubbles[i].count/bubbles[i].distanceBetweenWaves) * waveHeight + bubbles[i].xOff;
          bubbles[i].position.y = bubbles[i].count;
          bubbles[i].render();

          if(bubbles[i].count < 0 - bubbles[i].radius) {
            bubbles[i].count = canvases[i].height + bubbles[i].yOff;
          } else {
            bubbles[i].count -= bubbleSpeed;
          }

          if (bubbles[i].position.y > canvasSizeY) {
              bubbles[i].radius = 0.2;
          }


          // grow at bottom
          if (bubbles[i].position.y < canvasSizeY - 50 && bubbles[i].position.y > bubbleEdge) {
              bubbles[i].radius += 0.2;
              if (bubbles[i].radius >= bubbles[i].finalRadius) {
                  bubbles[i].radius = bubbles[i].finalRadius;
              }
          }


          // shrink at top
          if (bubbles[i].position.y <= bubbleEdge) {
            if (bubbles[i].radius > 0.2) {
                bubbles[i].radius -= .2;
            }
            else {
                bubbles[i].popping = true;
                bubbles[i].resetPosition();
            }
    //        if (bubbles[i].radius <= .2) {
    //          bubbles[i].popping = true;
    //          bubbles[i].resetPosition();
    //          console.log("tried reset position");
    //        }
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
        this.finalRadius = 8 + Math.random() * 10;
        this.radius = 0.2;
    //    this.xOff = Math.random() * canvases[i].width - this.radius;
        this.xOff = (Math.random() * (canvasSizeX - 200)) + 100;
        this.yOff = Math.random() * canvasSizeY;
        this.distanceBetweenWaves = 50 + Math.random() * 40;
        this.count = canvasSizeY + this.yOff;
        //this.color = '#8bc9ee';
        var colorArray = ["#eb8533", "#462b2b"]; //, "#f1b52f"];
        // this.stroke = "#964b00";
        this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
        this.lines = [];
        this.popping = false;

        // Populate Lines
        for (var i = 0; i < popLines; i++) {
          var tempLine = new createLine();
              tempLine.bubble = this;
              tempLine.index = i;

          this.lines.push(tempLine);
        }

        this.resetPosition = function() {
          this.position = {x: 0, y: 0};
          this.finalRadius = 8 + Math.random() * 10;
          this.radius = 0.2;
    //      this.xOff = Math.random() * canvases[i].width - this.radius;
          this.xOff = (Math.random() * (canvasSizeX - 200)) + 100;
          this.yOff = Math.random() * canvasSizeY;
          this.distanceBetweenWaves = 50 + Math.random() * 40;
          this.count = canvasSizeX + this.yOff;
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

    document.addEventListener('mousedown', function(e) {
//        var thisCanvas = canvases[i];
//        console.log("got here, canvas is: " + thisCanvas);
        mouseClick(ctx, e);
    })

        function mouseClick(canvas, event) {
//        var thisCanvas = canvases[i];
        var rect = canvas.getBoundingClientRect();
        mouseClick.x = event.clientX - rect.left;
        mouseClick.y = event.clientY - rect.top;
    //    console.log("x: " + x + " y: " + y)
    }

    
      // canvases[i].addEventListener('mousemove', mouseMove);
    //  document.addEventListener('click', mouseClick);

    //function mouseClick(e) {
    //  mouseClick.x = e.clientX;
    //  mouseClick.y = e.clientY;
    //}

      // function mouseMove(e) {
      //   mouseOffset.x = e.offsetX;
      //   mouseOffset.y = e.offsetY;
      // }

      window.addEventListener('resize', function() {
        canvasSizeX = document.body.clientWidth;
        canvasSizeY = document.body.clientHeight;
      });


      // ---------------
      // Event Listeners
      // ---------------
}
        
