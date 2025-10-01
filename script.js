const formSteps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".btn-next");
const prevBtns = document.querySelectorAll(".btn-prev");
const progress = document.getElementById("progress");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

// Navegação
nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
  });
});
prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach(step => step.classList.remove("active"));
  formSteps[formStepsNum].classList.add("active");
}
function updateProgressbar() {
  progressSteps.forEach((step, idx) => {
    if (idx <= formStepsNum) step.classList.add("active");
    else step.classList.remove("active");
  });
  progress.style.width = 
    (formStepsNum / (progressSteps.length - 1)) * 100 + "%";
}

// Mostrar/esconder campos condicionais
document.querySelectorAll(".toggle-group input").forEach(input => {
  input.addEventListener("change", e => {
    const field = document.getElementById(e.target.name + "-desc");
    if (field) {
      if (e.target.id.includes("sim")) field.classList.remove("hidden");
      else field.classList.add("hidden");
    }
  });
});
