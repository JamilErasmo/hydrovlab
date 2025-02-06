import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const LluviaEscorrentia = () => {
  return (
    <div className="home">
      <h2>Evapotraspiracion</h2>
      <div className="buttons">
        <Link to="/blaney-criddle-global">
          <button>Blaney Criddle Global</button>
        </Link>
        <Link to="/blaney-criddle-parcial">
          <button>Blaney Criddle Parcial</button>
        </Link>
        <Link to="/blaney-criddle-parcial-perenne">
          <button>Blaney Criddle Parcial Perenne</button>
        </Link>
        <Link to="/hargreaves">
          <button>Hargreaves</button>
        </Link>
        <Link to="/penman">
          <button>Penman</button>
        </Link>
        <Link to="/thorwaite">
          <button>Thorwaite</button>
        </Link>
        <Link to="/turc">
          <button>Turc</button>
        </Link>
        <Link to="/balance-hidrico">
          <button>Balance hídrico</button>
        </Link>
      </div>
    </div>
  );
};

export default LluviaEscorrentia;
