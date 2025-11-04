import { createFragmentRegistry, InMemoryCache } from '@apollo/client/cache';

const APOLLO_CACHE = new InMemoryCache({
  fragments: createFragmentRegistry(
    // put all fragments here
  ),
});

export {
  APOLLO_CACHE,
};
