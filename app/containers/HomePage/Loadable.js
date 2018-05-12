/**
 * Asynchronously loads the component for HomePage
 */
import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';
import loader from './index';

export default Loadable({
  loader: () => () => loader,
  loading: LoadingIndicator,
});
