document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multiStepForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
  const progressLine = document.getElementById('progressLine');
  const toast = document.getElementById('toast');
  let current = 0;

  // Utility: show toast
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // go to step index
  function goToStep(index) {
    if (index < 0 || index >= steps.length) return;
    // remove active
    steps[current].classList.remove('active');
    progressSteps[current].classList.remove('active');
    // set new
    current = index;
    steps[current].classList.add('active');
    progressSteps[current].classList.add('active');
    updateProgressLine();
    // if final, build review
    if (current === steps.length - 1) populateReview();
    // update Next button states
    updateNextState(current);
  }

  // update progress line width
  function updateProgressLine() {
    const pct = (current / (progressSteps.length - 1)) * 100;
    progressLine.style.width = pct + '%';
  }

  // Next / Prev wiring
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // validate current visible required fields
      if (!validateStep(current)) return;
      goToStep(Math.min(current + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(Math.max(current - 1, 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Validate visible required inputs in step
  function validateStep(idx) {
    const step = steps[idx];
    const required = Array.from(step.querySelectorAll('[required]'));
    for (let el of required) {
      // skip hidden conditioned fields
      if (!isVisible(el)) continue;
      if (!el.value || !String(el.value).trim()) {
        el.focus();
        showToast('Preencha os campos obrigatórios desta etapa.');
        return false;
      }
    }
    return true;
  }

  // visibility helper (considers .hidden or display:none)
  function isVisible(el) {
    if (!el) return false;
    if (el.classList && el.classList.contains('hidden')) return false;
    // check offsetParent (works for display:none)
    return el.offsetParent !== null;
  }

  // PILL groups behavior (toggle + store to hidden input + update conditionals)
  document.querySelectorAll('.pill').forEach(group => {
    const name = group.dataset.name;
    // create (or find) hidden input
    const hidden = document.querySelector(`input[type="hidden"][name="${name}"]`);
    const hiddenInput = hidden || (() => {
      const inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = name;
      inp.id = name + '_input';
      inp.value = 'nao';
      group.parentNode.insertBefore(inp, group.nextSibling);
      return inp;
    })();

    // init: set first button (default = nao if present)
    const buttons = Array.from(group.querySelectorAll('button'));
    // ensure default active: if any button has data-value="nao" set active, else first
    const defaultBtn = buttons.find(b => b.dataset.value === 'nao') || buttons[0];
    buttons.forEach(btn => btn.classList.remove('active'));
    if (defaultBtn) { defaultBtn.classList.add('active'); hiddenInput.value = defaultBtn.dataset.value; }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hiddenInput.value = btn.dataset.value;
        // update conditionals on this name
        updateConditionalsFor(name);
        // update any validation (if required fields depend on this)
        updateNextState(current);
      });
    });

    // initial conditionals update
    updateConditionalsFor(name);
  });

  // Conditionals: elements with data-show-on="name=value"
  const conditionals = Array.from(document.querySelectorAll('[data-show-on]'));
  function parseRule(rule) {
    const [name, val] = rule.split('=');
    return { name: name.trim(), value: val.trim() };
  }
  function updateConditionalsFor(name) {
    conditionals.forEach(el => {
      const rule = el.getAttribute('data-show-on');
      if (!rule) return;
      const { name: rname, value } = parseRule(rule);
      if (rname !== name) return;
      // find hidden input value
      const hid = document.querySelector(`input[type="hidden"][name="${rname}"]`);
      const v = hid ? hid.value : null;
      if (v === value) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
        // clear fields inside (if input/textarea)
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          el.value = '';
        } else {
          el.querySelectorAll('input, textarea, select').forEach(i => i.value = '');
        }
      }
    });
  }

  // Update Next button enabled state for step: if there are required visible fields
  function updateNextState(idx) {
    const step = steps[idx];
    const nextBtn = step.querySelector('.next-btn');
    if (!nextBtn) return;
    const reqs = Array.from(step.querySelectorAll('[required]')).filter(isVisible);
    if (reqs.length === 0) {
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
      return;
    }
    const ok = reqs.every(el => el.value && String(el.value).trim());
    nextBtn.disabled = !ok;
    nextBtn.classList.toggle('disabled', !ok);
  }

  // wire input events to update next button dynamically
  steps.forEach((step, idx) => {
    const inputs = Array.from(step.querySelectorAll('input, textarea, select'));
    inputs.forEach(inp => {
      const ev = (inp.tagName === 'SELECT' || inp.type === 'checkbox' || inp.type === 'radio') ? 'change' : 'input';
      inp.addEventListener(ev, () => {
        updateNextState(idx);
      });
    });
    // initial check:
    updateNextState(idx);
  });

  // populate review summary (simple)
  function populateReview() {
    const review = document.getElementById('review');
    if (!review) return;
    const fields = [
      { id: 'nome', label: 'Nome' },
      { id: 'idade', label: 'Idade' },
      { id: 'peso', label: 'Peso (kg)' },
      { id: 'altura', label: 'Altura (cm)' },
      { id: 'endereco', label: 'Onde mora' },
      { id: 'objetivos', label: 'Objetivos' },
      { id: 'acorda', label: 'Acorda' },
      { id: 'trabalho_inicio', label: 'Trabalho (início)' },
      { id: 'trabalho_fim', label: 'Trabalho (fim)' },
      { id: 'alimentacao_atual', label: 'Alimentação atual' },
      { id: 'freq_treino', label: 'Freq. treino (semanal)' }
    ];
    const rows = [];
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      const v = el.value || '—';
      rows.push(`<div class="rev-row"><strong>${escapeHtml(f.label)}:</strong> ${escapeHtml(v)}</div>`);
    });
    review.innerHTML = '<h3>Resumo rápido</h3>' + rows.join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // on submit -> validate entire form; if missing required go to first failing step
  form.addEventListener('submit', e => {
    e.preventDefault();
    const allReq = Array.from(form.querySelectorAll('[required]')).filter(isVisible);
    for (let el of allReq) {
      if (!el.value || !String(el.value).trim()) {
        // find parent step index
        const parent = el.closest('.form-step');
        if (parent) {
          const idx = steps.indexOf(parent);
          if (idx >= 0) {
            showToast('Existem campos obrigatórios faltando — abrindo a etapa correspondente.');
            goToStep(idx);
            el.focus();
            return;
          }
        }
      }
    }

    // gather data (simulation)
    const data = new FormData(form);
    // include hidden inputs (they were inserted by script or present)
    // Build object
    const json = {};
    for (let [k,v] of data.entries()) {
      json[k] = v;
    }
    console.log('Formulário (simulação) enviado:', json);
    showToast('Formulário finalizado (simulação). Ver dados no console.');
    // TODO: gerar PDF + enviar ao backend / EmailJS
  });

  // initial progress width
  updateProgressLine();

  // expose some functions for debugging (optional)
  window.__formUtils = { goToStep, updateConditionalsFor: updateConditionalsFor };
});
