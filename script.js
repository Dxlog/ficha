// Controle das etapas
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const progress = document.getElementById("progress");
let formStepIndex = 0;

document.querySelectorAll(".btn-next").forEach(btn => {
  btn.addEventListener("click", () => {
    if (validarEtapa(formStepIndex)) {
      formStepIndex++;
      updateFormSteps();
      updateProgressbar();
    }
  });
});

document.querySelectorAll(".btn-prev").forEach(btn => {
  btn.addEventListener("click", () => {
    formStepIndex--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep, idx) => {
    formStep.classList.toggle("active", idx === formStepIndex);
  });
}

function updateProgressbar() {
  progressSteps.forEach((step, idx) => {
    if (idx <= formStepIndex) step.classList.add("active");
    else step.classList.remove("active");
  });

  progress.style.width =
    ((formStepIndex) / (progressSteps.length - 1)) * 100 + "%";
}

// Validação básica (campos obrigatórios)
function validarEtapa(index) {
  const currentStep = formSteps[index];
  const requiredFields = currentStep.querySelectorAll("[required]");
  for (let field of requiredFields) {
    if (!field.value.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return false;
    }
  }
  return true;
}

// Mostrar campos condicionais
function toggleField(selectId, inputId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);

  if (!select || !input) return;

  select.addEventListener("change", () => {
    if (select.value === "sim") {
      input.style.display = "block";
    } else {
      input.style.display = "none";
      input.value = "";
    }
  });
}

// Configurar campos condicionais
toggleField("restricao", "restricao-qual");
toggleField("alimentosNao", "alimentosNao-qual");
toggleField("aerobico", "aerobico-horario");
toggleField("suplementos", "suplementos-qual");
toggleField("alergia", "alergia-qual");
toggleField("doenca", "doenca-qual");
toggleField("lesao", "lesao-qual");

// Campo especial de protocolo hormonal
const hormonal = document.getElementById("hormonal");
const hormonalQual = document.getElementById("hormonal-qual");

if (hormonal && hormonalQual) {
  hormonal.addEventListener("change", () => {
    if (hormonal.value === "sim") {
      hormonalQual.style.display = "block";
    } else {
      hormonalQual.style.display = "none";
      hormonalQual.value = "";
    }
  });
}

// Envio do formulário (por enquanto só console.log)
document.getElementById("multiStepForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Formulário finalizado! (próximo passo: gerar PDF e enviar por e-mail)");
});
