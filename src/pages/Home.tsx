import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { courseList } from '@/data/courses';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  return (
    <div className="bg-seigaiha">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06, y: [0, -20, 0] }}
          transition={{ y: { duration: 6, repeat: Infinity }, opacity: { duration: 1 } }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="font-jp text-[18rem] md:text-[24rem] font-black text-primary leading-none">日本語</span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center max-w-4xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} /> Belajar Bahasa Jepang Interaktif
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Kuasai Bahasa Jepang,<br />
            <span className="text-primary">Satu Soal Setiap Hari</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            NihonKui membantu kamu belajar Hiragana, Katakana, Kanji, kosakata, dan tata bahasa lewat kuis seru dan materi terstruktur.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link to="/quiz" className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              Mulai Kuis Sekarang <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="bg-card border border-border px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform">
              Lihat Materi
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '150+', label: 'Soal Latihan' },
            { num: '3', label: 'Level Kesulitan' },
            { num: '6', label: 'Kategori Materi' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 text-center"
            >
              <div className="text-5xl font-bold text-primary mb-2">{s.num}</div>
              <div className="text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FITUR */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Kenapa NihonKui?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'Kuis Interaktif', desc: 'Latih kemampuan dengan 150+ soal yang diacak setiap sesi.' },
            { icon: BookOpen, title: 'Materi Lengkap', desc: 'Hiragana, Katakana, Kanji, Kosakata, dan Tata Bahasa.' },
            { icon: TrendingUp, title: 'Progress Skor', desc: 'Lacak progres dengan high score & pencapaian per level.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* KATEGORI MATERI PREVIEW */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Kategori Materi</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courseList.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/courses/${c.id}`}
                className="block bg-card border border-border rounded-3xl p-6 text-center hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="font-jp text-6xl text-primary/80 group-hover:scale-110 transition-transform mb-3">{c.emoji}</div>
                <div className="font-bold mb-1">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.count}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Menguji Kemampuanmu?</h2>
          <p className="mb-8 opacity-90">Mulai kuis sekarang dan lihat sejauh mana bahasa Jepangmu!</p>
          <Link to="/quiz" className="inline-block bg-background text-primary px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform animate-pulse">
            Mulai Sekarang
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
