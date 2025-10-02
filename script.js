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

// Mostrar campos condicionais
document.querySelectorAll(".radio-group").forEach(group => {
  group.addEventListener("change", (e) => {
    const nextInput = group.nextElementSibling;
    if (nextInput && (nextInput.tagName === "INPUT" || nextInput.tagName === "TEXTAREA")) {
      if (e.target.value === "sim") {
        nextInput.classList.remove("hidden");
      } else {
        nextInput.classList.add("hidden");
      }
    }
  });
});

// Submissão
document.getElementById("multiStepForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Formulário enviado com sucesso! (a integração com PDF/e-mail será feita no backend)");
});
