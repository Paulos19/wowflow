"use client";

import { SplineScene } from "./SplineScene";

const SPLINE_URL = "https://prod.spline.design/QtVEkK6ggU7j75gL/scene.splinecode";

const services = [
    {
        icon: "⚡",
        label: "AUTOMAÇÃO",
        title: "Fluxos que trabalham por você",
        description:
            "Conectamos seus sistemas e eliminamos tarefas repetitivas. Mais eficiência, menos esforço manual. Resultados em tempo real.",
        gradient: "from-amber-500 to-orange-600",
        glow: "group-hover:shadow-amber-500/20",
    },
    {
        icon: "📊",
        label: "DASHBOARDS",
        title: "Dados que contam histórias",
        description:
            "Painéis visuais que transformam números complexos em insights claros e acionáveis. Design que impressiona, dados que decidem.",
        gradient: "from-indigo-500 to-violet-600",
        glow: "group-hover:shadow-indigo-500/20",
    },
    {
        icon: "🔗",
        label: "INTEGRAÇÃO",
        title: "Um ecossistema unificado",
        description:
            "Todas as suas fontes de dados conectadas em um fluxo contínuo. Sem silos, sem barreiras. Informação livre e em tempo real.",
        gradient: "from-emerald-500 to-teal-600",
        glow: "group-hover:shadow-emerald-500/20",
    },
    {
        icon: "🚀",
        label: "PERFORMANCE",
        title: "Escala sem compromisso",
        description:
            "Infraestrutura que cresce com você. Velocidade e confiabilidade mantidas em qualquer volume de operação.",
        gradient: "from-rose-500 to-pink-600",
        glow: "group-hover:shadow-rose-500/20",
    },
];

export function ContentSection() {
    return (
        <section className="relative bg-zinc-950 overflow-hidden">

            {/* ── TOP GRADIENT: seamless entry from WhiteOverlay → dark ── */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#09090b] to-transparent z-10 pointer-events-none" />

            {/* ── Ambient glows ──────────────────────────────────────── */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* ── MAIN LAYOUT: Cards + 3D Side-by-Side ──────────────── */}
            <div className="relative flex flex-col lg:flex-row min-h-screen">

                {/* ─── LEFT: Text Content & Cards ─────────────────────── */}
                <div className="relative z-20 w-full lg:w-[55%] px-6 md:px-12 lg:px-16 xl:px-20 py-24 md:py-32 flex flex-col justify-center">

                    {/* Section header */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-6">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            <span className="text-indigo-300 text-xs font-medium uppercase tracking-[0.2em]">
                                O que fazemos
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                            Transformamos{" "}
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                complexidade
                            </span>
                            <br />
                            em clareza.
                        </h2>
                        <p className="text-zinc-400 text-lg md:text-xl mt-6 max-w-xl font-light leading-relaxed">
                            Automações e dashboards que transformam caos em insights, processos em fluxos, e dados em decisões.
                        </p>
                    </div>

                    {/* Service cards — 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className={`group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 transition-all duration-500 hover:bg-zinc-900/80 hover:border-zinc-700/60 hover:scale-[1.02] hover:shadow-2xl ${service.glow} cursor-default`}
                            >
                                {/* Top accent bar */}
                                <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">{service.icon}</span>
                                        <span className={`text-[10px] font-bold tracking-[0.3em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                                            {service.label}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2 tracking-tight leading-snug">
                                        {service.title}
                                    </h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed font-light">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <a
                            href="#"
                            className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-[0_8px_40px_rgba(99,102,241,0.35)] hover:scale-105"
                        >
                            Comece sua revolução
                            <span className="text-lg transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                        </a>
                        <span className="text-zinc-600 text-sm font-light">
                            Fale com a gente. Sem compromisso.
                        </span>
                    </div>
                </div>

                {/* ─── RIGHT: Spline 3D Scene ─────────────────────────── */}
                <div className="relative w-full lg:w-[45%] min-h-[500px] lg:min-h-screen order-first lg:order-last">

                    {/* Blending gradients */}
                    <div className="absolute inset-0 z-10 pointer-events-none lg:bg-gradient-to-r lg:from-zinc-950/80 lg:via-transparent lg:to-transparent" />
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950/60 lg:from-zinc-950/30 lg:via-transparent lg:to-zinc-950/30" />

                    {/* Spline 3D container */}
                    <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
                        <SplineScene
                            scene={SPLINE_URL}
                            className="w-full h-full"
                        />
                    </div>

                    {/* Ambient glow behind model */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
