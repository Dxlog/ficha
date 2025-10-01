const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

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
  formSteps.forEach(step => {
    step.classList.remove("active");
  });
  formSteps[formStepsNum].classList.add("active");
}

function updateProgressbar() {
  progressSteps.forEach((step, idx) => {
    if (idx <= formStepsNum) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  const actives = document.querySelectorAll(".progress-step.active");
  progress.style.width =
    ((actives.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// === Mostrar campos condicionais ===
function toggleField(radioName, fieldId) {
  const radios = document.getElementsByName(radioName);
  const field = document.getElementById(fieldId);

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "sim" && radio.checked) {
        field.classList.remove("hidden");
      } else if (radio.value === "nao" && radio.checked) {
        field.classList.add("hidden");
        field.value = "";
      }
    });
  });
}

toggleField("restricao", "restricaoDetalhe");
toggleField("excluir", "excluirDetalhe");
toggleField("aerobico", "aerobicoDetalhe");
toggleField("alergia", "alergiaDetalhe");
toggleField("doenca", "doencaDetalhe");
toggleField("lesao", "lesaoDetalhe");
toggleField("suplementos", "suplementosDetalhe");
toggleField("hormonal", "hormonalDetalhe");
