/**
 * TreatmentLog — Contract §10, §4 Signature Move #1
 *
 * Format: SVC-XX · <SERVICE> · STG <n> · EST <hrs> · ● <STATUS>
 * Mono 0.65rem, uppercase, letter-spacing 0.06em
 * Dark bg, red top+bottom borders (rgba(232,5,5,.3))
 * STATUS: READY (green dot) or BOOKING (red pulsing dot)
 *
 * This is a server component — pulse animation is pure CSS.
 *
 * ── SLUG → {code, est} MAP ────────────────────────────────────
 * Sources (real times from lib/site.ts FAQ/process copy):
 *   car-detailing         FAQ: "3–5 hours"           → 3-5H
 *   exterior-detailing    FAQ: "2–3 hours"            → 2-3H
 *   interior-detailing    FAQ: "2–4 hours"            → 2-4H
 *   ceramic-coating       Process: multi-stage + cure → 4H-1D
 *   paint-correction      FAQ: "4 hours to a full day"→ 4H-1D
 *   paint-protection-film Process: 4 stages           → 3-5H
 *   window-tinting        FAQ: "2–3 hours"            → 2-3H
 *   fleet-detailing       FAQ: fleet-dependent        → VARIES
 */

export type TreatmentStatus = 'READY' | 'BOOKING';

interface TreatmentLogProps {
  code:   string;          // e.g. "CD"
  title:  string;          // service name, uppercased
  stage:  number;          // process.length
  est:    string;          // e.g. "3-5H"
  status: TreatmentStatus;
}

export function TreatmentLog({
  code,
  title,
  stage,
  est,
  status,
}: TreatmentLogProps) {
  const isReady = status === 'READY';

  return (
    <div
      style={{
        background:    'var(--surface-dark-2)',
        borderTop:     '1px solid rgba(232,5,5,0.3)',
        borderBottom:  '1px solid rgba(232,5,5,0.3)',
        padding:       'var(--pin) var(--bolt)',
        fontFamily:    'var(--font-mono)',
        fontSize:      '0.65rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color:         'var(--ink-faint)',
        display:       'flex',
        flexWrap:      'wrap',
        alignItems:    'center',
        gap:           '0.35rem',
        borderRadius:  'var(--r-sm)',
      }}
      aria-label={`Service log: ${title}, stage ${stage}, estimated ${est}, status ${status}`}
    >
      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>SVC-{code}</span>
      <span style={{ color: 'var(--muted)' }}>·</span>
      <span>{title}</span>
      <span style={{ color: 'var(--muted)' }}>·</span>
      <span>STG {stage}</span>
      <span style={{ color: 'var(--muted)' }}>·</span>
      <span>EST {est}</span>
      <span style={{ color: 'var(--muted)' }}>·</span>

      {/* Status dot + label */}
      <span
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '0.3rem',
          color:      isReady ? 'var(--success)' : 'var(--accent)',
        }}
      >
        <span
          style={{
            display:      'inline-block',
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   isReady ? 'var(--success)' : 'var(--accent)',
            animation:    isReady
              ? 'pulse-dot-green 2s cubic-bezier(0.2,0,0,1) infinite'
              : 'pulse-dot 2s cubic-bezier(0.2,0,0,1) infinite',
          }}
          aria-hidden="true"
        />
        {status}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLUG-TO-LOG MAP — used by ServiceCard and page workers
   ═══════════════════════════════════════════════════════════════ */
export interface LogMeta {
  code:   string;
  est:    string;
  status: TreatmentStatus;
}

export const slugToLog: Record<string, LogMeta> = {
  'car-detailing':          { code: 'CD', est: '3-5H',   status: 'BOOKING' },
  'exterior-detailing':     { code: 'EX', est: '2-3H',   status: 'READY'   },
  'interior-detailing':     { code: 'IN', est: '2-4H',   status: 'READY'   },
  'ceramic-coating':        { code: 'CC', est: '4H-1D',  status: 'BOOKING' },
  'paint-correction':       { code: 'PC', est: '4H-1D',  status: 'BOOKING' },
  'paint-protection-film':  { code: 'PP', est: '3-5H',   status: 'READY'   },
  'window-tinting':         { code: 'WT', est: '2-3H',   status: 'READY'   },
  'fleet-detailing':        { code: 'FL', est: 'VARIES', status: 'BOOKING' },
};

/** Helper: derive TreatmentLog props from a service object */
export function getLogProps(slug: string, name: string, stageCount: number): TreatmentLogProps {
  const meta = slugToLog[slug] ?? { code: slug.slice(0, 2).toUpperCase(), est: '—', status: 'READY' as TreatmentStatus };
  return {
    code:   meta.code,
    title:  name.toUpperCase(),
    stage:  stageCount,
    est:    meta.est,
    status: meta.status,
  };
}
