import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaHeart } from 'react-icons/fa'; 
import './App.css';

const HeartExplosion = () => {
  const hearts = Array.from({ length: 50 });
  return (
    <motion.div className="explosion-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="floating-icon"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            scale: [0, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, 0],
            rotate: (Math.random() - 0.5) * 45,
            x: (Math.random() - 0.5) * window.innerWidth * 1.5,
            y: (Math.random() - 0.5) * window.innerHeight * 1.5
          }}
          transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.4 }}
          style={{ position: 'absolute', color: '#6d4c41', fontSize: Math.random() * 40 + 20, top: '50%', left: '50%' }}
        >
          <FaHeart />
        </motion.div>
      ))}
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.5 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const audioRef = useRef(null);
  const targetDate = new Date('2026-11-06T19:30:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleOpen = () => {
    setShowExplosion(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log(e));
    }
    setTimeout(() => {
      setShowExplosion(false);
      setIsOpen(true);
    }, 2500); 
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log(e));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.currentTime >= 17) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="app" dir="rtl">
      
      <audio ref={audioRef} loop onTimeUpdate={handleTimeUpdate}>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {isOpen && (
        <motion.button className="music-btn" onClick={toggleMusic} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }}>
          {!isPlaying && <div className="play-icon"><FaPlay /></div>}
          <div className={`equalizer ${isPlaying ? 'playing' : ''}`}>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {!isOpen && !showExplosion ? (
          
          // ===== 1. شاشة الفتح (الكارت) =====
          <motion.div
            key="envelope"
            className="envelope-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            onClick={handleOpen}
          >
            <div className="invitation-card">
              <div className="card-content">
                <motion.div className="heart-circle" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                  <FaHeart />
                </motion.div>

                <motion.h1 className="card-names" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 1 }}>
                  خالد <br/><span className="card-amp">&</span><br/> منة
                </motion.h1>

                <motion.div className="card-divider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <span></span><FaHeart size={10} /><span></span>
                </motion.div>

                <motion.p className="card-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  6 نوفمبر 2026
                </motion.p>

                <motion.p className="card-invite-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  يتشرفان بدعوتكم
                </motion.p>

                <motion.button className="card-open-btn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.8 }}>
                  افتح الدعوة
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : showExplosion ? (
          <HeartExplosion key="explosion" />
        ) : (
          
          // ===== 2. الدعوة من جوه =====
          <motion.div
            key="invitation"
            className="invitation-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="invitation-inner">
              
              <motion.div className="section-header" variants={itemVariants}>
                <motion.h2 className="quran-verse" variants={itemVariants}>
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </motion.h2>
                <motion.p className="greeting-text" variants={itemVariants}>
                  لَحَظَاتُ السَّعَادَةِ طُرِّزَتْ لَهُمْ مَوْعِداً سَتُخَلِّدُهُ اللَّيَالِي
                  <br />
                  إِلَى كُلِّ غَالٍ وَمُحِبٍّ بِكُلِّ الْحُبِّ وَالْوُدِّ نَتَشَرَّفُ بِدَعْوَتِكُمْ
                  <br />
                  لِحُضُورِ حَفْلِ خِطْوَبَة
                </motion.p>
              </motion.div>

              <motion.div className="section-names" variants={itemVariants}>
                <motion.h1 className="big-name" variants={itemVariants}>خالد</motion.h1>
                <motion.span className="ampersand" variants={itemVariants}>و</motion.span>
                <motion.h1 className="big-name" variants={itemVariants}>منة</motion.h1>
              </motion.div>

              {/* ===== قسم الصورة (بره الـ Grid عشان الطول ميتقصش) ===== */}
              <motion.div 
                variants={itemVariants} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  width: '100%', 
                  margin: '20px 0 50px 0' 
                }}
              >
<div style={{ 
  width: '3000px',
  borderRadius: '15px',
  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
  overflow: 'hidden'
}}>
  <img 
    src="/photo1.jpg" 
    alt="صورة العروسين"
    style={{ 
      width: '100%',
      height: '1000',
      display: 'block'
    }} 
  />
</div>
              </motion.div>

              {/* ===== قسم التفاصيل والتقويم ===== */}
              <div className="content-grid">
                
                <motion.div className="section-details" variants={itemVariants}>
                  <motion.div className="detail-box" variants={itemVariants}><span className="detail-label">يوم</span><span className="detail-value">الجمعة</span></motion.div>
                  <motion.div className="detail-box" variants={itemVariants}><span className="detail-label">التاريخ</span><span className="detail-value">6 نوفمبر 2026</span></motion.div>
                  <motion.div className="detail-box" variants={itemVariants}><span className="detail-label">المكان</span><span className="detail-value">منزل العروسة</span></motion.div>
                </motion.div>

                <motion.div className="section-countdown" variants={itemVariants}>
                  <motion.div className="countdown-item" variants={itemVariants}><div className="num">{timeLeft.days}</div><div className="lbl">يوم</div></motion.div>
                  <motion.div className="countdown-item" variants={itemVariants}><div className="num">{timeLeft.hours}</div><div className="lbl">ساعة</div></motion.div>
                  <motion.div className="countdown-item" variants={itemVariants}><div className="num">{timeLeft.minutes}</div><div className="lbl">دقيقة</div></motion.div>
                  <motion.div className="countdown-item" variants={itemVariants}><div className="num">{timeLeft.seconds}</div><div className="lbl">ثانية</div></motion.div>
                </motion.div>

                <motion.div className="section-calendar" variants={itemVariants}>
                  <div className="calendar-card">
                    <div className="cal-ornament top"></div>
                    <h3 className="cal-title">نوفمبر 2026</h3>
                    <div className="cal-header">
                      <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
                    </div>
                    <div className="cal-grid">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                        <motion.div key={day} className={`cal-day ${day === 6 ? 'active' : ''}`} whileHover={{ scale: 1.2, backgroundColor: day === 6 ? '#b04a6d' : 'transparent' }}>
                          {day === 6 ? <FaHeart size={14} /> : day}
                        </motion.div>
                      ))}
                    </div>
                    <div className="cal-ornament bottom"></div>
                    <motion.button className="cal-btn" onClick={() => window.open('https://calendar.google.com', '_blank')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      أضف إلى التقويم
                    </motion.button>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;