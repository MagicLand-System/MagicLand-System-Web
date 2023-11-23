import React from 'react'
import { Link } from 'react-router-dom'

export default function Error404() {
  return (
    <div>
      <h1 style={{ color: 'black' }}>Error404</h1>
      <p style={{ color: 'black' }}>Tài nguyên này không tồn tại hoặc bạn không có quyền truy cập vào</p>
      <Link to={-1}>Quay  lại</Link>
    </div>
  )
}
