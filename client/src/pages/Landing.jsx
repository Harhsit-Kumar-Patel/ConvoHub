import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="relative overflow-hidden px-6 py-20">
      {/* Decorative animated blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary blur-3xl opacity-30"
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-accent blur-3xl opacity-30"
        animate={{ scale: [1, 1.05, 1], x: [0, -15, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            Connect. Collaborate. ConvoHub.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="max-w-2xl mx-auto text-lg text-slate-600 mb-10"
        >
          A colorful, modern platform for student communication. Join cohorts, chat 1:1, read notices, and share feedback — all in one lively dashboard.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth"
              className="px-6 py-3 rounded-xl text-white shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-95"
            >
              Login / Signup
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-white/80 backdrop-blur border border-white/60 shadow hover:bg-white"
            >
              Explore Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-14">
          {[{
            title: 'Cohorts',
            desc: 'Join your batch and collaborate in real-time.',
          }, {
            title: '1:1 Chat',
            desc: 'Direct messaging with peers and mentors.',
          }, {
            title: 'Notices',
            desc: 'Stay updated with the latest announcements.',
          }].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 text-left shadow"
            >
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-slate-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
