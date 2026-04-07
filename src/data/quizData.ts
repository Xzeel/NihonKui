export type Level = 'pemula' | 'menengah' | 'lanjutan';

export interface Question {
  id: number;
  category: string;
  question: string;
  japanese: string;
  romaji?: string;
  correctAnswer: string;
  distractors: string[];
}

export const levelInfo: Record<Level, { title: string; subtitle: string; icon: string }> = {
  pemula: { title: 'Pemula', subtitle: 'Hiragana & Katakana', icon: '🌸' },
  menengah: { title: 'Menengah', subtitle: 'Kosakata', icon: '⛩️' },
  lanjutan: { title: 'Lanjutan', subtitle: 'Kanji', icon: '🏯' },
};

export const questions: Record<Level, Question[]> = {
  pemula: [
    { id: 1, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'あめ', romaji: 'ame', correctAnswer: 'Hujan', distractors: ['Angin', 'Api', 'Air'] },
    { id: 2, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'ねこ', romaji: 'neko', correctAnswer: 'Kucing', distractors: ['Anjing', 'Kelinci', 'Ikan'] },
    { id: 3, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'みず', romaji: 'mizu', correctAnswer: 'Air', distractors: ['Api', 'Tanah', 'Udara'] },
    { id: 4, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'たべる', romaji: 'taberu', correctAnswer: 'Makan', distractors: ['Minum', 'Tidur', 'Berlari'] },
    { id: 5, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'おはよう', romaji: 'ohayou', correctAnswer: 'Selamat pagi', distractors: ['Selamat malam', 'Terima kasih', 'Permisi'] },
    { id: 6, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'さくら', romaji: 'sakura', correctAnswer: 'Bunga sakura', distractors: ['Bunga mawar', 'Pohon', 'Musim semi'] },
    { id: 7, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'でんしゃ', romaji: 'densha', correctAnswer: 'Kereta', distractors: ['Mobil', 'Bus', 'Pesawat'] },
    { id: 8, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'がっこう', romaji: 'gakkou', correctAnswer: 'Sekolah', distractors: ['Rumah', 'Toko', 'Kantor'] },
    { id: 9, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'ともだち', romaji: 'tomodachi', correctAnswer: 'Teman', distractors: ['Musuh', 'Saudara', 'Guru'] },
    { id: 10, category: 'Hiragana', question: 'Apa arti kata ini?', japanese: 'しろい', romaji: 'shiroi', correctAnswer: 'Putih', distractors: ['Hitam', 'Merah', 'Biru'] },
  ],
  menengah: [
    { id: 1, category: 'Kosakata', question: 'Apa arti frasa ini?', japanese: 'ありがとうございます', romaji: 'arigatou gozaimasu', correctAnswer: 'Terima kasih (formal)', distractors: ['Maaf', 'Permisi', 'Selamat'] },
    { id: 2, category: 'Kosakata', question: "Kata apa yang berarti 'belajar'?", japanese: '？', correctAnswer: 'べんきょうする', distractors: ['はたらく', 'あそぶ', 'ねる'] },
    { id: 3, category: 'Kosakata', question: 'Apa arti kata ini?', japanese: 'むずかしい', romaji: 'muzukashii', correctAnswer: 'Sulit/Susah', distractors: ['Mudah', 'Menyenangkan', 'Menarik'] },
    { id: 4, category: 'Tata Bahasa', question: 'Apa arti kalimat ini?', japanese: 'どこですか', romaji: 'doko desu ka', correctAnswer: 'Di mana?', distractors: ['Siapa?', 'Kapan?', 'Berapa?'] },
    { id: 5, category: 'Kosakata', question: 'Apa arti kata ini?', japanese: 'たのしい', romaji: 'tanoshii', correctAnswer: 'Menyenangkan', distractors: ['Membosankan', 'Sedih', 'Takut'] },
    { id: 6, category: 'Kosakata', question: 'Apa lawan kata すきです?', japanese: 'すき ↔ ？', correctAnswer: 'きらいです', distractors: ['あいです', 'よいです', 'わるいです'] },
    { id: 7, category: 'Kosakata', question: 'Apa arti kata ini?', japanese: 'しごと', romaji: 'shigoto', correctAnswer: 'Pekerjaan/Kerja', distractors: ['Hobi', 'Liburan', 'Sekolah'] },
    { id: 8, category: 'Kosakata', question: 'Apa arti kata ini?', japanese: 'かぞく', romaji: 'kazoku', correctAnswer: 'Keluarga', distractors: ['Teman', 'Tetangga', 'Rekan kerja'] },
    { id: 9, category: 'Tata Bahasa', question: 'Apa arti kalimat ini?', japanese: 'いくらですか', romaji: 'ikura desu ka', correctAnswer: 'Berapa harganya?', distractors: ['Di mana ini?', 'Apa ini?', 'Siapa kamu?'] },
    { id: 10, category: 'Kosakata', question: 'Apa arti kata ini?', japanese: 'やすみ', romaji: 'yasumi', correctAnswer: 'Istirahat/Liburan', distractors: ['Kerja', 'Belajar', 'Olahraga'] },
  ],
  lanjutan: [
    { id: 1, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '山', romaji: 'yama', correctAnswer: 'Gunung', distractors: ['Laut', 'Sungai', 'Hutan'] },
    { id: 2, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '水', romaji: 'mizu', correctAnswer: 'Air', distractors: ['Api', 'Tanah', 'Angin'] },
    { id: 3, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '日本', romaji: 'nihon', correctAnswer: 'Jepang', distractors: ['China', 'Korea', 'Asia'] },
    { id: 4, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '食べる', romaji: 'taberu', correctAnswer: 'Makan', distractors: ['Minum', 'Memasak', 'Berbelanja'] },
    { id: 5, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '学校', romaji: 'gakkou', correctAnswer: 'Sekolah', distractors: ['Universitas', 'Kantor', 'Rumah sakit'] },
    { id: 6, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '電車', romaji: 'densha', correctAnswer: 'Kereta listrik', distractors: ['Mobil listrik', 'Bus', 'Kapal'] },
    { id: 7, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '友達', romaji: 'tomodachi', correctAnswer: 'Teman', distractors: ['Keluarga', 'Musuh', 'Guru'] },
    { id: 8, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '時間', romaji: 'jikan', correctAnswer: 'Waktu/Jam', distractors: ['Hari', 'Bulan', 'Tahun'] },
    { id: 9, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '仕事', romaji: 'shigoto', correctAnswer: 'Pekerjaan', distractors: ['Pendidikan', 'Hobi', 'Perjalanan'] },
    { id: 10, category: 'Kanji', question: 'Apa arti kanji ini?', japanese: '音楽', romaji: 'ongaku', correctAnswer: 'Musik', distractors: ['Seni', 'Olahraga', 'Film'] },
  ],
};
