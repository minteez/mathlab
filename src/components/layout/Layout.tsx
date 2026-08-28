import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noFooter?: boolean;
}

export default function Layout({ children, fullWidth, noFooter }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-lab-bg">
      <Navigation />
      <main className={`flex-1 pt-16 ${fullWidth ? '' : ''}`}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
