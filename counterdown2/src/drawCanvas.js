export default function drawCanvas(percentage, instance, elapsedTime = 0) {

  const { options: opts } = instance;
  const circleStart = 1.5 * Math.PI;
  const circleEnd = circleStart + (opts.clockwise ? -1 : 1) * (percentage / 50 * Math.PI);
  const ceiledPercentage = Math.ceil(percentage);

  // ensure that radius is not negative value
  let circleRadius = opts.radius < 0 ? 0 : opts.radius;
  let barRadius = opts.radius - opts.progressBarOffset - opts.progressBarWidth / 2;
  barRadius = barRadius < 0 ? 0 : barRadius;

  const centerX = circleRadius;
  const centerY = circleRadius;

  let requestId; // declare a variable to hold the requestAnimationFrame ID


  // listen to confirm button on pressed

  const confirmButton = document.querySelector("#new-instance-btn");
  confirmButton.addEventListener("click", () => {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('div.count').style.display = 'block';
    });

  // listen for reset button click events
  const resetButton = document.querySelector("#reset-btn");
  resetButton.addEventListener("click", () => {
    // stop the animation frame
    cancelAnimationFrame(requestId);


  });


  instance._ctx.save();

  instance._ctx.clearRect(0, 0, instance._canvas.width, instance._canvas.height);

  // draw inner circle
  instance._ctx.beginPath();
  instance._ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI, false);
  instance._ctx.fillStyle = opts.circleBackgroundColor;
  instance._ctx.fill();

  // draw empty bar
  if (opts.progressBarWidth) {
    instance._ctx.beginPath();
    instance._ctx.arc(centerX, centerY, barRadius, circleStart, 4 * Math.PI, false);
    instance._ctx.lineWidth = opts.progressBarWidth;
    instance._ctx.strokeStyle = opts.emptyProgressBarBackgroundColor;
    instance._ctx.stroke();

  }

// draw blinking bar

function drawBlinkingLight(centerX, centerY, radius) {

  const blinkDuration = 500; // Blinking frequency in milliseconds
  const blinkThreshold = blinkDuration / 2; // Blinking threshold in milliseconds

  const isBlinking = Math.floor(Date.now() / blinkDuration) % 2 === 0;

  if (isBlinking) {
    const blinkTime = Date.now() % blinkDuration;
    instance._ctx.beginPath();
    instance._ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    instance._ctx.lineWidth = opts.progressBarWidth;

    if (blinkTime < blinkThreshold) {
      instance._ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";
    } else {
      instance._ctx.strokeStyle = opts.emptyProgressBarBackgroundColor;
    }

    instance._ctx.stroke();
  }

  // request the next animation frame
  requestId = requestAnimationFrame(() => {
    drawBlinkingLight(centerX, centerY, radius);
  });
}


  // draw filled bar
  if (opts.progressBarWidth) {
    instance._ctx.beginPath();
    instance._ctx.arc(centerX, centerY, barRadius, circleStart, circleEnd, !!opts.clockwise);
    instance._ctx.lineWidth = opts.progressBarWidth;

    instance._ctx.strokeStyle = typeof opts.filledProgressBarBackgroundColor === 'function'
      ? opts.filledProgressBarBackgroundColor(ceiledPercentage, instance._timer.time())
      : opts.filledProgressBarBackgroundColor;

    instance._ctx.stroke();

    if (ceiledPercentage == 0) {
      drawBlinkingLight(centerX, centerY, barRadius  );   
    }

  }

  let shouldShowCaption = typeof opts.showCaption === 'function'
    ? opts.showCaption(ceiledPercentage, instance._timer.time())
    : !!opts.showCaption;

  if (shouldShowCaption) {
    instance._ctx.fillStyle = typeof opts.captionColor === 'function'
      ? opts.captionColor(ceiledPercentage, instance._timer.time())
      : opts.captionColor;

    instance._ctx.font = typeof opts.captionFont === 'function'
      ? opts.captionFont(ceiledPercentage, instance._timer.time())
      : opts.captionFont;

    instance._ctx.textBaseline = 'middle';
    instance._ctx.textAlign = 'center';


    let milsec = parseInt(elapsedTime).toString().padStart(3, '0');;
    let sec = parseInt(elapsedTime / 1000);
    let min = parseInt(elapsedTime / 60000)
    let captionStr;

    if (opts.clockwise) {
      captionStr = `${min}m ` + `${sec % 60}s `;
    } else {
      captionStr = `${min}m ` + `${sec % 60}s `;

    }
    if (typeof opts.captionText === 'string') {

      captionStr = opts.captionText;
    } else if (typeof opts.captionText === 'function') {

      captionStr = opts.captionText(ceiledPercentage, instance._timer.time());
    }

    instance._ctx.fillText(captionStr, centerX, centerY);

    instance._ctx.restore();

    if (typeof opts.draw === 'function') {
      const size = opts.radius * 2;

      instance._ctx.beginPath();

      opts.draw(instance._ctx, {
        percentage: ceiledPercentage,
        time: instance._timer.time(),
        width: size,
        height: size
      });
    }
  }

}
