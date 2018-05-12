/**
 *
 * Asynchronously loads the component for SignUpPage
 *
 */

import Loadable from 'react-loadable';
import loader from './index';

export default Loadable({
  loader: () => loader,
  loading: () => null,
});
