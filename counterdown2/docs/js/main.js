(async () => {
  const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
  const url =  '../../src/index.js';
  const { default: CanvasCircularCountdown } = await import(url);
  const countdownCanvas = document.getElementById('countdown-canvas');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');
  const newInstanceButton = document.getElementById('new-instance-btn');
  const newInstanceSuccess = document.getElementById('new-instance-success');
  const remainingPercentage = document.getElementById('remaining-percentage');
  const remainingTime = document.getElementById('remaining-time');
  const elapsedTime = document.getElementById('elapsed-time');
  const form = document.getElementById('options-form');
  const codeEl = document.getElementById('code');
  let countdown;

  function normalise(value, min, max) {
    return (value - min) / (max - min);
  }

  function updateOnTimer(time) {
    remainingTime.textContent = Math.ceil(time.remaining);
    elapsedTime.textContent = Math.ceil(time.elapsed);


  }

  function setFormDefaults(options) {
    Object.keys(options).forEach(function (key) {
      if (form[key]) {
        if (form[key].type === 'checkbox') {
          form[key].checked = options[key];
        } else {
          form[key].value = options[key] != null ? options[key] : '';
        }
      }
    });
  }

  function makeCode(options) {
  }

  countdown = new CanvasCircularCountdown(countdownCanvas, updateOnTimer);

  const duration = Number(form.duration.value);
  const elapsed = Number(form.elapsedTime.value);

  updateOnTimer({
    remaining: duration - elapsed,
    elapsed
  });

  startBtn.addEventListener('click', function onStartClicked() {
    countdown.start();
  });

  stopBtn.addEventListener('click', function onStopClicked() {
    countdown.stop();
  });

  resetBtn.addEventListener('click', function onResetClicked() {
    countdown.reset();

    const duration = Number(form.duration.value) * 60000;
    const elapsed = Number(form.elapsedTime.value);

    updateOnTimer({
      remaining: (duration - elapsed),
      elapsed
    });
  });

  form.addEventListener('input', function onFormChanged(event) {
    const options = {};

    switch (event.target.type) {
      case 'color':
        options[event.target.name] = event.target.value;
        break;
      case 'number':
        options[event.target.name] = Number(event.target.value);
        break;
      case 'checkbox':
        options[event.target.name] = event.target.checked;
        break;
      default:
        options[event.target.name] = event.target.value || void 0;
    }

    countdown.style(options);


  });

  newInstanceButton.addEventListener('click', function onNewInstanceCreated() {
    countdown.reset();
    let _duration = Number(form.duration.value) * 60000;
    countdown = new CanvasCircularCountdown(countdownCanvas, {
      duration: _duration || 0,
      elapsedTime: Number(form.elapsedTime.value) || 0,
      throttle: form.throttle.value ? Number(form.throttle.value) : void 0,
      captionText: void 0
    }, updateOnTimer);

    const duration = _duration; //Number(form.duration.value);
    const elapsed = Number(form.elapsedTime.value);

    updateOnTimer({
      remaining: (duration - elapsed),
      elapsed
    });


    newInstanceSuccess.classList.add('visible');
    newInstanceButton.disabled = true;

    setTimeout(function () {
      newInstanceSuccess.classList.remove('visible');
      newInstanceButton.disabled = false;
    }, 1000);
  });


})();

var color = document.querySelector('.color-picker');
var block = document.getElementById('block');

color.addEventListener('change', function(){
  block.style.setProperty('--bg', color.value);
});   

function widthH(){
    block.style.setProperty('--boxWidth', '100%');
};
function widthF(){
    block.style.setProperty('--boxWidth', '50%');
};

/*

document.getElementById("formCircle").addEventListener("mouseenter", function(  ) {isOnDiv=true;});
document.getElementById("formCircle").addEventListener("mouseout", function(  ) {isOnDiv=false;});

const el = document.getElementById('container');

const hiddenDiv = document.getElementById('formCircle');

// ✅ Show hidden DIV on hover
el.addEventListener('mouseover', function handleMouseOver() {
  hiddenDiv.style.display = 'block';

  // 👇️ if you used visibility property to hide the div
  // hiddenDiv.style.visibility = 'visible';
});

// ✅ (optionally) Hide DIV on mouse out
el.addEventListener('mouseout', function handleMouseOut() {
  hiddenDiv.style.display = 'none';

  // 👇️ if you used visibility property to hide the div
  // hiddenDiv.style.visibility = 'hidden';
});
*/