import { browserHistory, createMemoryHistory } from 'react-router';

const history = process.env.BROWSER ? browserHistory : createMemoryHistory();

export default history;
