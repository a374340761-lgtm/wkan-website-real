(function () {
  var OPTIONS = {
    size: {
      '3x3m': '3x3 m / 10x10 ft',
      '3x4.5m': '3x4.5 m',
      '3x6m': '3x6 m',
      custom: 'Custom size',
    },
    frame: {
      steel: 'Powder-coated steel',
      aluminum40: '40 mm aluminum',
      aluminum50: '50 mm heavy-duty aluminum',
    },
    color: {
      white: 'White',
      black: 'Black',
      blue: 'Blue',
      red: 'Red',
      custom: 'Custom Pantone color',
    },
    accessory: {
      none: 'No accessory',
      walls: 'Full sidewalls',
      weights: 'Weights / sandbags',
      wheels: 'Wheeled carry bag',
    },
    print: {
      valance: 'Valance logo print',
      full: 'Full canopy print',
      walls: 'Canopy + wall graphics',
      blank: 'Blank canopy',
    },
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function value(root, name) {
    var el = $('[name="' + name + '"]', root);
    return el ? el.value : '';
  }

  function label(group, key) {
    return (OPTIONS[group] && OPTIONS[group][key]) || key || '';
  }

  function skuPart(text) {
    return String(text || '')
      .replace(/[^a-z0-9]+/gi, '')
      .toUpperCase()
      .slice(0, 8);
  }

  function buildConfig(root) {
    var cfg = {
      size: value(root, 'customizer_size'),
      frame: value(root, 'customizer_frame'),
      color: value(root, 'customizer_color'),
      accessory: value(root, 'customizer_accessory'),
      print: value(root, 'customizer_print'),
    };
    cfg.sku = ['WK', 'TENT', skuPart(cfg.size), skuPart(cfg.frame), skuPart(cfg.color), skuPart(cfg.print)]
      .filter(Boolean)
      .join('-');
    cfg.summary =
      'Configured canopy tent: ' +
      label('size', cfg.size) +
      '; frame: ' +
      label('frame', cfg.frame) +
      '; canopy color: ' +
      label('color', cfg.color) +
      '; print: ' +
      label('print', cfg.print) +
      '; accessory: ' +
      label('accessory', cfg.accessory) +
      '. Reference SKU: ' +
      cfg.sku +
      '.';
    return cfg;
  }

  function update(root) {
    var cfg = buildConfig(root);
    var skuEl = $('[data-customizer-sku]', root);
    var summaryEl = $('[data-customizer-summary]', root);
    if (skuEl) skuEl.textContent = cfg.sku;
    if (summaryEl) summaryEl.textContent = cfg.summary;
    root.dataset.customizerSummary = cfg.summary;
    return cfg;
  }

  function applyToQuote(root) {
    var cfg = update(root);
    var form = document.getElementById('getQuoteForm');
    if (!form) return;
    var product = form.elements && form.elements.product;
    var message = form.elements && form.elements.message;
    if (product && !product.value.trim()) {
      product.value = 'Custom canopy tent - ' + cfg.sku;
    }
    if (message) {
      var current = String(message.value || '').trim();
      message.value = current ? current + '\n\n' + cfg.summary : cfg.summary;
    }
    var panel = document.getElementById('getQuoteFormPanel') || form;
    if (panel && typeof panel.scrollIntoView === 'function') {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-wk-customizer]').forEach(function (root) {
      update(root);
      root.addEventListener('change', function () {
        update(root);
      });
      var apply = $('[data-customizer-apply]', root);
      if (apply) {
        apply.addEventListener('click', function () {
          applyToQuote(root);
        });
      }
    });
  });
})();
