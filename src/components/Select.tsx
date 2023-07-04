import React, { useState } from 'react';
import { Select, Space, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { SelectCommonPlacement } from 'antd/es/_util/motion';


export function SelectPosition({ position , setPosition }: any) {
  return (
    <Space wrap >
      <Select
        defaultValue={position}
        style={{ width: 130, height: 40 , margin: "0 5px"}}
        onChange={(value)=>setPosition(value)}
        options={[
          { value: 'Quản trị viên', label: 'Quản trị viên' },
          { value: 'Thành viên', label: 'Thành viên' },
          { value: 'Quan sát viên', label: 'Quan sát viên' },
        ]}
      />
    </Space>
  )

}
export function SelectPosition1({ position }: any) {
  return (
    <Space wrap >
      <Select
        defaultValue={position}
        style={{ width: 120, height: 40 }}
        options={[
          { value: 'boss', label: 'Quản trị viện' },
          { value: 'member', label: 'Thành viên' },
          { value: 'viewer', label: 'Quan sát viên' },
        ]}
      />
    </Space>
  )

}


