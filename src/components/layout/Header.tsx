/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ChevronDown, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = () => {
    scrollToTop();
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const serviceSubItems = [
    {
      label: language === 'en' ? 'Business License' : 'تراخيص الأعمال',
      path: '/services/business-license',
      children: [
        { label: 'MISA', path: '/services/business-license/misa' },
        { label: 'MCI', path: '/services/business-license/mci' },
      ],
    },
    {
      label: language === 'en' ? 'Amendment Service' : 'خدمات التعديل',
      path: '/services/amendment',
      children: [
        { label: language === 'en' ? 'Activities' : 'الأنشطة', path: '/services/amendment/activities' },
        { label: language === 'en' ? 'Position' : 'المناصب', path: '/services/amendment/position' },
      ],
    },
    {
      label: language === 'en' ? 'Gov Service Solution' : 'حلول الخدمات الحكومية',
      path: '/services/gov-service',
      children: [
        {
          label: language === 'en' ? 'Immigration & Visa' : 'الهجرة والتأشيرات',
          path: '/services/gov-service/immigration',
          children: [
            { label: language === 'en' ? 'Golden Visa' : 'التأشيرة الذهبية', path: '/services/gov-service/immigration/golden' },
            { label: language === 'en' ? 'Residence Visa' : 'تأشيرة الإقامة', path: '/services/gov-service/immigration/residence' },
            { label: language === 'en' ? 'Working Visa' : 'تأشيرة العمل', path: '/services/gov-service/immigration/working' },
          ],
        },
        { label: language === 'en' ? 'VAT' : 'ضريبة القيمة المضافة', path: '/services/gov-service/vat' },
        { label: language === 'en' ? 'Tax & Zakat' : 'الضرائب والزكاة', path: '/services/gov-service/tax' },
        { label: language === 'en' ? 'Accounting Solution' : 'الحلول المحاسبية', path: '/services/gov-service/accounting' },
        { label: language === 'en' ? 'Qiwa Service' : 'خدمة قوى', path: '/services/gov-service/qiwa' },
        { label: language === 'en' ? 'Muqeem' : 'مقيم', path: '/services/gov-service/muqeem' },
        { label: language === 'en' ? 'National Address' : 'العنوان الوطني', path: '/services/gov-service/national-address' },
        { label: language === 'en' ? 'GOSI Service' : 'التأمينات الاجتماعية', path: '/services/gov-service/gosi' },
      ],
    },
    { label: language === 'en' ? 'AI / IT Solution' : 'حلول الذكاء الاصطناعي', path: '/services/ai-it' },
    { label: language === 'en' ? 'Design & Advertising' : 'التصميم والإعلان', path: '/services/design' },
    { label: language === 'en' ? 'Real Estate' : 'العقارات', path: '/services/real-estate' },
    { label: language === 'en' ? 'Travel & Tourism' : 'السياحة والسفر', path: '/services/travel' },
    { label: language === 'en' ? 'Manpower' : 'القوى العاملة', path: '/services/manpower' },
  ];

  const licenseSubItems = [
    { label: language === 'en' ? 'Trade License' : 'رخصة تجارية', path: '/business-license/trade' },
    { label: language === 'en' ? 'Service License' : 'رخصة خدمات', path: '/business-license/service' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Sauda Investment Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base md:text-lg text-foreground leading-tight">
                {language === 'en' ? 'Sauda Investment' : 'السعودي الاستثمار'}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === 'en' ? 'Consultant' : 'والمستشار'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  {t('nav.services')}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'end' : 'start'} className="w-56">
                {serviceSubItems.map((item) => (
                  item.children ? (
                    <DropdownMenuSub key={item.path}>
                      <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {item.children.map((child: any) => (
                          child.children ? (
                            <DropdownMenuSub key={child.path}>
                              <DropdownMenuSubTrigger>{child.label}</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {child.children.map((subChild: any) => (
                                  <DropdownMenuItem key={subChild.path} asChild>
                                    <Link to={subChild.path} onClick={handleNavClick}>{subChild.label}</Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ) : (
                            <DropdownMenuItem key={child.path} asChild>
                              <Link to={child.path} onClick={handleNavClick}>{child.label}</Link>
                            </DropdownMenuItem>
                          )
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ) : (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} onClick={handleNavClick}>{item.label}</Link>
                    </DropdownMenuItem>
                  )
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Business License Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  {t('nav.businessLicense')}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'end' : 'start'}>
                {licenseSubItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} onClick={handleNavClick}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex"
            >
              <Globe className="w-5 h-5" />
              <span className="sr-only">Toggle language</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* CTA Button */}
            <Button asChild className="hidden md:flex bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/appointment">{t('nav.appointment')}</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={cn(
                  'block py-2 text-base font-medium transition-colors',
                  isActive(link.path) ? 'text-accent' : 'text-foreground/70'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/services"
              onClick={handleNavClick}
              className="block py-2 text-base font-medium text-foreground/70"
            >
              {t('nav.services')}
            </Link>
            <Link
              to="/business-license"
              onClick={handleNavClick}
              className="block py-2 text-base font-medium text-foreground/70"
            >
              {t('nav.businessLicense')}
            </Link>

            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button asChild className="w-full bg-accent text-accent-foreground">
              <Link to="/appointment" onClick={handleNavClick}>
                {t('nav.appointment')}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
