import LabNav from './LabNav';
import LabFooter from './LabFooter';
import './lab.css';
import './lab-pages.css';

export default function Layout({ children }) {
  return (
    <div className="lab-page">
      <LabNav />
      <main className="lab-main lab-fade">
        {children}
      </main>
      <LabFooter />
    </div>
  );
}
