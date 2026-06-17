import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="VA" className="h-12 mb-4" />
          <p className="text-gray-400 text-sm">
            Varun Aditya Admissions & Career Guidance — helping students reach top colleges.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {[['/', 'Home'], ['/colleges', 'Top Colleges'], ['/courses', 'Courses'], ['/apply', 'Apply Now']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gold mb-3">Programs</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Engineering', 'Medical', 'Management', 'Law', 'Design'].map((s) => (
              <li key={s}>
                <Link to={`/courses?stream=${s.toLowerCase()}`} className="hover:text-gold transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📧 info@varunaditya.in</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Chennai, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Varun Aditya Admissions & Career Guidance. All rights reserved.
      </div>
    </footer>
  )
}
