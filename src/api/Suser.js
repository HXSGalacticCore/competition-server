import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}

export function apply(data) {
  return request({
    url: '/player/competition/regisCompetition',
    method: 'post',
    data
  })
}

export function stucompetition(data) {
  return request({
    url: '/player/competition/page',
    method: 'post',
    data
  })
}

export function uploadProject(data) {
  return request({
    url: '/player/competition/uploadProject',
    method: 'post',
    data
  })
}

export function checkScore(data) {
  return request({
    url: '/player/competition/checkScore',
    method: 'post',
    data
  })
}