import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaBalanceScale,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <FaBalanceScale className="text-amber-500" size={28} />
              <h2 className="text-2xl font-bold text-white">
                Legal<span className="text-amber-500">Ease</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find & Hire Expert Legal Counsel from trusted professionals. Reliable legal services at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <Link key={link} href="#" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Follow Us</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Facebook', icon: FaFacebookF },
                { name: 'LinkedIn', icon: FaLinkedinIn },
                { name: 'Twitter', icon: FaTwitter },
              ].map((social) => (
                <a key={social.name} href="#" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  <social.icon size={16} /> {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
              <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 mt-16 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 LegalEase. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}