import React, { useState } from 'react';
import { Select, Space, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { SelectCommonPlacement } from 'antd/es/_util/motion';


const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export function SelectPosition({ position }: any) {
  return (
    <Space wrap style={{ margin: "0 5px" }}>
      <Select
        defaultValue={position}
        style={{ width: 120, height: 40 }}
        onChange={handleChange}
        options={[
          { value: 'boss', label: 'Quản trị viện' },
          { value: 'member', label: 'Thành viên' },
          { value: 'viewer', label: 'Quan sát viên' },
        ]}
      />
    </Space>
  )

}
export function SelectPosition1({ position }: any) {
  return (
    <Space wrap style={{ margin: "0 5px" }}>
      <Select
        defaultValue={position}
        style={{ width: 120, height: 40 }}
        onChange={handleChange}
        options={[
          { value: 'boss', label: 'Quản trị viện' },
          { value: 'member', label: 'Thành viên' },
          { value: 'viewer', label: 'Quan sát viên' },
        ]}
      />
    </Space>
  )

}


