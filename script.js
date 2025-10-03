/**
 * Multi-step form (clean & robust)
 * - pills (Sim/Não) store values in hidden inputs (name = data-target)
 * - conditionals displayed using data-show="name=value"
 * - next button disabled until visible required fields are filled
 * - progress line + dots (can't skip forward)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multiStepForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const dots = Array.from(document.querySelectorAll('.step-dot'));
  const progressFill = document.getElementById('progressFill');

  let current = 0;

  // ---------- Helpers ----------
  const isVisible = el => el && !(el.classList && el.classList.contains('hidden')) && el.offsetParent !== null;

  function setActiveStep(idx, smoothScroll = true) {
    if (idx < 0 || idx >= steps.length) return;
    // remove previous
    steps[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    steps[current].classList.add('active');
    dots[current].classList.add('active');
    updateProgress();
    if (smoothScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNextState(current);
    if (current === steps.length - 1) buildReview();
  }

  function updateProgress() {
    const pct = (current / (steps.length - 1)) * 100;
    progressFill.style.width = pct + '%';
    // visually mark dots up to current
    dots.forEach((d, i) => d.classList.toggle('active', i <= current));
  }

  function showToast(msg) {
    // minimal toast (browser alert replaced by console + small visual effect could be added)
    console.info('[Form] ' + msg);
  }

  // ---------- Pill groups (Sim/Não) ----------
  // For each .pill with data-target create/find hidden input name=target and set default 'nao'
  document.querySelectorAll('.pill').forEach(p => {
    const target = p.dataset.target;
    if (!target) return;
    // create hidden input if not exists
    let hidden = document.querySelector(`input[type="hidden"][name="${target}"]`);
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = target;
      hidden.value = 'nao';
      // insert after pill
      p.insertAdjacentElement('afterend', hidden);
    }

    // button click behaviour
    const buttons = Array.from(p.querySelectorAll('button'));
    // ensure at least one button has .active; default to 'nao' if found
    let defaultBtn = buttons.find(b => b.dataset.value === 'nao') || buttons[0];
    buttons.forEach(b => b.classList.remove('active'));
    if (defaultBtn) defaultBtn.classList.add('active'), hidden.value = defaultBtn.dataset.value;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hidden.value = btn.dataset.value;
        updateConditionalsFor(target);
        updateNextState(current);
      });
    });
  });

  // ---------- Conditionals ----------
  // Elements that should show/hide have attribute data-show="name=value"
  const conditionalEls = Array.from(document.querySelectorAll('[data-show]'));
  function parseRule(rule) {
    const [name, value] = rule.split('=').map(s => s.trim());
    return { name, value };
  }
  function updateConditionalsFor(name) {
    conditionalEls.forEach(el => {
      const rule = el.getAttribute('data-show');
      if (!rule) return;
      const { name: rname, value } = parseRule(rule);
      if (rname !== name) return;
      const hidden = document.querySelector(`input[type="hidden"][name="${rname}"]`);
      const v = hidden ? hidden.value : null;
      if (v === value) {
        el.classList.remove('hidden');
      } else {
        // hide & clear
        el.classList.add('hidden');
        const inputs = el.querySelectorAll('input, textarea, select');
        if (inputs.length === 0 && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
          el.value = '';
        } else {
          inputs.forEach(i => i.value = '');
        }
      }
    });
  }
  // init conditionals for all pill targets
  document.querySelectorAll('.pill').forEach(p => {
    const target = p.dataset.target;
    if (target) updateConditionalsFor(target);
  });

  // ---------- Next / Prev / validation ----------
  function getVisibleRequiredFields(stepIndex) {
    const step = steps[stepIndex];
    // select [required] inputs/textarea/select but only those visible
    return Array.from(step.querySelectorAll('[required]')).filter(isVisible);
  }

  function updateNextState(stepIndex) {
    const step = steps[stepIndex];
    if (!step) return;
    const nextBtn = step.querySelector('.btn-next');
    if (!nextBtn) return;
    const reqs = getVisibleRequiredFields(stepIndex);
    if (reqs.length === 0) {
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
      return;
    }
    const ok = reqs.every(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        return el.checked;
      }
      return String(el.value || '').trim().length > 0;
    });
    nextBtn.disabled = !ok;
    nextBtn.classList.toggle('disabled', !ok);
  }

  // bind input/change to update next button live
  steps.forEach((step, idx) => {
    const inputs = Array.from(step.querySelectorAll('input, textarea, select'));
    inputs.forEach(inp => {
      const ev = (inp.tagName === 'SELECT' || inp.type === 'checkbox' || inp.type === 'radio') ? 'change' : 'input';
      inp.addEventListener(ev, () => updateNextState(idx));
    });
    updateNextState(idx); // initial
  });

  // next buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      // validate current step
      const reqs = getVisibleRequiredFields(current);
      for (let el of reqs) {
        if (!el.value || String(el.value).trim() === '') {
          el.focus();
          showToast('Preencha os campos obrigatórios dessa etapa.');
          return;
        }
      }
      if (current < steps.length - 1) setActiveStep(current + 1);
    });
  });
  // prev buttons
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) setActiveStep(current - 1);
    });
  });

  // dot clicks: allow only going BACK (not forward)
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (idx <= current) setActiveStep(idx);
    });
  });

  // ---------- Review (final step) ----------
  function buildReview() {
    const box = document.getElementById('reviewBox');
    if (!box) return;
    const pairs = [
      ['Nome', 'nome'], ['Idade', 'idade'], ['Peso (kg)', 'peso'], ['Altura (cm)', 'altura'],
      ['Endereço', 'endereco'], ['Objetivos', 'objetivos'],
      ['Acorda', 'acorda'], ['Trabalho Início', 'trabalho_inicio'], ['Trabalho Fim', 'trabalho_fim'],
      ['Alimentação atual', 'alimentacao_atual'], ['Freq. treino (semanal)', 'freq_treino'],
      ['Suplementos', 'suplemento_quais'], ['Protocolos hormonais', 'hormonal_quais']
    ];
    const rows = pairs.map(([label, name]) => {
      const el = form.querySelector(`[name="${name}"]`);
      const val = el ? (el.value || '—') : '—';
      return `<div class="rev-row"><strong>${escapeHtml(label)}</strong>: ${escapeHtml(val)}</div>`;
    }).join('');
    box.innerHTML = `<h3>Resumo rápido</h3>${rows}`;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // ---------- Submit ----------
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Validate all required visible fields across steps
    for (let i = 0; i < steps.length; i++) {
      const reqs = getVisibleRequiredFields(i);
      for (let el of reqs) {
        if (!el.value || String(el.value).trim() === '') {
          setActiveStep(i);
          el.focus();
          showToast('Existem campos obrigatórios faltando. Abrindo etapa correspondente.');
          return;
        }
      }
    }
    // Collect form data (including hidden inputs created for pill groups)
    const fd = new FormData(form);
    const obj = {};
    fd.forEach((v,k) => { obj[k] = v; });
    console.log('Form submission (simulação):', obj);
    alert('Formulário finalizado (simulação). Veja os dados no console.');
  });

  // initial update
  updateProgress();
});
