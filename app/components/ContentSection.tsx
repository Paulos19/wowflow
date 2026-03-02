"use client";

const services = [
    {
        icon: "⚡",
        title: "Automações Inteligentes",
        description:
            "Fluxos automatizados que conectam seus sistemas, eliminam tarefas repetitivas e aceleram seus processos em até 10x.",
    },
    {
        icon: "📊",
        title: "Dashboards Criativos",
        description:
            "Painéis visuais que transformam dados complexos em insights claros e acionáveis, com design que impressiona.",
    },
    {
        icon: "🔗",
        title: "Integração de Dados",
        description:
            "Conectamos todas as suas fontes de dados em um ecossistema unificado, fluido e em tempo real.",
    },
    {
        icon: "🚀",
        title: "Performance em Escala",
        description:
            "Infraestrutura robusta que cresce com você, mantendo velocidade e confiabilidade em qualquer volume.",
    },
];

export function ContentSection() {
    return (
        <section className="relative bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
                {/* Section header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 tracking-tight">
                        O futuro é <span className="text-indigo-600">agora</span>
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light leading-relaxed">
                        A wowflow é uma agência de automações e dashboards criativos, pronta para revolucionar a forma como você trabalha com dados.
                    </p>
                </div>

                {/* Service cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group relative bg-zinc-50 border border-zinc-100 rounded-2xl p-8 md:p-10 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-500 animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
                        >
                            <span className="text-3xl mb-4 block">{service.icon}</span>
                            <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-zinc-500 leading-relaxed font-light">
                                {service.description}
                            </p>
                            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
                    <a
                        href="#"
                        className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-900/30 hover:scale-105"
                    >
                        Comece sua revolução
                        <span className="text-xl">→</span>
                    </a>
                    <p className="text-zinc-400 text-sm mt-4 font-light">
                        Fale com a gente. Sem compromisso.
                    </p>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
