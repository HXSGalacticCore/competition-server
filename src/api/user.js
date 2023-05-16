import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/player/user/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/player/user/registry',
    method: 'post',
    data
  })
}

export function getEmailCode(email) {
  return request({
    url: '/email/resetPwd',
    method: 'get',
    params: { email }
  })
}

export function validCode(email,code) {
  return request({
    url: '/email/validCode',
    method: 'get',
    params: { email,code}
  })
}

export function getfile(data) {
  return request({
    url: '/file/download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getInfo(data) {
  return request({
    url: '/player/user/info',
    method: 'post',
    data
  })
}

export function getcompetition(data) {
  return request({
    url: '/competition/page',
    method: 'post',
    data
  })
}

export function apply(data) {
  return request({
    url: '/judge/apply',
    method: 'post',
    data
  })
}

export function judgepage(data) {
  return request({
    url: '/judge/page',
    method: 'post',
    data
  })
}

export function competitionlist(data) {
  return request({
    url: '/player/competition/list',
    method: 'post',
    data
  })
}

export function grade(data) {
  return request({
    url: '/player/competition/scoring',
    method: 'post',
    data
  })
}

export function competitioninfo(data) {
  return request({
    url: '/player/competition/info',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
