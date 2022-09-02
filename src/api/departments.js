import request from '@/utils/request'
// 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 封装删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
// 新增部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
// 获取单独的部门信息
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 编辑部门的接口
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
