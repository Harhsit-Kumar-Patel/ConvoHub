import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { getUser } from '../lib/auth.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

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

  function Avatar({ size = '20' }) {
    const url = form.avatar?.trim();
    const initials = (form.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div className={`relative w-${size} h-${size} rounded-full overflow-hidden border-2 border-background shadow-md bg-muted flex items-center justify-center text-muted-foreground`}>
        {url ? (
          <img src={url} alt="avatar image" className="w-full h-full object-cover" onError={() => updateField('avatar', '')} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <span className="font-semibold text-lg">{initials}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="p-6 grid gap-6">
      <div>
        <h2 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Your Profile</h2>
        <p className="text-muted-foreground">Add an avatar, bio, skills, and update your info.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar />
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold text-lg truncate">{form.name || 'Unnamed User'}</h3>
                {Boolean(form.email && /@(.+)$/.test(form.email)) && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{form.email || 'No email provided'}</p>
            </div>
          </div>
          {(form.program || form.batch) && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              {form.program && <span className="px-2 py-1 rounded-lg border bg-background">{form.program}</span>}
              {form.batch && <span className="px-2 py-1 rounded-lg border bg-background">Batch {form.batch}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="shadow-sm">
            <CardHeader><h3 className="font-semibold">Basic Information</h3></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar size="24" />
                <div className="flex-1 space-y-3 text-sm">
                  <input aria-label="Avatar URL" className="p-3 w-full rounded-lg border bg-background" placeholder="Avatar URL" value={form.avatar} onChange={(e) => updateField('avatar', e.target.value)} />
                  <textarea aria-label="Short bio" rows={3} className="p-3 w-full rounded-lg border bg-background" placeholder="Short bio" value={form.bio} onChange={(e) => updateField('bio', e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <input aria-label="Name" className="p-3 rounded-lg border bg-background" placeholder="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                <input aria-label="Email" className="p-3 rounded-lg border bg-background" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                <input aria-label="Program" className="p-3 rounded-lg border bg-background" placeholder="Program (e.g., Computer Science)" value={form.program} onChange={(e) => updateField('program', e.target.value)} />
                <input aria-label="Batch" className="p-3 rounded-lg border bg-background" placeholder="Batch (e.g., 2025)" value={form.batch} onChange={(e) => updateField('batch', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card className="shadow-sm">
            <CardHeader><h3 className="font-semibold">Professional Links</h3></CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <input aria-label="GitHub URL" className="p-3 rounded-lg border bg-background" placeholder="GitHub URL" value={form.links.github} onChange={(e) => updateField('links.github', e.target.value)} />
              <input aria-label="LinkedIn URL" className="p-3 rounded-lg border bg-background" placeholder="LinkedIn URL" value={form.links.linkedin} onChange={(e) => updateField('links.linkedin', e.target.value)} />
              <input aria-label="Website URL" className="p-3 rounded-lg border bg-background" placeholder="Personal Website/Portfolio URL" value={form.links.website} onChange={(e) => updateField('links.website', e.target.value)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Skills</h3>
                <div className="flex gap-2">
                  <input aria-label="Add a skill" className="px-3 py-2 rounded-lg border bg-background text-sm w-48" placeholder="Add a skill (e.g., React)" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                  <Button onClick={addSkill}>Add</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(form.skills || []).map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground border">
                    {s}
                    <button aria-label={`Remove ${s}`} onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-foreground">×</button>
                  </span>
                ))}
                {(!form.skills || form.skills.length === 0) && (
                  <span className="text-sm text-muted-foreground">No skills added yet.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </section>
  );
}