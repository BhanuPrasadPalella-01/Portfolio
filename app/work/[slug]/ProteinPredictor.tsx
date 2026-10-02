"use client";

import { useEffect, useState } from "react";
import { gsap } from "../../lib/gsap";
import { sfx } from "../../lib/sound";

const API = "https://protein-ss-backend.onrender.com";
const EXAMPLE = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQCGVWPAACRESVPALL";
const VALID = /^[ACDEFGHIKLMNPQRSTVWYXacdefghiklmnpqrstvwyx\s]+$/;

type Result = { sequence: string; predicted_structure: string; percentages: { H: number; E: number; C: number } };

const COLORS: Record<string, string> = { H: "#b5844f", E: "#7fa36b", C: "#9b9ca5" };
const NAMES: Record<string, string> = { H: "Helix", E: "Strand", C: "Coil" };

// Runs the live baseline model from the protein project's own API.
export default function ProteinPredictor() {
  const [seq, setSeq] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // The API sleeps on a free tier; start waking it as soon as the page opens.
  useEffect(() => {
    fetch(`${API}/health`).catch(() => {});
  }, []);

  useEffect(() => {
    if (result) gsap.fromTo("[data-residue]", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.004, ease: "expo.out" });
  }, [result]);

  const run = async () => {
    const clean = seq.replace(/\s+/g, "").toUpperCase();
    if (!clean) return setError("Paste an amino-acid sequence first");
    if (!VALID.test(seq)) return setError("Use one-letter amino-acid codes only (A, C, D, E…)");
    if (clean.length < 5) return setError("Use at least 5 residues");
    setError("");
    setLoading(true);
    setResult(null);
    const t = window.setTimeout(() => setSlow(true), 4000);
    try {
      const res = await fetch(`${API}/predict/baseline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: clean }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(typeof data?.detail === "string" ? data.detail : `Server error ${res.status}. Try again.`);
      setResult(data);
      sfx.beep();
    } catch (e) {
      setError(e instanceof TypeError ? "Couldn't reach the prediction server. Try again in a moment." : (e as Error).message);
    } finally {
      window.clearTimeout(t);
      setSlow(false);
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-32 w-full max-w-[1400px] px-5 sm:px-10">
      <p className="eyebrow">
        <span className="text-accent">●</span> Try it — live model
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-surface-border p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="seq" className="font-display text-2xl text-ink">
            Paste a protein sequence
          </label>
          <button type="button" onClick={() => { setSeq(EXAMPLE); setError(""); }} className="link-line font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase hover:text-ink">
            Use an example
          </button>
        </div>
        <textarea
          id="seq"
          value={seq}
          onChange={(e) => {
            setSeq(e.target.value);
            if (error) setError("");
          }}
          rows={4}
          spellCheck={false}
          placeholder="MKTAYIAKQRQISFVKSHFSRQ…"
          className="mt-4 w-full resize-y rounded-2xl border border-surface-border bg-transparent p-4 font-mono text-sm break-all text-ink outline-none placeholder:text-ink-soft focus:border-ink"
          data-lenis-prevent
        />
        {error && <p className="mt-2 text-[13px] text-[#d14b3c]">{error}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="rounded-full bg-ink px-6 py-3 text-sm text-background transition-colors hover:bg-accent disabled:opacity-60"
          >
            {loading ? "Predicting…" : "Predict structure"}
          </button>
          <p className="text-sm text-ink-soft">
            {slow ? "Waking the server up — the first request can take ~30 seconds." : "Runs the sequence-only baseline (~68.7% Q3); the 80% model needs a PSSM profile."}
          </p>
        </div>

        {result && (
          <div className="mt-8 border-t border-surface-border pt-6">
            <div className="flex h-3 overflow-hidden rounded-full">
              {(["H", "E", "C"] as const).map((k) => (
                <div key={k} style={{ width: `${result.percentages[k]}%`, background: COLORS[k] }} title={`${NAMES[k]} ${result.percentages[k]}%`} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-5 font-mono text-[12px] text-ink">
              {(["H", "E", "C"] as const).map((k) => (
                <span key={k} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[k] }} />
                  {NAMES[k]} {result.percentages[k]}%
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-[3px] font-mono text-[11px]" data-lenis-prevent>
              {result.sequence.split("").map((aa, i) => {
                const s = result.predicted_structure[i];
                return (
                  <span
                    key={i}
                    data-residue
                    title={`${aa}${i + 1} · ${NAMES[s]}`}
                    className="flex h-7 w-6 flex-col items-center justify-center rounded text-[#16181d]"
                    style={{ background: COLORS[s] }}
                  >
                    {aa}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
