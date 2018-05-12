import React from 'react';

import NavBar from '../../containers/NavBar';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <NavBar />
      </div>
    );
  }
}

export default Header;
