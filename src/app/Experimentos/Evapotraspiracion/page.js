'use client';
import React from 'react';
import Link from "next/link";

const LluviaEscorrentia = () => {
  return (
    <div className="home">
      <h2>Evapotraspiracion</h2>
      <div className="buttons">
        <Link href="/blaney-criddle-global">
          <button>Blaney Criddle Global</button>
        </Link>
        <Link href="/blaney-criddle-parcial">
          <button>Blaney Criddle Parcial</button>
        </Link>
        <Link href="/blaney-criddle-parcial-perenne">
          <button>Blaney Criddle Parcial Perenne</button>
        </Link>
        <Link href="/hargreaves">
          <button>Hargreaves</button>
        </Link>
        <Link href="/penman">
          <button>Penman</button>
        </Link>
        <Link href="/thorwaite">
          <button>Thorwaite</button>
        </Link>
        <Link href="/turc">
          <button>Turc</button>
        </Link>
        <Link href="/balance-hidrico">
          <button>Balance hídrico</button>
        </Link>
      </div>
    </div>
  );
};

export default LluviaEscorrentia;
