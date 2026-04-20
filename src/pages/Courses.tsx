import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { courseList } from '@/data/courses';

const filters = ['Semua', 'Pemula', 'Menengah', 'Lanjutan'];

export default function Courses() {
  const [active, setActive] = useState('Semua');
  const filtered = active === 'Semua' ? courseList : courseList.filter(c => c.level === active);

  const getProgress = (id: string): boolean => {
    try { return !!JSON.parse(localStorage.getItem('nihonkui-progress') || '{}')[id]?.visited; }
    catch { return false; }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Materi Belajar</h1>
        <p className="text-muted-foreground mb-8">Pelajari bahasa Jepang dari nol dengan materi terstruktur.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to={`/courses/${c.id}`}
              className="block bg-card border border-border rounded-3xl p-6 hover:border-primary hover:shadow-lg transition-all h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="font-jp text-5xl text-primary">{c.emoji}</div>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground">{c.level}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{c.count}</span>
                {getProgress(c.id) && <span className="text-success font-semibold">✓ Dikunjungi</span>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
