import { useEffect, useState } from "preact/hooks";
import { delay, sanitizeUrl } from "@/common/utils";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { getBackoff, probePlayerAvailability } from "@/player/utils";

const MAX_LOAD_RETRIES = 5;

// Falha confirmada (probe leu um status 5xx real): espera um tempo fixo antes de tentar de novo.
const PROBE_RETRY_MS = 1_000;

// Sem falha confirmada, mas o player unity nunca sinalizou ON_LOAD_PLAYER: assume que travou
// (ex.: um 503 que o probe não conseguiu ler por causa de CORS) e recarrega com timeout crescente.
const STUCK_LOAD_BASE_MS = 8_000;
const STUCK_LOAD_MAX_MS = 30_000;

// Só resolve o src do iframe do player quando o servidor unity é confirmado como acessível (ou
// quando o probe é inconclusivo), e tenta novamente com backoff se vier indisponível ou travar
// no meio do carregamento. Veja `probePlayerAvailability` para entender por que isso não pode
// depender apenas do status HTTP.
export const usePlayerIframeSrc = (path: string, version: string) => {
	const [retryCount, setRetryCount] = useState(0);
	const [src, setSrc] = useState<string>();

	const isLoaded = usePlayerStore((s) => s.isLoaded);

	useEffect(() => {
		const retryLoad = () => {
			playerStore.set({ isBroken: false });
			setSrc(undefined);
			setRetryCount(0);
		};

		playerStore.set({ retryLoad });
	}, []);

	useEffect(() => {
		if (!path) return;
		if (retryCount >= MAX_LOAD_RETRIES) return void playerStore.set({ isBroken: true });

		let cancelled = false;
		const url = sanitizeUrl(`${path}/unity/index.html?v=${version}${retryCount ? `&retry=${retryCount}` : ""}`);

		probePlayerAvailability(url).then(async (result) => {
			if (cancelled) return;

			if (result === "unavailable") {
				await delay(PROBE_RETRY_MS);
				if (!cancelled) setRetryCount((count) => count + 1);
				return;
			}

			setSrc(url);
		});

		return () => {
			cancelled = true;
		};
	}, [path, version, retryCount]);

	useEffect(() => {
		if (!src || isLoaded || retryCount >= MAX_LOAD_RETRIES) return;

		const timeoutMs = getBackoff(retryCount, STUCK_LOAD_BASE_MS, STUCK_LOAD_MAX_MS);
		const timeoutId = setTimeout(() => setRetryCount((count) => count + 1), timeoutMs);

		return () => clearTimeout(timeoutId);
	}, [src, isLoaded, retryCount]);

	return src;
};
