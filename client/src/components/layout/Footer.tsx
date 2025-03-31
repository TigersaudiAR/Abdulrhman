import { APP_CONFIG } from '../../lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400 mt-6 text-sm border-t border-gray-200 dark:border-gray-700">
      <div>© {currentYear} {APP_CONFIG.copyright.owner}</div>
      <div className="mt-1">{APP_CONFIG.copyright.rights}</div>
      <div className="mt-2 flex justify-center gap-4">
        <span><i className="fas fa-phone me-1"></i> {APP_CONFIG.copyright.phone}</span>
        <span><i className="fas fa-envelope me-1"></i> {APP_CONFIG.copyright.email}</span>
      </div>
    </footer>
  );
};

export default Footer;
