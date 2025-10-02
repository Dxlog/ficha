/* Multi-step form controller with validation and conditional fields.
   - Next disabled until required inputs in step are filled (dynamic).
   - Conditionals use data-show-on="name=value" on the element to show.
   - Toggle groups: markup has <input id="x-sim" name="x" value="sim"> + <label for="x-sim" class="toggle-btn">Sim</label>
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multiStepForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
  const progressLine = document.getElementById('progressLine');
  let current = 0;

  // initialize toggles: transform radio+label pairs to have clickable label styles
  document.querySelectorAll('.toggle').forEach(toggle => {
    // add click behaviour for each label
    const radios = toggle.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      const label = toggle.querySelector(`label[for="${radio.id}"]`);
      if (label) {
        // style sync on load
        if (radio.checked) label.classList.add('active');
        // toggle on click
        radio.addEventListener('change', () => {
          // remove active from all labels in this toggle
          toggle.querySelectorAll('.toggle-btn').forEach(l => l.classList.remove('active'));
          const lbl = toggle.querySelector(`label[for="${radio.id}"]`);
          if (lbl) lbl.classList.add('active');
          updateConditionalsForName(radio.name);
        });
      }
    });
    // make sure clicking label checks radio (normal behavior) and style sync happens via change listener
    toggle.querySelectorAll('label.toggle-btn').forEach(l => {
      l.addEventListener('click', () => {
        // find the input with id = for attr
        const id = l.getAttribute('for');
        const inp = document.getElementById(id);
        if (inp) inp.checked = true;
        // trigger change manually
        inp.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  // Conditionals: find elements with data-show-on and set up listeners
  const conditionalEls = Array.from(document.querySelectorAll('[data-show-on]'));
  function parseRule(rule) {
    // rule like "name=value"
    const [name, value] = rule.split('=');
    return { name, value };
  }
  function updateConditionalsForName(name) {
    conditionalEls.forEach(el => {
      const rule = el.getAttribute('data-show-on');
      if (!rule) return;
      const { name: ruleName, value } = parseRule(rule);
      if (ruleName !== name) return;
      // check radio with that name and value
      const radio = document.querySelector(`input[name="${ruleName}"][value="${value}"]`);
      if (radio && radio.checked) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
        // clear inputs inside hidden el
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          el.value = '';
        } else {
          el.querySelectorAll('input, textarea, select').forEach(i => i.value = '');
        }
      }
    });
  }
  // init conditionals on load
  conditionalEls.forEach(el => {
    const rule = el.getAttribute('data-show-on');
    if (!rule) return;
    const { name } = parseRule(rule);
    // listen to all inputs with that name
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
      r.addEventListener('change', () => updateConditionalsForName(name));
    });
    // initial update
    updateConditionalsForName(name);
  });

  // validation per step: enable/disable next button accordingly
  function validateStepFields(stepIndex) {
    const stepEl = steps[stepIndex];
    const reqs = Array.from(stepEl.querySelectorAll('[required]'));
    for (let el of reqs) {
      if (el.type === 'checkbox' || el.type === 'radio') {
        // handled separately if needed
        if (!el.checked) return false;
      } else {
        if (!el.value || !String(el.value).trim()) return false;
      }
    }
    return true;
  }

  // update next-button state for the step (if there's a next button)
  function updateNextButtonState(index) {
    const stepEl = steps[index];
    const nextBtn = stepEl.querySelector('.next-btn');
    if (!nextBtn) return;
    const hasRequired = stepEl.querySelectorAll('[required]').length > 0;
    if (!hasRequired) {
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
      return;
    }
    const ok = validateStepFields(index);
    nextBtn.disabled = !ok;
    nextBtn.classList.toggle('disabled', !ok);
  }

  // attach listeners to required fields to update next button in real-time
  steps.forEach((step, idx) => {
    const reqs = Array.from(step.querySelectorAll('[required]'));
    if (reqs.length > 0) {
      reqs.forEach(el => {
        const ev = (el.tagName === 'SELECT' || el.type === 'radio' || el.type === 'checkbox') ? 'change' : 'input';
        el.addEventListener(ev, () => updateNextButtonState(idx));
      });
      // initial state
      updateNextButtonState(idx);
    } else {
      updateNextButtonState(idx);
    }
  });

  // navigation functions
  function goToStep(idx) {
    if (idx < 0 || idx >= steps.length) return;
    steps[current].classList.remove('active');
    progressSteps[current].classList.remove('active');
    current = idx;
    steps[current].classList.add('active');
    progressSteps[current].classList.add('active');
    updateProgressLine();
    // update next btn state for new step
    updateNextButtonState(current);
    // update review box if final
    if (current === steps.length - 1) fillReview();
  }
  function updateProgressLine() {
    const pct = (current / (progressSteps.length - 1)) * 100;
    progressLine.style.width = pct + '%';
  }

  // wire next/prev buttons
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // validate current step before proceeding
      const valid = validateStepFields(current);
      if (!valid) {
        // find first invalid and focus
        const stepEl = steps[current];
        const req = stepEl.querySelector('[required]');
        if (req) { req.focus(); showToast('Preencha os campos obrigatórios para avançar.'); }
        return;
      }
      if (current < steps.length - 1) goToStep(current + 1);
    });
  });
  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) goToStep(current - 1);
    });
  });

  // show toast
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.classList.add('show'), 10);
    setTimeout(()=> { t.classList.remove('show'); setTimeout(()=> t.remove(), 200); }, 3000);
  }

  // Review: build a short summary of main fields
  function fillReview() {
    const reviewBox = document.getElementById('reviewBox');
    if (!reviewBox) return;
    const summaryFields = [
      { id: 'nome', label: 'Nome' },
      { id: 'idade', label: 'Idade' },
      { id: 'peso', label: 'Peso (kg)' },
      { id: 'altura', label: 'Altura (cm)' },
      { id: 'endereco', label: 'Onde mora' },
      { id: 'objetivos', label: 'Objetivos' },
      { id: 'acorda', label: 'Acorda' },
      { id: 'trabalho_inicio', label: 'Início trabalho' },
      { id: 'trabalho_fim', label: 'Fim trabalho' },
      { id: 'alimentacao_atual', label: 'Alimentação atual' },
      { id: 'freq_treino', label: 'Frequência treino (semanal)' },
    ];
    const rows = [];
    summaryFields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      const val = el.value ? el.value : '—';
      rows.push(`<div class="rev-row"><strong>${escapeHtml(f.label)}</strong>: ${escapeHtml(val)}</div>`);
    });
    reviewBox.innerHTML = `<h3>Resumo rápido</h3>${rows.join('')}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // On submit: validate all required fields across form; if any missing, navigate to first failing step
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allReq = Array.from(form.querySelectorAll('[required]'));
    for (let el of allReq) {
      if (!el.value || !String(el.value).trim()) {
        // find parent step index
        const parentStep = el.closest('.form-step');
        if (parentStep) {
          const idx = steps.indexOf(parentStep);
          if (idx >= 0) {
            showToast('Existem campos obrigatórios faltando. Vou abrir a etapa correspondente.');
            goToStep(idx);
            el.focus();
            return;
          }
        }
      }
    }

    // If all required OK -> gather data (simulação)
    const data = new FormData(form);
    const obj = {};
    for (let [k,v] of data.entries()) {
      obj[k] = v;
    }
    console.log('Form data (simulação):', obj);
    showToast('Formulário finalizado (simulação). Veja console.log para os dados.');
    // TODO: aqui você pode integrar jsPDF / enviar ao backend / EmailJS
  });

  // initialize progress
  updateProgressLine();
  progressSteps.forEach((ps, i) => {
    // click to jump (optional) - disabled for now to avoid skipping required - but keep style
  });

});
