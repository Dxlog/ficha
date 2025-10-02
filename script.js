const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressSteps = document.querySelectorAll(".progress-step");
const progress = document.getElementById("progress");

let currentStep = 0;

function updateStep(n) {
  steps[currentStep].classList.remove("active");
  progressSteps[currentStep].classList.remove("active");
  currentStep = n;
  steps[currentStep].classList.add("active");
  progressSteps[currentStep].classList.add("active");

  // Atualiza barra de progresso
  const progressWidth = (currentStep) / (progressSteps.length - 1) * 100;
  progress.style.width = progressWidth + "%";
}

nextBtns.forEach(btn => btn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) updateStep(currentStep + 1);
}));
prevBtns.forEach(btn => btn.addEventListener("click", () => {
  if (currentStep > 0) updateStep(currentStep - 1);
}));

// Pills toggle
document.querySelectorAll(".pill-group").forEach(group => {
  const buttons = group.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const conditional = group.parentElement.querySelector(".conditional");
      if (conditional) {
        if (btn.dataset.value === "sim") {
          conditional.classList.remove("hidden");
        } else {
          conditional.classList.add("hidden");
        }
      }
    });
  });
});

// Envio
document.getElementById("multiStepForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
});
