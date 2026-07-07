import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Apple, Monitor, Box, Zap, Layers, Download, ChevronDown, CheckCircle2, Rotate3D, ArrowUp } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import React from 'react';

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md bg-black/10 border-b border-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
          <Box className="w-6 h-6 text-brand" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-display font-bold tracking-widest text-white">TRIPO ORBIT</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand text-black tracking-widest mt-0.5">BETA</span>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 30 });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
      <div className="text-center max-w-4xl mx-auto z-10 mt-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-brand mb-8 border-brand/20 shadow-[0_0_20px_rgba(249,207,0,0.1)]"
        >
          <Rotate3D className="w-4 h-4" />
          <span>全新一代 3D 查看引擎</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
        >
          探索 3D 视界，<br />
          <span className="text-brand glow-text">毫秒间呈现</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Tripo Orbit 为极致性能而生。简约、纯粹，释放无尽的创造力。<br/>全格式兼容，双端原生优化，带来前所未有的丝滑交互。
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand text-black px-8 py-4 rounded-full font-semibold hover:bg-[#ffe54d] hover:shadow-[0_0_30px_rgba(249,207,0,0.3)] transition-all duration-300">
            <Apple className="w-5 h-5" />
            <span>Mac 版下载</span>
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 glass-panel text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:!shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-300">
            <Monitor className="w-5 h-5" />
            <span>Windows 版下载</span>
          </button>
        </motion.div>
      </div>

      {/* Interactive Parallax Viewer */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        style={{ perspective: 1200 }} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave} 
        className="w-full max-w-5xl mx-auto mt-20 z-10 hidden md:block"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full aspect-video glass-panel rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group"
        >
          {/* Grid Background inside viewer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <motion.div
            style={{ transform: "translateZ(80px)" }}
            className="relative z-10"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotateY: 360, rotateX: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                <Box className="w-32 h-32 text-brand opacity-80 drop-shadow-[0_0_40px_rgba(249,207,0,0.4)]" strokeWidth={0.5} />
              </motion.div>
              <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full pointer-events-none"></div>
            </div>
          </motion.div>

          {/* HUD Elements */}
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            className="absolute top-6 left-6 text-xs font-mono text-white/40 space-y-1"
          >
            <p>VIEWPORT // PRIMARY</p>
            <p className="text-brand">RENDER // ACTIVE</p>
          </motion.div>
          
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            className="absolute bottom-6 left-6 flex items-center gap-8 text-xs font-mono text-white/50"
          >
            <div className="flex flex-col">
              <span className="text-white/30">VERTICES</span>
              <span className="text-white">1,245,031</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/30">FACES</span>
              <span className="text-white">2,490,012</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/30">FPS</span>
              <span className="text-brand font-bold text-lg glow-text">144</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/30 animate-bounce"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

function DynamicFeatures() {
  const features = [
    {
      title: "毫秒级极速渲染",
      description: "自研超高性能渲染引擎，千万级面数模型瞬间加载，丝滑拖拽无卡顿，带来极致流畅的视觉享受。",
      tag: "PERFORMANCE",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-brand/30 border-t-brand border-r-transparent flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-brand/20 border-b-brand border-l-transparent"
            ></motion.div>
          </motion.div>
          <div className="absolute text-5xl md:text-7xl font-display font-bold text-white italic tracking-tighter">
            2<span className="text-3xl md:text-4xl text-brand">ms</span>
          </div>
        </div>
      )
    },
    {
      title: "全格式与多端无缝兼容",
      description: "原生支持 GLTF, FBX, OBJ, STL 等十余种主流 3D 格式。为 Windows 与 macOS 深度定制优化，随时随地提供一致的极致体验。",
      tag: "COMPATIBILITY",
      visual: (
        <div className="flex flex-col items-center justify-center gap-10 w-full px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['OBJ', 'FBX', 'GLTF', 'STL', 'USDZ'].map((f, i) => (
              <motion.div 
                key={f} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-5 py-2.5 rounded-xl glass-panel text-lg font-mono text-white/80 border border-white/20"
              >
                {f}
              </motion.div>
            ))}
          </div>
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center gap-10 text-white/30">
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Apple className="w-12 h-12 text-white/80" />
            </motion.div>
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <Monitor className="w-12 h-12 text-white/80" />
            </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "可调 API 动态生成模型",
      description: "内置大模型 API 接口支持，可通过文字指令一键动态生成 3D 资产，无缝衔接至渲染管线，拓展创意边界。",
      tag: "AI GENERATION",
      visual: (
        <div className="w-full max-w-sm mx-auto flex flex-col p-6 glass-panel rounded-2xl border border-white/10 shadow-2xl bg-black/40">
          <div className="flex gap-2 items-center border-b border-white/10 pb-4 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            <span className="text-[10px] font-mono text-white/30 ml-2 tracking-widest">tripo_api.json</span>
          </div>
          <div className="font-mono text-sm text-white/60 space-y-1.5">
            <p><span className="text-brand">POST</span> /v1/models/generate</p>
            <p className="text-white/30">{`{`}</p>
            <p className="pl-4">"prompt": <span className="text-green-400/80">"futuristic spaceship"</span>,</p>
            <p className="pl-4">"format": <span className="text-green-400/80">"glb"</span></p>
            <p className="text-white/30">{`}`}</p>
          </div>
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-brand text-xs font-mono uppercase tracking-widest"
          >
            <Zap className="w-3.5 h-3.5" />
            Generating 3D mesh...
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <section className="py-24 relative z-10 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">重塑 3D 交互范式</h2>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">强大的底层性能与优雅的极简设计交织，让每一次模型探视都成为沉浸式的视觉享受。</p>
        </motion.div>

        <div className="space-y-0">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 py-16"
            >
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-200px" }}
                transition={{ duration: 0.6 }}
                className={`w-full md:w-1/2 flex flex-col justify-center text-center md:text-left ${idx % 2 === 1 ? 'md:order-2' : ''}`}
              >
                <div className="inline-flex items-center justify-center md:justify-start gap-2 text-brand font-mono text-sm mb-6 uppercase tracking-widest">
                  <span className="w-8 h-px bg-brand"></span>
                  {feature.tag}
                </div>
                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-lg md:text-2xl font-light">{feature.description}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-200px" }}
                transition={{ duration: 0.6 }}
                className={`w-full md:w-1/2 h-[50vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] glass-panel border border-white/10 flex items-center justify-center bg-black/50 shadow-2xl overflow-hidden relative ${idx % 2 === 1 ? 'md:order-1' : ''}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,207,0,0.05)_0%,transparent_70%)]"></div>
                {feature.visual}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Box className="w-6 h-6 text-brand" />
          <span className="text-lg font-display font-bold tracking-widest text-white">TRIPO ORBIT</span>
        </div>
        <p className="text-white/40 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Tripo Orbit. All rights reserved. 
        </p>
        <div className="flex gap-6">
          <button className="text-white/40 hover:text-white text-sm transition-colors">Twitter</button>
          <button className="text-white/40 hover:text-white text-sm transition-colors">GitHub</button>
          <button className="text-white/40 hover:text-white text-sm transition-colors">Discord</button>
        </div>
      </div>
    </footer>
  );
}

function DownloadCTA() {
  return (
    <section className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center text-center px-6 border-t border-white/5 bg-black/20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-white">准备好体验未来了吗？</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300">
            <Download className="w-5 h-5" />
            <span>免费下载</span>
          </button>
        </div>
        <p className="mt-8 text-white/40 text-sm">Beta 测试版已开放，欢迎免费使用。</p>
      </motion.div>
    </section>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white transition-all duration-300 group shadow-lg border border-white/20"
          aria-label="回到顶部"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="min-h-screen relative font-sans text-white">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,207,0,0.06)_0%,transparent_60%)] pointer-events-none"></div>
      <ParticleBackground />
      <Navbar />
      <Hero />
      <DynamicFeatures />
      <DownloadCTA />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
