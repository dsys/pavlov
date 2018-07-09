import React from 'react';
import SectionHeader from './SectionHeader';
import Spinner from './Spinner';
import colors from '../colors';

export default function ContextCard({ title, loading, children }) {
  return (
    <div className="card">
      {title && <SectionHeader title={title} style={{ marginTop: 0 }} />}
      {loading ? <Spinner /> : children}
      <style jsx>{`
        .card {
          height: 80%;
          padding: 20px;
        }
        .card + .card {
          border-top: 1px solid ${colors.gray2};
        }
      `}</style>
    </div>
  );
}
