import React, { useEffect, useState } from 'react'
import styles from './TransactionManagement.module.css'
import { formatDateTime, formatPhone } from '../../utils/utils';
import { Button, Input, Table, DatePicker, ConfigProvider, Modal, Row, Col } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { getTransactions, getTransactionsDetail } from '../../api/transaction';
import { current } from '@reduxjs/toolkit';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function TransactionManagement() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [transaction, setTransaction] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [search, setSearch] = useState(null)
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTransactions([]);
    }
  };
  async function getListOfTransactions(search, startDate, endDate) {
    try {
      setLoading(true);
      const data = await getTransactions({ phone: search, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      if (data) {
        setTransactions(data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.length,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  async function getTransaction(record) {
    setTransaction(record);
    setDetailOpen(true)
  };
  useEffect(() => {
    getListOfTransactions(search, startDate, endDate)
  }, [search, startDate, endDate]);
  const transactionsColumn = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionCode',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdTime',
      render: (_, record) => {
        return formatDateTime(record.createdTime)
      }
    },
    {
      title: 'Người giao dịch',
      render: (_, record) => {
        return record.parent.fullName
      }
    },
    {
      title: 'Số điện thoại',
      render: (_, record) => {
        return formatPhone(record.parent.phone)
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'money',
      render: (_, record) => {
        return record.money.toLocaleString()
      }
    },
    {
      title: 'Chi tiết',
      render: (_, record) => (
        <Button type='link' onClick={() => getTransaction(record)} icon={<EyeOutlined />} size='large' />
      ),
      width: 120,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Giao dịch</h2>
      <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
        <Search className={styles.searchBar} placeholder="Tìm kiếm số điện thoại giao dịch" onSearch={(value, e) => { setSearch(value) }} enterButton />
        <ConfigProvider
          theme={{
            components: {
              DatePicker: {
                activeBorderColor: '#f2c955'
              },
            },
          }}
        >
          <RangePicker
            value={[startDate, endDate]}
            className={styles.picker}
            format={'DD/MM/YYYY'}
            disabledDate={current => current && current.valueOf() > Date.now()}
            onChange={(value) => {
              {
                setStartDate(value[0])
                setEndDate(value[1])
              }
            }}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            allowClear={false}
          />
        </ConfigProvider>

      </div>
      <Table
        columns={transactionsColumn}
        rowKey={(record) => record.transactionId}
        dataSource={transactions}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ y: 'calc(100vh - 220px)' }}
      />
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              titleFontSize: '1.2rem',
            },
          },
        }}
      >
        <Modal
          title="Chi tiết giao dịch"
          centered
          open={detailOpen}
          footer={null}
          onCancel={() => setDetailOpen(false)}
          classNames={{ header: styles.modalHeader }}
        >
          {transaction && (
            <>
              <p className={styles.detailTitle}>Giao dịch:</p>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Mã giao dịch:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{transaction.transactionCode}</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Người giao dịch:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{transaction.parent.fullName}</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Số điện thoại:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{formatPhone(transaction.parent.phone)}</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Thời gian:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{formatDateTime(transaction.createdTime)}</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Số tiền:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{transaction.money.toLocaleString()}</p>
                </Col>
              </Row>
              <p className={styles.detailTitle}>Thông tin học viên:</p>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Học viên đăng ký:</p>
                </Col>
                <Col span={16}>
                  {transaction?.students?.map(student => (
                    <p className={styles.classDetail}>{student.fullName}</p>
                  ))}
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Khóa học:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{transaction.courseName}</p>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p className={styles.classDetailTitle}>Mã lớp đăng kí:</p>
                </Col>
                <Col span={16}>
                  <p className={styles.classDetail}>{transaction.myClassResponse?.classCode}</p>
                </Col>
              </Row>
            </>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  )
}
