import React from 'react';
import Header from '../../header/header';
import Menu from '../../menu/menu';

export function HomePage() {
  return (
    <div className='app'>
      <Header />
      <main className='main'>
        <Menu />
      </main>
    </div>
  );
}

export default HomePage;
