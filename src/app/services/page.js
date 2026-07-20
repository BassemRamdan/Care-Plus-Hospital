import Link from 'next/link';

export default function Services() {
  const services = [
    { title: 'Emergency Care', desc: '24/7 emergency medical services with rapid response times.', icon: '🚑' },
    { title: 'Surgery', desc: 'Advanced surgical procedures with state-of-the-art equipment.', icon: '🔪' },
    { title: 'Pediatrics', desc: 'Specialized healthcare for children and infants.', icon: '👶' },
    { title: 'Cardiology', desc: 'Comprehensive heart care and cardiovascular surgeries.', icon: '❤️' },
    { title: 'Neurology', desc: 'Expert diagnosis and treatment of brain and nervous system disorders.', icon: '🧠' },
    { title: 'Laboratory', desc: 'Fast and accurate medical testing and analysis.', icon: '🔬' }
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Medical Services</h1>
        <p>Providing world-class healthcare solutions for you and your family</p>
      </header>

      <div className="content-section">
        <div className="grid-list">
          {services.map((svc, i) => (
            <div key={i} className="card service-card">
              <div className="card-icon" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{svc.icon}</div>
              <h3>{svc.title}</h3>
              <p className="sub-text">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
