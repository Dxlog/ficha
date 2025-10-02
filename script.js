const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progress = document.getElementById("progress");
const progressSteps = document.querySelectorAll(".progress-step");

let currentStep = 0;

// Atualiza a etapa
function updateStep(n) {
  steps[currentStep].classList.remove("active");
  currentStep = n;
  steps[currentStep].classList.add("active");
  updateProgress();
}

// Atualiza progresso visual
function updateProgress() {
  progressSteps.forEach((step, i) => {
    step.classList.toggle("active", i <= currentStep);
  });
  const activeSteps = document.querySelectorAll(".progress-step.active").length;
  progress.style.width = ((activeSteps - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Botões avançar/voltar
nextBtns.forEach(btn => btn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) updateStep(currentStep + 1);
}));
prevBtns.forEach(btn => btn.addEventListener("click", () => {
  if (currentStep > 0) updateStep(currentStep - 1);
}));

// Botões pills (Sim/Não)
document.querySelectorAll(".pill-group").forEach(group => {
  const buttons = group.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const conditional = group.parentElement.querySelector(".conditional");
      if (conditional) {
        conditional.classList.toggle("hidden", btn.dataset.value !== "sim");
      }
    });
  });
});

// Envio do form
document.getElementById("multiStepForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
});
