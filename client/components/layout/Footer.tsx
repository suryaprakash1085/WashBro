import { Link } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { APP_CONFIG, NAV_LINKS } from '@/constants/config';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                <Droplets className="size-5" />
              </div>
              <span className="font-[Outfit] text-xl font-bold text-white">
                Fresh<span className="text-blue-400">Press</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Premium laundry service with free pickup & delivery. We handle your clothes with the care they deserve.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-[Outfit] text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-[Outfit] text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2.5">
              {['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Steam Press', 'Shoe Cleaning'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-slate-400 transition-colors hover:text-white">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-[Outfit] text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-400" />
                {APP_CONFIG.address}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="size-4 shrink-0 text-blue-400" />
                {APP_CONFIG.phone}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="size-4 shrink-0 text-blue-400" />
                {APP_CONFIG.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">© 2025 FreshPress. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
