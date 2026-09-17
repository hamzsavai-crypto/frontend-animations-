import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lab-faint)', marginBottom: 12 }}>404 · Not found</div>
        <h1>Lab bench empty</h1>
        <p>This page doesn’t exist. The router caught it client-side — no server round-trip.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/">Go home</Link>
          <Link className="btn btn-ghost" to="/simulations">Simulations</Link>
        </div>
      </div>
    </div>
  );
}
