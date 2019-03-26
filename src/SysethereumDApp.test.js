import React from 'react';
import ReactDOM from 'react-dom';
import SysethereumDApp from './SysethereumDApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SysethereumDApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
