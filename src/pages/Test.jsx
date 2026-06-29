import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STEPS, AREAS } from '../data/quiz.js'
import { bySlug } from '../data/needs.js'
import SiteFooter from '../components/SiteFooter.jsx'

const Check = () => (
  <svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg>
)

// platnosť kroku pre tlačidlo „Pokračovat"
function stepValid(s, answers) {
  if (!s) return true
  if (s.type === 'choice') return answers[s.id] != null
  if (s.type === 'form') {
    const v = answers[s.id] || {}
    return s.fields.every((f) => !f.required || String(v[f.id] ?? '').trim() !== '')
  }
  return true // voľný text je nepovinný
}

export default function Test() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const total = STEPS.length
  const done = step >= total

  const current = STEPS[step]

  const result = useMemo(() => {
    let sum = 0, count = 0
    const gaps = []
    for (const area of AREAS) {
      const ai = answers[area.id]
      if (ai == null) continue
      const opt = area.options[ai]
      if (opt.score == null) continue       // netýka sa
      sum += opt.score
      count += 1
      if (opt.gap) gaps.push(area)
      else gaps.push({ ...area, ok: true })
    }
    const pct = count ? Math.round((sum / count) * 100) : 0
    return { pct, gaps }
  }, [answers])

  const pickChoice = (i) => setAnswers((a) => ({ ...a, [current.id]: i }))
  const setField = (fid, val) => setAnswers((a) => ({ ...a, [current.id]: { ...(a[current.id] || {}), [fid]: val } }))
  const setText = (val) => setAnswers((a) => ({ ...a, [current.id]: val }))
  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => Math.max(0, s - 1))

  const canNext = stepValid(current, answers)
  const progress = done ? 100 : Math.round(((step + 1) / total) * 100)

  return (
    <div className="quiz">
      {!done && (
        <>
          <div className="quiz-main">
            {/* kompaktný, NElepkavý progres */}
            <div className="quiz-top">
              <div className="quiz-step-n">
                <span>Krok {step + 1} z {total}</span>
                <span>{current.label}</span>
              </div>
              <div className="quiz-prog"><i style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="quiz-q" key={current.id}>
              <div className="quiz-ic">
                <svg viewBox="0 0 24 24"><path d={current.icon} /></svg>
              </div>
              <h2>{current.q}</h2>
              {current.sub && <p className="sub">{current.sub}</p>}

              {/* === VÝBER === */}
              {current.type === 'choice' && (
                <div className="opts">
                  {current.options.map((o, i) => (
                    <button key={i} className={`opt ${answers[current.id] === i ? 'sel' : ''}`} onClick={() => pickChoice(i)}>
                      <span className="box"><Check /></span>
                      {o.t}
                    </button>
                  ))}
                </div>
              )}

              {/* === VYPLNENIE: osobné info === */}
              {current.type === 'form' && (
                <div className="quiz-form">
                  {current.fields.map((f) => {
                    const v = (answers[current.id] || {})[f.id] ?? ''
                    return (
                      <label key={f.id} className={`quiz-flabel ${f.span === 2 ? 'span2' : ''}`}>
                        <span>{f.label}{f.required && <i className="req">*</i>}</span>
                        {f.type === 'select' ? (
                          <select className="quiz-field" value={v} onChange={(e) => setField(f.id, e.target.value)}>
                            <option value="" disabled>{f.placeholder}</option>
                            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <span className={`quiz-input ${f.suffix ? 'has-suffix' : ''}`}>
                            <input
                              className="quiz-field"
                              type={f.type === 'number' ? 'number' : 'text'}
                              inputMode={f.type === 'number' ? 'numeric' : undefined}
                              min={f.min} max={f.max}
                              placeholder={f.placeholder}
                              value={v}
                              onChange={(e) => setField(f.id, e.target.value)}
                            />
                            {f.suffix && <span className="suffix">{f.suffix}</span>}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}

              {/* === VYPLNENIE: voľná poznámka === */}
              {current.type === 'text' && (
                <div className="quiz-form">
                  <label className="quiz-flabel span2">
                    <textarea
                      className="quiz-field quiz-area"
                      rows={5}
                      placeholder={current.placeholder}
                      value={answers[current.id] ?? ''}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="quiz-foot">
            <div className="quiz-foot-in">
              {step > 0 && <button className="btn btn-outline" onClick={back}>Zpět</button>}
              <button className="btn btn-primary" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.5 }} onClick={next}>
                {step === total - 1 ? 'Zobrazit výsledek' : 'Pokračovat'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </>
      )}

      {done && <Results result={result} me={answers.osobni || {}} onRestart={() => { setAnswers({}); setStep(0) }} />}
    </div>
  )
}

function Results({ result, me, onRestart }) {
  const { pct, gaps } = result
  const ok = gaps.filter((g) => g.ok)
  const miss = gaps.filter((g) => !g.ok)
  const r = 66, c = 2 * Math.PI * r
  const verdict = pct >= 80 ? 'Jste velmi dobře krytí' : pct >= 55 ? 'Základ máte, pár míst doladíme' : 'Máme co řešit – ale to je dobrá zpráva'
  const hello = me.jmeno ? `${me.jmeno}, ` : ''
  const headline = hello ? hello + verdict.charAt(0).toLowerCase() + verdict.slice(1) : verdict

  return (
    <div className="res">
      {/* HERO – plná šírka: text naľavo, skóre napravo */}
      <section className="res-hero">
        <div className="wrap res-hero-in">
          <div className="res-hero-tx">
            <h1>{headline}</h1>
            <p>Orientační skóre podle vašich odpovědí. Makléř ho s vámi upřesní a dotáhne v nástroji Profil klienta.</p>
          </div>
          <div className="res-ring">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="12" />
              <circle cx="75" cy="75" r={r} fill="none" stroke="#46D3FF" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} style={{ transition: 'stroke-dashoffset 1s var(--ease)' }} />
            </svg>
            <div className="pct"><b>{pct}%</b><small>pokrytí</small></div>
          </div>
        </div>
      </section>

      {/* TELO – dve strany: čo je OK / čo treba riešiť */}
      <section className="wrap res-body">
        {/* OK */}
        <div className="res-col">
          <div className="res-col-h ok">
            <span className="res-col-ic"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg></span>
            <div><span className="res-eyebrow">V pořádku</span><h2>{ok.length ? `${ok.length} oblast${ok.length > 1 ? 'i' : ''} máte krytou` : 'Zatím nic potvrzeného'}</h2></div>
          </div>
          {ok.length ? (
            <div className="res-list">
              {ok.map((g) => (
                <div className="res-ok-row" key={g.id}>
                  <span className="ic"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg></span>
                  <div><b>{g.label}</b><small>Vypadá to dobře – kryté.</small></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="res-empty">Projděte test znovu a vyplňte i oblasti, které jste přeskočili.</p>
          )}
        </div>

        {/* K ŘEŠENÍ */}
        <div className="res-col">
          <div className="res-col-h miss">
            <span className="res-col-ic"><svg viewBox="0 0 24 24"><path d="M12 8v5M12 16h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0z" /></svg></span>
            <div><span className="res-eyebrow">K řešení</span><h2>{miss.length ? `${miss.length} oblast${miss.length > 1 ? 'i' : ''} doporučujeme probrat` : 'Vše podstatné máte pokryté 🎉'}</h2></div>
          </div>
          {miss.length ? (
            <div className="res-list">
              {miss.map((g) => {
                const prod = bySlug(g.slug)
                return (
                  <div className="res-fix" key={g.id}>
                    <div className="res-fix-top">
                      <b>{g.label}</b>
                      {g.save && <span className="res-save">{g.save}</span>}
                    </div>
                    <p>{g.why || 'Tuto oblast doporučujeme probrat s poradcem.'}</p>
                    {prod && <Link className="arrow-link" to="/vozidla">{prod.service}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="res-empty">Skvělé – podle odpovědí nemáte žádné zásadní díry v krytí.</p>
          )}
        </div>
      </section>

      {/* BANNER – čistý štýl ako na home */}
      <section className="wrap" style={{ paddingBottom: 'var(--sec)' }}>
        <div className="promo">
          <div className="promo-in">
            <div className="res-eyebrow on-dark">Nevíte si rady?</div>
            <h2>Probereme to s vámi osobně</h2>
            <p>Nezávazná konzultace s poradcem, který vaše odpovědi dotáhne do konkrétního plánu – bez děr v krytí i bez přeplácení.</p>
            <div className="row">
              <Link to="/" className="btn btn-white">Domluvit konzultaci</Link>
              <button className="btn btn-ghost-d" onClick={onRestart}>Vyplnit znovu</button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
