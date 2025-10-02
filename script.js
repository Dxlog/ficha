const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressSteps = document.querySelectorAll(".progress-step");

let currentStep = 0;

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    steps[currentStep].classList.remove("active");
    progressSteps[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");
    progressSteps[currentStep].classList.add("active");
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    steps[currentStep].classList.remove("active");
    progressSteps[currentStep].classList.remove("active");
    currentStep--;
    steps[currentStep].classList.add("active");
    progressSteps[currentStep].classList.add("active");
  });
});

// Mostrar/esconder campos condicionais no mesmo padrão
document.querySelectorAll(".radio-group").forEach(group => {
  const radios = group.querySelectorAll("input[type=radio]");
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const conditional = group.parentElement.querySelector(".conditional");
      if (conditional) {
        if (radio.value === "sim") {
          conditional.classList.remove("hidden");
        } else {
          conditional.classList.add("hidden");
        }
      }
    });
  });
});

// Submissão
document.getElementById("multiStepForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
});
