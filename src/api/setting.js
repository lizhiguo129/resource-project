import request from '@/utils/request'
// 所有角色列表  是 get 请求 用 params 传参
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 定义获取公司的信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 编辑更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

