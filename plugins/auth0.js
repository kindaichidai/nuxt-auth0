import Auth0Lock from 'auth0-lock'
import jwtDecode from 'jwt-decode'
import queryString from 'query-string'

const config = {
  cliendID: 'YCauVJl5fPY1Cp3XUDGWxWSN2TOMQEdD',
  domain: 'nuxt-auth0-sample.auth0.com'
}

class Auth0Util {
  showLock(container) {
    const lock = new Auth0Lock(
      config.cliendID,
      config.domain,
      {
        container,
        closable: false,
        auth: {
          responseType: 'token id_token',
          redirectUrl: this.getBaseUrl() + '/callback',
          params: {
            scope: 'openid profile email'
          }
        }
      }
    )
    
    lock.show()
  }
  
  getBaseUrl() {
    return `${window.location.protocol}//${window.location.host}`
  }
  
  getQueryParams() {
    return queryString.parse(location.hash)
  }
  
  setToken({access_token, id_token, expires_in}) {
    const localStorage = window.localStorage
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('idToken', id_token)
    localStorage.setItem('expiresAt', expires_in * 1000 + new Date().getTime())
    localStorage.setItem('user', JSON.stringify(jwtDecode(id_token)))
  }
  
  setTokenByQuery() {
    this.setToken(this.getQueryParams());
  }
  
  isAuthenticated() {
    const expiresAt = window.localStorage.getItem('expiresAt')
    return new Date().getItem < expiresAt
  }
}

export default (context, inject) => {
  inject('auth0', new Auth0Util)
}