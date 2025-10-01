// Seletores principais
const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const form = document.getElementById("multi-step-form");

let formStepsNum = 0;

// Avançar etapa
nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (formStepsNum < formSteps.length - 1) {
      formStepsNum++;
      updateFormSteps();
      updateProgressbar();
    }
  });
});

// Voltar etapa
prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (formStepsNum > 0) {
      formStepsNum--;
      updateFormSteps();
      updateProgressbar();
    }
  });
});

// Atualiza exibição das etapas
function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.remove("active");
  });
  formSteps[formStepsNum].classList.add("active");
}

// Atualiza barra de progresso
function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx <= formStepsNum) {
      progressStep.classList.add("active");
    } else {
      progressStep.classList.remove("active");
    }
  });

  const actives = document.querySelectorAll(".progress-step.active");
  progress.style.width =
    ((actives.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Campos condicionais (sim/não -> libera descrição)
function setupToggleField(radioYesId, radioNoId, descFieldId) {
  const radioYes = document.getElementById(radioYesId);
  const radioNo = document.getElementById(radioNoId);
  const descField = document.getElementById(descFieldId);

  if (radioYes && radioNo && descField) {
    radioYes.addEventListener("change", () => {
      descField.classList.remove("hidden");
    });
    radioNo.addEventListener("change", () => {
      descField.classList.add("hidden");
    });
  }
}

// Configurar todos os campos condicionais
setupToggleField("restricao-sim", "restricao-nao", "restricao-desc");
setupToggleField("excluir-sim", "excluir-nao", "excluir-desc");
setupToggleField("aerobico-sim", "aerobico-nao", "aerobico-desc");
setupToggleField("cronica-sim", "cronica-nao", "cronica-desc");
setupToggleField("lesao-sim", "lesao-nao", "lesao-desc");
setupToggleField("sup-sim", "sup-nao", "sup-desc");
setupToggleField("hormonal-sim", "hormonal-nao", "hormonal-desc");

// Envio final (apenas simulação por enquanto)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Formulário finalizado com sucesso! 🚀\n(Em produção, aqui enviaremos por e-mail ou geraremos PDF)");
});
