// \u200E is zero width joiner (used to not cache in Unity)
// @important: Temporary solution

export const noCachedGloss = (gloss) => {
  return gloss
    .split(' ')
    .map((word) => (!isSpecialSignal(word) ? word + '\u200E' : word))
    .join(' ');
};

function isSpecialSignal(signal) {
  return signal.includes('['); // ex.: [WLCM]ICARO_SINAL, [PONTO]
}
