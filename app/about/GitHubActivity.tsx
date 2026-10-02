import { site } from "../lib/site";

type Day = { date: string; count: number; level: number };
type Repo = { name: string; html_url: string; language: string | null; pushed_at: string; description: string | null; fork: boolean };

const USER = "BhanuPrasadPalella-01";

async function getData() {
  try {
    const [contrib, repos] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, { next: { revalidate: 3600 } }).then((r) =>
        r.ok ? (r.json() as Promise<{ total: { lastYear: number }; contributions: Day[] }>) : null
      ),
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`, {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }).then((r) => (r.ok ? (r.json() as Promise<Repo[]>) : null)),
    ]);
    return { contrib, repos: repos?.filter((r) => !r.fork) ?? null };
  } catch {
    return { contrib: null, repos: null };
  }
}

const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

function timeAgo(iso: string) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// Live GitHub activity: last year's contribution heatmap and recently pushed repos (refreshed hourly).
export default async function GitHubActivity() {
  const { contrib, repos } = await getData();
  if (!contrib && !repos) return null;

  // Group days into week columns starting on Sunday.
  const weeks: (Day | null)[][] = [];
  if (contrib) {
    const days = contrib.contributions;
    const pad = new Date(days[0].date).getDay();
    let col: (Day | null)[] = Array(pad).fill(null);
    for (const d of days) {
      col.push(d);
      if (col.length === 7) {
        weeks.push(col);
        col = [];
      }
    }
    if (col.length) weeks.push(col);
  }

  return (
    <section className="mx-auto mt-40 w-full max-w-[1400px] px-5 sm:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.03em] text-ink">
          Shipping <em className="text-accent italic">log</em>
        </h2>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-line self-start font-mono text-[11px] tracking-[0.18em] text-ink uppercase md:self-auto">
          github.com/{USER} ↗
        </a>
      </div>

      {contrib && (
        <div className="mt-12 rounded-[1.5rem] border border-surface-border p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-ink">
              <span className="font-display text-3xl text-accent">{contrib.total.lastYear}</span>{" "}
              <span className="text-ink-soft">contributions in the last year</span>
            </p>
            <p className="font-mono text-[10px] tracking-[0.15em] text-ink-soft uppercase">Live from GitHub · refreshed hourly</p>
          </div>
          <div className="mt-6 overflow-x-auto pb-2" data-lenis-prevent>
            <div className="flex w-max gap-[3px]">
              {weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {w.map((d, j) =>
                    d ? (
                      <span
                        key={d.date}
                        title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                        className="block h-[11px] w-[11px] rounded-[3px] bg-accent transition-transform hover:scale-150"
                        style={{ opacity: LEVEL_OPACITY[d.level] }}
                      />
                    ) : (
                      <span key={`pad-${j}`} className="block h-[11px] w-[11px]" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {repos && repos.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <li key={r.name}>
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Repo"
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-surface-border p-5 transition-colors duration-500 hover:border-ink hover:bg-ink"
              >
                <div>
                  <p className="font-display text-xl text-ink transition-colors duration-500 group-hover:text-background">{r.name}</p>
                  {r.description && (
                    <p className="mt-1 text-sm text-ink-soft transition-colors duration-500 group-hover:text-background/70">{r.description}</p>
                  )}
                </div>
                <p className="flex justify-between font-mono text-[11px] text-ink-soft transition-colors duration-500 group-hover:text-background/70">
                  <span>{r.language ?? "—"}</span>
                  <span>pushed {timeAgo(r.pushed_at)}</span>
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
