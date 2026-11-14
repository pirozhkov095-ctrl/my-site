// Add an ESP Web Tools manifest URL for each verified board / firmware pair.
// A null value keeps installation unavailable. Do not list unverified combinations.
// Example: nag: "firmware/atoms3-nag-manifest.json"
window.T_UNLEASH_MANIFESTS = {
  atoms3: { nag: null, summon: null },
  t2can:  { universal: null, advanced: null },
  p4:     { p4_universal: null }
};
