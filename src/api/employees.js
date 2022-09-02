import request from '@/utils/request'
// 封装员工列表的接口
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
