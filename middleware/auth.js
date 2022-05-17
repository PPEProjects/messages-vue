export default ({ store, route, redirect }) => {
  if (store.getters['user/auth']) {
    if (route.path === '/auth') {
      redirect('/')
    }
  } else {
    redirect('/auth')
  }
}
