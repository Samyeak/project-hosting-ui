// components/ui/SearchBar.tsx
'use client';

import React from 'react';
import {  Button, Form, Select, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';


interface SearchBarProps {
  onSearch: (values: any) => void;
  projectOptions?: { value: string; label: string }[];
  clientOptions?: { value: string; label: string }[];
  environmentOptions?: { value: string; label: string }[];
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  projectOptions = [],
  clientOptions = [],
  environmentOptions = [],
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleClear = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form 
      form={form} 
      layout="inline" 
      onFinish={onSearch}
      className="mb-4 flex-wrap gap-2"
    >
      {projectOptions.length > 0 && (
        <Form.Item name="projectName" className="mb-2">
          <Select
            placeholder="Select Project"
            allowClear
            style={{ width: 200 }}
            options={projectOptions}
          />
        </Form.Item>
      )}
      
      {environmentOptions.length > 0 && (
        <Form.Item name="environment" className="mb-2">
          <Select
            placeholder="Select Environment"
            allowClear
            style={{ width: 150 }}
            options={environmentOptions}
          />
        </Form.Item>
      )}
      
      {clientOptions.length > 0 && (
        <Form.Item name="clientName" className="mb-2">
          <Select
            placeholder="Select Client"
            allowClear
            style={{ width: 200 }}
            options={clientOptions}
          />
        </Form.Item>
      )}
      
      <Form.Item className="mb-2">
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />} 
            loading={loading}
          >
            Search
          </Button>
          <Button 
            onClick={handleClear}
            icon={<ClearOutlined />}
          >
            Clear
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchBar;

