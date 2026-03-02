"use client";

export function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <h3 className="text-2xl font-black text-white tracking-tighter">
                            wowflow
                        </h3>
                        <p className="text-zinc-500 text-sm font-light">
                            Automações & Dashboards Criativos
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8 text-sm">
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">
                            Sobre
                        </a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">
                            Serviços
                        </a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">
                            Contato
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-800/50 my-8" />

                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
                    <p>© {new Date().getFullYear()} wowflow. Todos os direitos reservados.</p>
                    <p className="font-light">Feito com paixão por inovação.</p>
                </div>
            </div>
        </footer>
    );
}
