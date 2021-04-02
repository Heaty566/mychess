// eslint-disable react/jsx-props-no-spreading
import React, { FunctionComponent } from 'react';
import '../styles/tailwind.css';

export interface AppProps {}

const App: FunctionComponent<AppProps> = () => (
  <h1 className="bg-blue-500">111</h1>
);
export default App;
