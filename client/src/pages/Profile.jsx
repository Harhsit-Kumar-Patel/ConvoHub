import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { getUser } from '../lib/auth.js';

export default function Profile() {
  const initial = useMemo(() => {
    const u = getUser() || {};
    return {
      name: u.name || '',
      email: u.email || '',
      program: u.program || '',
      batch: u.batch || '',
      avatar: u.avatar || '',
      bio: u.bio || '',
      skills: Array.isArray(u.skills) ? u.skills : [],
      links: {
        github: u.links?.github || '',
        linkedin: u.links?.linkedin || '',
        website: u.links?.website || '',
      },
    };
  }, []);

  const [form, setForm] = useState(initial);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(path, value) {
    setForm((f) => {
      const next = { ...f };
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] = { ...cur[parts[i]] };
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function addSkill() {
    const v = skillInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, skills: [...new Set([...(f.skills || []), v])] }));
    setSkillInput('');
  }

  function removeSkill(s) {
    setForm((f) => ({ ...f, skills: (f.skills || []).filter((x) => x !== s) }));
  }

  async function save() {
    setSaving(true);
    try {
      // Persist locally (no backend fields yet)
      const stored = getUser() || {};
      const updated = {
        ...stored,
        name: form.name,
        email: form.email,
        program: form.program,
        batch: form.batch,
        avatar: form.avatar,
        bio: form.bio,
        skills: form.skills,
        links: { ...form.links },
      };
      localStorage.setItem('convohub_user', JSON.stringify(updated));
    } finally {
      setSaving(false);
    }
  }

  function Avatar() {
    const url = form.avatar?.trim();
    const initials = (form.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div className="relative w-20 h-20 rounded-full overflow-hidden border shadow bg-white flex items-center justify-center text-slate-500">
        {url ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img src={url} alt="avatar image" className="w-full h-full object-cover" onError={() => updateField('avatar', '')} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="font-semibold">{initials}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="p-6 grid gap-5">
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-primary">Your Profile</h2>
        <p className="text-slate-600">Add an avatar, bio, skills, and update your info.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Left: Basic */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ y: -2 }}
          className="md:col-span-2 rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow"
        >
          <h3 className="font-semibold mb-3">Basic Info</h3>
          <div className="flex items-center gap-4 mb-4">
            <Avatar />
            <div className="flex-1 grid sm:grid-cols-2 gap-3 text-sm">
              <input className="p-3 rounded-lg border bg-white" placeholder="Name" value={form.name} onChange={(e)=>updateField('name', e.target.value)} />
              <input className="p-3 rounded-lg border bg-white" placeholder="Email" value={form.email} onChange={(e)=>updateField('email', e.target.value)} />
              <input className="p-3 rounded-lg border bg-white" placeholder="Program" value={form.program} onChange={(e)=>updateField('program', e.target.value)} />
              <input className="p-3 rounded-lg border bg-white" placeholder="Batch" value={form.batch} onChange={(e)=>updateField('batch', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3">
            <input className="p-3 rounded-lg border bg-white" placeholder="Avatar URL" value={form.avatar} onChange={(e)=>updateField('avatar', e.target.value)} />
            <textarea rows={4} className="p-3 rounded-lg border bg-white" placeholder="Short bio" value={form.bio} onChange={(e)=>updateField('bio', e.target.value)} />
          </div>
        </motion.div>

        {/* Right: Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow"
        >
          <h3 className="font-semibold mb-2">Links</h3>
          <div className="grid gap-3 text-sm">
            <input className="p-3 rounded-lg border bg-white" placeholder="GitHub URL" value={form.links.github} onChange={(e)=>updateField('links.github', e.target.value)} />
            <input className="p-3 rounded-lg border bg-white" placeholder="LinkedIn URL" value={form.links.linkedin} onChange={(e)=>updateField('links.linkedin', e.target.value)} />
            <input className="p-3 rounded-lg border bg-white" placeholder="Website URL" value={form.links.website} onChange={(e)=>updateField('links.website', e.target.value)} />
          </div>
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Skills</h3>
          <div className="flex gap-2">
            <input className="px-3 py-2 rounded-lg border bg-white text-sm" placeholder="Add a skill" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addSkill(); } }} />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={addSkill} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Add</motion.button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.skills || []).map((s) => (
            <span key={s} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-primary/10 to-accent/10 border">
              {s}
              <button onClick={() => removeSkill(s)} className="text-slate-500 hover:text-slate-700">×</button>
            </span>
          ))}
          {(!form.skills || form.skills.length === 0) && (
            <span className="text-sm text-slate-500">No skills added yet.</span>
          )}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-slate-900 text-white shadow disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </motion.button>
      </div>
    </section>
  );
}
