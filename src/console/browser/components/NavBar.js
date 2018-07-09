import NavBarItem from './NavBarItem';
import colors from '../colors';
import React from 'react';

export default function NavBar({ workflows, database, me, onLogout }) {
  return (
    <div className="nav-bar">
      <div className="top">
        <NavBarItem
          to="/"
          exact
          title={database.name}
          icon={database.thumbnailIcon}
          imageURL={database.thumbnailURL}
        />
        {workflows.map((w, i) => (
          <NavBarItem
            key={i}
            to={{
              pathname: `/workflows/${w.id}`
            }}
            imageURL={w.thumbnailURL}
            icon={w.thumbnailIcon}
            title={w.name}
          />
        ))}
        <NavBarItem to="/v1/graphql" icon="world" title="GraphQL Explorer" />
        <NavBarItem to="/docs" icon="docs" title="Documentation" />
      </div>
      <div className="bottom">
        <NavBarItem
          to="/settings"
          icon={me.thumbnailIcon}
          imageURL={me.thumbnailURL}
          title={me.preferredName}
        />
        <NavBarItem
          to="/login"
          icon="logout"
          title="Logout"
          onClick={onLogout}
        />
      </div>
      <style jsx>{`
        .nav-bar {
          position: fixed;
          z-index: 1000;
          width: 70px;
          overflow-x: visible;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: ${colors.black};
          justify-content: space-between;
        }

        .top {
          flex: auto;
        }

        .bottom {
          flex: none;
        }
      `}</style>
    </div>
  );
}
