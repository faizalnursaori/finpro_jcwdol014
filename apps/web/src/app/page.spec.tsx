import Home from './(main)/page';

describe('<Home />', () => {
  it('mounts', () => {
    cy.mount(<Home />);
  });
});
