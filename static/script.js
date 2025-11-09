    function randomColor() {
      return { r: Math.floor(Math.random()*255), g: Math.floor(Math.random()*255), b: Math.floor(Math.random()*255) };
    }
    function toRad(deg) { return deg * (Math.PI / 180); }
    function randomRange(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function easeOutSine(x) { return Math.sin((x * Math.PI) / 2); }
    function getPercent(input, min, max) { return (((input - min) * 100) / (max - min)) / 100; }

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;

    let items = document.getElementsByTagName("textarea")[0].value.split("\n");
    let currentDeg = 0;
    let step = 360 / items.length;
    let colors = [];
    let itemDegs = {};
    let winnerName = "";

    for (let i = 0; i < items.length + 1; i++) colors.push(randomColor());

    function createWheel() {
      itemDegs = {};
      items = document.getElementsByTagName("textarea")[0].value
        .split("\n")
        .filter((n) => n.trim() !== "");
      step = 360 / items.length;
      colors = [];
      for (let i = 0; i < items.length + 1; i++) colors.push(randomColor());
      draw();
    }

    draw();

    function draw() {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
      ctx.fillStyle = `rgb(33,33,33)`;
      ctx.fill();

      let startDeg = currentDeg;
      for (let i = 0; i < items.length; i++, startDeg += step) {
        let endDeg = startDeg + step;
        let color = colors[i];
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = `rgb(${color.r-30},${color.g-30},${color.b-30})`;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = (color.r > 150 || color.g > 150 || color.b > 150) ? "#000" : "#fff";
        ctx.font = "bold 24px Arial";
        ctx.fillText(items[i], 130, 10);
        ctx.restore();

        itemDegs[items[i]] = { startDeg, endDeg };
      }
    }

    let speed = 0;
    let maxRotation = randomRange(360 * 3, 360 * 6);
    let pause = false;

    function animate() {
      if (pause) return;
      speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
      if (speed < 0.01) {
        speed = 0;
        pause = true;
        document.getElementById("winnerName").textContent = winnerName;
        document.getElementById("winnerModal").style.display = "flex";
        startConfetti(); // 🎊 Confetti animation
        return;
      }
      currentDeg += speed;
      draw();
      window.requestAnimationFrame(animate);
    }

    function spin() {
      if (speed !== 0) return;
      currentDeg = 0;
      createWheel();
      draw();
      winnerName = items[Math.floor(Math.random() * items.length)];
      maxRotation = 360 * 6 - itemDegs[winnerName].endDeg + 10;
      pause = false;
      window.requestAnimationFrame(animate);
    }

    function closeModal() {
      document.getElementById("winnerModal").style.display = "none";
    }

    function removeWinner() {
      const textarea = document.getElementsByTagName("textarea")[0];
      let names = textarea.value.split("\n").filter(n => n.trim() !== "");
      names = names.filter(n => n.trim() !== winnerName.trim());
      textarea.value = names.join("\n");
      closeModal();
      createWheel();
    }

    // 🎊 Confetti animation
    function startConfetti() {
      const canvas = document.getElementById("confettiCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 200;
      const confetti = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 2,
        d: Math.random() * 0.5 + 0.5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      }));

      function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
          ctx.fillStyle = c.color;
          ctx.fill();
        });
      }

      function update() {
        confetti.forEach(c => {
          c.y += c.d * 4;
          if (c.y > canvas.height) {
            c.y = -10;
            c.x = Math.random() * canvas.width;
          }
        });
      }

      function animate() {
        drawConfetti();
        update();
        requestAnimationFrame(animate);
      }
      animate();
    }


    