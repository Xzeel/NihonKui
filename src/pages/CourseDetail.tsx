import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import {
  courseList, hiraganaBase, hiraganaDakuten, hiraganaYoon,
  katakanaBase, katakanaDakuten, katakanaYoon,
  kanjiList, vocabularyThemes, grammarList, specialChars,
  KanaItem,
} from '@/data/courses';

function KanaGrid({ items }: { items: KanaItem[] }) {
  const [selected, setSelected] = useState<KanaItem | null>(null);
  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {items.map((it, i) => (
          <motion.button
            key={it.char + i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(it)}
            className="aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-md transition-all"
          >
            <span className="font-jp text-3xl md:text-4xl font-bold">{it.char}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground mt-1">{it.romaji}</span>
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-3xl p-8 max-w-sm w-full text-center"
          >
            <div className="font-jp text-9xl font-bold text-primary mb-4">{selected.char}</div>
            <div className="text-2xl font-semibold mb-2">{selected.romaji}</div>
            {selected.example && <div className="text-muted-foreground">{selected.example}</div>}
            <button onClick={() => setSelected(null)} className="mt-6 px-4 py-2 rounded-xl bg-primary text-primary-foreground">Tutup</button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const course = courseList.find(c => c.id === id);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = JSON.parse(localStorage.getItem('nihonkui-progress') || '{}');
      raw[id] = { ...(raw[id] || {}), visited: true };
      localStorage.setItem('nihonkui-progress', JSON.stringify(raw));
    } catch {}
  }, [id]);

  if (!course) return <div className="container mx-auto p-12 text-center">Materi tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/courses" className="hover:text-primary">Materi</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{course.title}</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="font-jp text-7xl text-primary">{course.emoji}</div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-3">{course.description}</p>
            <Link to="/quiz" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              Latihan Soal Terkait <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>

      {id === 'hiragana' && (
        <div className="space-y-10">
          <section><h2 className="text-2xl font-bold mb-4">Gojuon (46 Karakter Dasar)</h2><KanaGrid items={hiraganaBase} /></section>
          <section><h2 className="text-2xl font-bold mb-4">Dakuten & Handakuten</h2><KanaGrid items={hiraganaDakuten} /></section>
          <section><h2 className="text-2xl font-bold mb-4">Yōon (Kombinasi)</h2><KanaGrid items={hiraganaYoon} /></section>
        </div>
      )}

      {id === 'katakana' && (
        <div className="space-y-10">
          <section><h2 className="text-2xl font-bold mb-4">Gojuon (46 Karakter Dasar)</h2><KanaGrid items={katakanaBase} /></section>
          <section><h2 className="text-2xl font-bold mb-4">Dakuten & Handakuten</h2><KanaGrid items={katakanaDakuten} /></section>
          <section><h2 className="text-2xl font-bold mb-4">Yōon (Kombinasi)</h2><KanaGrid items={katakanaYoon} /></section>
        </div>
      )}

      {id === 'kanji' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kanjiList.map((k, i) => (
            <motion.div
              key={k.kanji}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="font-jp text-6xl font-bold text-primary leading-none">{k.kanji}</span>
                <div className="flex-1 text-sm space-y-1">
                  <div className="font-bold text-base">{k.meaning}</div>
                  <div><span className="text-muted-foreground">On: </span><span className="font-jp">{k.onyomi}</span></div>
                  <div><span className="text-muted-foreground">Kun: </span><span className="font-jp">{k.kunyomi}</span></div>
                  <div className="text-xs text-muted-foreground">{k.strokes} coretan</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">{k.example}</div>
            </motion.div>
          ))}
        </div>
      )}

      {id === 'kosakata' && (
        <div className="space-y-8">
          {vocabularyThemes.map(t => (
            <section key={t.theme}>
              <h2 className="text-2xl font-bold mb-4">{t.theme}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {t.items.map((v, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4">
                    <div className="font-jp text-xl font-bold">{v.jp}</div>
                    <div className="text-xs text-muted-foreground mb-1">{v.romaji}</div>
                    <div className="text-sm">{v.meaning}</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {id === 'tatabahasa' && (
        <div className="space-y-4">
          {grammarList.map((g, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-baseline gap-3 flex-wrap mb-2">
                <h3 className="font-jp text-xl font-bold text-primary">{g.pattern}</h3>
                <span className="text-sm text-muted-foreground">— {g.meaning}</span>
              </div>
              <p className="text-sm mb-3">{g.explanation}</p>
              <div className="font-jp text-sm bg-muted rounded-xl p-3">{g.example}</div>
            </motion.div>
          ))}
        </div>
      )}

      {id === 'karakter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialChars.map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-2 text-primary">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
              <ul className="space-y-1 text-sm">
                {s.examples.map((e, j) => <li key={j} className="font-jp">• {e}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
