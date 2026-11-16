import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Search, Leaf, BookOpen, MapPin, CloudSun, Recycle, ExternalLink, ShieldCheck } from 'lucide-react';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All topics');
  const [kind, setKind] = useState('All records');

  useEffect(() => {
    async function load() {
      if (!supabase) { setError('Database is not connected yet. Complete the Supabase setup to load the research library.'); setLoading(false); return; }
      const { data, error } = await supabase.from('research_records').select('*').order('publication_date', { ascending: false, nullsFirst: false });
      if (error) setError(error.message); else setReports(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const topics = useMemo(() => ['All topics', ...new Set(reports.map(r => r.topic).filter(Boolean))], [reports]);
  const filtered = reports.filter(r => {
    const hay = [r.title, r.agency, r.summary, r.sindh_relevance, r.topic].join(' ').toLowerCase();
    return hay.includes(query.toLowerCase()) && (topic === 'All topics' || r.topic === topic) && (kind === 'All records' || r.record_type === kind);
  });

  return <div className="app">
    <header className="hero">
      <div className="nav"><div className="brand"><span className="brandmark"><Leaf size={23}/></span><span>EcoSindh <b>AI</b></span></div><span className="navtag">ENVIRONMENTAL INTELLIGENCE</span></div>
      <div className="hero-content"><p className="eyebrow">SINDH FIRST · PAKISTAN FOCUSED</p><h1>Research for a<br/><em>healthier environment.</em></h1><p className="intro">A searchable library of verified environmental reports, climate updates, policies and practical knowledge.</p><div className="hero-pills"><span>English</span><span>سنڌي</span><span>اردو</span></div></div>
      <div className="hero-leaf"><Leaf size={190}/></div>
    </header>
    <main>
      <section className="quick-grid">
        <div className="quick"><BookOpen/><b>Research library</b><small>Reports, bulletins & policies</small></div>
        <div className="quick"><MapPin/><b>Sindh district focus</b><small>Local relevance and context</small></div>
        <div className="quick"><CloudSun/><b>Climate intelligence</b><small>Forecasts vs observations</small></div>
        <div className="quick"><Recycle/><b>Practical solutions</b><small>Low-cost environmental action</small></div>
      </section>
      <section className="library">
        <div className="section-head"><div><p className="eyebrow green">THE KNOWLEDGE BASE</p><h2>Environmental research library</h2><p className="muted">Records are labelled by publication status and verification level.</p></div><div className="count">{reports.length}<small> records</small></div></div>
        <div className="filters"><label className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search reports, agencies, districts..."/></label><select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select><select value={kind} onChange={e=>setKind(e.target.value)}><option>All records</option><option value="new_publication">New publication</option><option value="older_discovered">Older document</option><option value="agency_update">Agency update</option><option value="pending_verification">Pending verification</option></select></div>
        {loading && <p className="notice">Loading the research library…</p>}
        {error && <div className="notice"><b>Setup needed:</b> {error}<p>Follow the included README to connect the database and publish the app.</p></div>}
        {!loading && !error && filtered.length===0 && <div className="empty">No matching records. Try another search or topic.</div>}
        <div className="cards">{filtered.map(r=><article className="record" key={r.id}>
          <div className="record-top"><span className="topic">{r.topic || 'Environment'}</span><span className={`status ${r.record_type}`}>{(r.record_type || '').replaceAll('_',' ')}</span></div>
          <h3>{r.title}</h3><p className="agency">{r.agency} · {r.publication_date || 'Date not verified'}</p><p>{r.summary}</p>
          {r.sindh_relevance && <p className="relevance"><MapPin size={14}/>{r.sindh_relevance}</p>}
          <div className="record-bottom"><span><ShieldCheck size={14}/> {r.verification_status?.replaceAll('_',' ')}</span>{r.source_url ? <a href={r.source_url} target="_blank" rel="noreferrer">Original source <ExternalLink size={14}/></a> : <span className="pending-link">Source link awaiting verification</span>}</div>
        </article>)}</div>
      </section>
    </main>
    <footer><div className="brand"><span className="brandmark"><Leaf size={19}/></span><span>EcoSindh <b>AI</b></span></div><p>Evidence-led environmental awareness for Sindh and Pakistan.</p><small>Research records must retain original sources, publication dates and verification notes.</small></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
