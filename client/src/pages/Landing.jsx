import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Decorative animated blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-3xl opacity-20"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 blur-3xl opacity-20"
        animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-3xl opacity-15"
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Icons.chat className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ConvoHub</span>
        </div>
        <Link
          to="/auth"
          className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Now Live - Join 1000+ Students
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Connect.
            </span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collaborate.
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Achieve More.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
            The ultimate communication platform for students. Real-time chat, assignments, grades, and collaboration - all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/auth"
                className="group px-8 py-4 rounded-2xl text-white font-semibold shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl transition-all duration-200 flex items-center gap-2"
              >
                Start Free Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 font-semibold text-slate-700 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '500K+', label: 'Messages Sent' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              stay connected
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed for modern student collaboration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '💬',
              title: 'Real-Time Chat',
              desc: 'Instant messaging with cohorts and direct messaging with peers. Never miss a conversation.',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: '📚',
              title: 'Assignment Hub',
              desc: 'Submit assignments, track deadlines, and receive grades all in one organized space.',
              gradient: 'from-indigo-500 to-purple-500',
            },
            {
              icon: '📊',
              title: 'Analytics Dashboard',
              desc: 'Track your progress, view performance metrics, and stay on top of your goals.',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: '📢',
              title: 'Notice Board',
              desc: 'Stay updated with important announcements and never miss critical information.',
              gradient: 'from-pink-500 to-rose-500',
            },
            {
              icon: '👥',
              title: 'Team Collaboration',
              desc: 'Work on projects together with built-in task management and team chat features.',
              gradient: 'from-orange-500 to-amber-500',
            },
            {
              icon: '🔔',
              title: 'Smart Notifications',
              desc: 'Get notified about grades, messages, and important updates in real-time.',
              gradient: 'from-green-500 to-emerald-500',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your
              <br />
              learning experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students already using ConvoHub to collaborate, communicate, and succeed together.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-indigo-600 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-200"
              >
                Get Started Free
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            <p className="text-blue-100 text-sm mt-6">
              No credit card required • Free forever for students
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icons.chat className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">ConvoHub</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
              <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 mt-8">
            © 2025 ConvoHub. Built with ❤️ for students everywhere.
          </div>
        </div>
      </footer>
    </main>
  );
}