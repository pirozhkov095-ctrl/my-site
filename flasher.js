(() => {
  const board = document.getElementById('flash-board');
  const firmware = document.getElementById('flash-firmware');
  const action = document.getElementById('flash-action');
  const status = document.getElementById('flash-status');
  let loadTools;
  const firmwareOptions = {
    atoms3: [['nag', 'Nag-killer'], ['summon', 'EU Summon Unlock']],
    t2can: [['universal', 'T2-CAN Universal Unlock'], ['advanced', 'Advanced-EAP & EU-Unlock']],
    p4: [['p4_universal', 'P4-CAN Universal Unlock']]
  };

  function updateFirmwareChoices() {
    const options = firmwareOptions[board.value] || [];
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = options.length ? 'Select a firmware' : 'Select a board first';
    firmware.replaceChildren(placeholder);
    options.forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      firmware.appendChild(option);
    });
    firmware.value = '';
    firmware.disabled = options.length === 0;
    update();
  }

  function disabled(message) {
    const button = document.createElement('button');
    button.className = 'button dark';
    button.type = 'button';
    button.disabled = true;
    button.textContent = 'Install firmware';
    action.replaceChildren(button);
    status.textContent = message;
  }

  function ensureTools() {
    if (!loadTools) {
      loadTools = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('ESP Web Tools could not be loaded.'));
        document.head.appendChild(script);
      });
    }
    return loadTools;
  }

  async function update() {
    const boardId = board.value;
    const firmwareId = firmware.value;
    if (!boardId || !firmwareId) {
      disabled('Select your board and firmware to continue.');
      return;
    }
    const manifest = window.T_UNLEASH_MANIFESTS?.[boardId]?.[firmwareId];
    if (typeof manifest !== 'string' || !manifest.trim()) {
      disabled('This selection is not available yet. No firmware manifest has been configured.');
      return;
    }
    let url;
    try {
      url = new URL(manifest, document.baseURI);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid protocol');
    } catch (_) {
      disabled('The firmware manifest URL is invalid.');
      return;
    }
    if (!window.isSecureContext || !('serial' in navigator)) {
      disabled('Web Serial is unavailable. Open this page over HTTPS in a supported desktop browser.');
      return;
    }
    disabled('Loading the web flasher…');
    try {
      await ensureTools();
      if (board.value !== boardId || firmware.value !== firmwareId) return;
      const installer = document.createElement('esp-web-install-button');
      installer.setAttribute('manifest', url.href);
      const button = document.createElement('button');
      button.slot = 'activate';
      button.className = 'button dark';
      button.type = 'button';
      button.textContent = 'Install firmware';
      installer.appendChild(button);
      action.replaceChildren(installer);
      status.textContent = 'Ready to install. Select your serial port when prompted.';
    } catch (_) {
      if (board.value === boardId && firmware.value === firmwareId) {
        loadTools = undefined;
        disabled('The web flasher could not be loaded. Check your connection and try again.');
      }
    }
  }

  board.addEventListener('change', updateFirmwareChoices);
  firmware.addEventListener('change', update);
  updateFirmwareChoices();
})();
