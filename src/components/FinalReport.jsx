import React from 'react';

const PERSONALITY_MAP = {
  creative: {
    type: 'The Creative Visionary', icon: '🎨',
    description: 'You see the world differently and express it through art, design, and innovation.',
    passionZones: ['Visual Arts & Design', 'Creative Writing', 'Product Innovation', 'Music & Performance'],
    workStyle: 'You thrive in open, flexible environments with creative freedom and minimal rigid structure.',
    bestCareers: ['UI/UX Designer', 'Art Director', 'Product Designer', 'Content Strategist', 'Brand Consultant'],
    businessPotential: 'High — design agencies, creative studios, or a personal brand.',
    creativePotential: '⭐⭐⭐⭐⭐ Exceptional',
    growthAdvice: 'Build a portfolio that shows your thinking process, not just the final output. Your "why" is your superpower.',
    hiddenTalents: ['Pattern recognition', 'Emotional storytelling', 'Spatial visualization'],
    color: '#ff007f',
  },
  analytical: {
    type: 'The Systems Architect', icon: '🔩',
    description: 'You deconstruct complexity and build efficient, logical solutions with precision.',
    passionZones: ['Technology & Engineering', 'Data Science', 'Research', 'Strategic Planning'],
    workStyle: 'You thrive with deep focus, structured problems, and measurable outcomes.',
    bestCareers: ['Software Engineer', 'Data Scientist', 'Financial Analyst', 'Operations Manager', 'Research Scientist'],
    businessPotential: 'High — tech startups, consulting, or data-driven product companies.',
    creativePotential: '⭐⭐⭐ Strong in Systematic Innovation',
    growthAdvice: 'Develop communication skills to translate technical insights to non-technical audiences.',
    hiddenTalents: ['Spotting inefficiencies', 'Pattern prediction', 'Systems thinking'],
    color: '#00f2fe',
  },
  social: {
    type: 'The Empathetic Connector', icon: '🤝',
    description: 'You understand people deeply and build meaningful connections wherever you go.',
    passionZones: ['Community Building', 'Education', 'Psychology', 'Public Relations'],
    workStyle: 'You thrive in collaborative, people-focused environments with high interaction.',
    bestCareers: ['Psychologist', 'HR Director', 'Community Manager', 'Teacher', 'Public Speaker'],
    businessPotential: 'High — coaching, consulting, or community-driven platforms.',
    creativePotential: '⭐⭐⭐⭐ Strong in Human-Centered Design',
    growthAdvice: 'Learn to set boundaries so your empathy becomes a superpower, not a drain.',
    hiddenTalents: ['Reading emotions', 'Conflict mediation', 'Inspiring action in others'],
    color: '#8a2be2',
  },
  business: {
    type: 'The Growth Strategist', icon: '📈',
    description: 'You see opportunity everywhere and have a natural instinct for value creation.',
    passionZones: ['Entrepreneurship', 'Marketing', 'Finance', 'Innovation Management'],
    workStyle: 'You thrive in dynamic environments with autonomy, big goals, and measurable results.',
    bestCareers: ['Entrepreneur', 'Product Manager', 'Growth Hacker', 'Sales Director', 'Venture Capitalist'],
    businessPotential: '🚀 Exceptional — Born to Build Companies',
    creativePotential: '⭐⭐⭐ Strong in Innovative Problem Solving',
    growthAdvice: 'Balance your drive for speed with deep listening. The best ideas come from your customers.',
    hiddenTalents: ['Spotting market gaps', 'Persuasion', 'Turning vision into execution'],
    color: '#ffd700',
  },
  physical: {
    type: 'The Action Craftsman', icon: '🏃',
    description: 'You engage with the world through movement, craft, and hands-on creation.',
    passionZones: ['Sports & Athletics', 'Craftsmanship', 'Engineering', 'Health & Wellness'],
    workStyle: 'You thrive in physical, hands-on environments with tangible, visible results.',
    bestCareers: ['Industrial Designer', 'Athlete', 'Physical Trainer', 'Architect', 'Skilled Technician'],
    businessPotential: 'High — performance coaching, craft businesses, or physical products.',
    creativePotential: '⭐⭐⭐⭐ Strong in Functional Design',
    growthAdvice: 'Document your physical skills digitally — build a brand around your craft.',
    hiddenTalents: ['Spatial awareness', 'Mechanical intuition', 'Body-mind coordination'],
    color: '#ff4500',
  },
  leadership: {
    type: 'The Visionary Leader', icon: '👑',
    description: 'You naturally guide, inspire, and organize people toward shared meaningful goals.',
    passionZones: ['Leadership & Management', 'Social Impact', 'Education Reform', 'Policy'],
    workStyle: 'You thrive when given authority, clear goals, and a team to inspire and direct.',
    bestCareers: ['CEO/Director', 'Non-profit Founder', 'Executive Coach', 'Department Head', 'Political Leader'],
    businessPotential: '🚀 Exceptional — Born to Lead Organizations',
    creativePotential: '⭐⭐⭐ Strong in Strategic Innovation',
    growthAdvice: 'Great leaders are great listeners. Practice servant leadership to multiply your impact.',
    hiddenTalents: ['Reading group dynamics', 'Inspiring confidence', 'Long-term vision planning'],
    color: '#32cd32',
  },
};

const FinalReport = ({ session, history = [], onRestart, onGoHome }) => {
  const allTraits = (history || []).map(h => h.topTrait).filter(Boolean);
  const traitCounts = allTraits.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {});
  const dominantTrait = Object.entries(traitCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    || session?.topTrait || 'creative';

  const profile = PERSONALITY_MAP[dominantTrait] || PERSONALITY_MAP.creative;
  const totalSessions = (history || []).length;
  const completedLevels = [0, 1, 2].filter(lvl => (history || []).some(h => h.level === lvl));

  const insightCards = [
    { title: '🎯 Passion Zones', color: 'var(--accent)', items: profile.passionZones },
    { title: '🚀 Best Career Paths', color: 'var(--primary)', items: profile.bestCareers },
    { title: '💎 Hidden Talents', color: '#32cd32', items: profile.hiddenTalents },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '900px', animation: 'fadeInUp 0.5s ease-out' }}>

      {/* Hero Card */}
      <div className="glass-card" style={{
        textAlign: 'center', marginBottom: '1.5rem', padding: '3rem 2.5rem',
        background: `linear-gradient(135deg, rgba(${profile.color === '#ff007f' ? '255,0,127' : '138,43,226'}, 0.12), rgba(0,242,254,0.04))`,
        border: `1px solid ${profile.color}40`,
      }}>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1.25rem', display: 'inline-block' }}>
          🏆 PASSION FINDER — FINAL PASSION REPORT
        </span>
        <div style={{ fontSize: '4rem', margin: '0.5rem 0 1rem' }}>{profile.icon}</div>
        <h1 style={{ fontWeight: '800', marginBottom: '0.5rem', lineHeight: 1.1 }}>
          <span className="text-gradient">{profile.type}</span>
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
          {profile.description}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(138,43,226,0.2)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            {totalSessions} Total Sessions
          </span>
          <span className="badge" style={{ background: 'rgba(0,242,254,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            {dominantTrait.toUpperCase()} Dominant
          </span>
          <span className="badge" style={{ background: 'rgba(255,0,127,0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}>
            {completedLevels.length}/3 Levels Mastered
          </span>
        </div>
      </div>

      {/* Three insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {insightCards.map(card => (
          <div key={card.title} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${card.color}` }}>
            <h3 style={{ color: card.color, marginBottom: '1rem', fontSize: '1rem' }}>{card.title}</h3>
            <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
              {card.items.map((item, i) => (
                <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Work Style + Business/Creative Potential */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1rem' }}>💼 Work Style</h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.85 }}>{profile.workStyle}</p>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>✨ Creative Potential</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{profile.creativePotential}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ffd700' }}>
          <h3 style={{ color: '#ffd700', marginBottom: '0.75rem', fontSize: '1rem' }}>📈 Business Potential</h3>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.85 }}>{profile.businessPotential}</p>
          <h3 style={{ color: '#ffd700', marginBottom: '0.5rem', fontSize: '1rem' }}>🧠 Growth Advice</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85 }}>{profile.growthAdvice}</p>
        </div>
      </div>

      {/* Congratulations banner */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(0,242,254,0.05))', border: '1px solid rgba(138,43,226,0.3)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Congratulations!</h2>
        <p style={{ opacity: 0.75, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
          You've completed all 3 levels of the Passion Finder Discovery System. This report is your personal compass — use it to guide your career, creativity, and growth.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-large" style={{ flex: 1, minWidth: '200px' }} onClick={onGoHome}>
          ← Back to Dashboard
        </button>
        <button className="btn btn-outline btn-large" style={{ flex: 1, minWidth: '200px' }} onClick={onRestart}>
          🔄 Start New Session
        </button>
      </div>
    </div>
  );
};

export default FinalReport;
