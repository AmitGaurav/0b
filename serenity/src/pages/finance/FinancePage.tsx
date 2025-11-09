import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiFileText, 
  FiDownload, 
  FiAlertCircle, 
  FiBarChart, 
  FiMoreHorizontal
} from 'react-icons/fi';

// Finance Data Interfaces
interface FinanceTransaction {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  type: 'maintenance' | 'rent' | 'utility' | 'amenity' | 'penalty' | 'deposit' | 'refund' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'upi' | 'net-banking' | 'cheque';
  description: string;
}

interface FinanceDue {
  id: string;
  dueId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'partially-paid' | 'paid';
  description: string;
  paymentMethod?: string;
}

interface FinancePayment {
  id: string;
  paymentId: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'net-banking' | 'cheque';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
}

interface FinanceInvoice {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  description: string;
}

interface FinancialReport {
  id: string;
  reportId: string;
  date: string;
  type: 'monthly-statement' | 'annual-report' | 'tax-summary' | 'payment-history' | 'dues-summary';
  status: 'generating' | 'ready' | 'sent' | 'downloaded';
  description: string;
}

// Mock Data
const mockFinanceData = {
  transactions: [
    {
      id: '1',
      transactionId: 'TXN001',
      date: '2024-01-15',
      amount: 5000,
      type: 'maintenance' as const,
      status: 'completed' as const,
      paymentMethod: 'upi' as const,
      description: 'Monthly Maintenance - January 2024'
    },
    {
      id: '2',
      transactionId: 'TXN002',
      date: '2024-01-12',
      amount: 1500,
      type: 'utility' as const,
      status: 'completed' as const,
      paymentMethod: 'net-banking' as const,
      description: 'Electricity Bill - December 2023'
    },
    {
      id: '3',
      transactionId: 'TXN003',
      date: '2024-01-10',
      amount: 2000,
      type: 'amenity' as const,
      status: 'pending' as const,
      paymentMethod: 'card' as const,
      description: 'Gym Membership - Annual'
    },
    {
      id: '4',
      transactionId: 'TXN004',
      date: '2024-01-08',
      amount: 800,
      type: 'utility' as const,
      status: 'completed' as const,
      paymentMethod: 'upi' as const,
      description: 'Gas Bill - December 2023'
    }
  ] as FinanceTransaction[],
  dues: [
    {
      id: '1',
      dueId: 'DUE001',
      amount: 5000,
      dueDate: '2024-02-01',
      status: 'pending' as const,
      description: 'Monthly Maintenance - February 2024',
      paymentMethod: 'UPI'
    },
    {
      id: '2',
      dueId: 'DUE002',
      amount: 3500,
      dueDate: '2024-01-25',
      status: 'overdue' as const,
      description: 'Water Bill - December 2023'
    },
    {
      id: '3',
      dueId: 'DUE003',
      amount: 1000,
      dueDate: '2024-02-15',
      status: 'pending' as const,
      description: 'Parking Fine'
    },
    {
      id: '4',
      dueId: 'DUE004',
      amount: 2000,
      dueDate: '2024-02-10',
      status: 'pending' as const,
      description: 'Society Events Fee'
    }
  ] as FinanceDue[],
  payments: [
    {
      id: '1',
      paymentId: 'PAY001',
      date: '2024-01-15',
      amount: 5000,
      paymentMethod: 'upi' as const,
      status: 'completed' as const,
      description: 'Maintenance Payment'
    },
    {
      id: '2',
      paymentId: 'PAY002',
      date: '2024-01-12',
      amount: 1500,
      paymentMethod: 'net-banking' as const,
      status: 'completed' as const,
      description: 'Utility Payment'
    },
    {
      id: '3',
      paymentId: 'PAY003',
      date: '2024-01-10',
      amount: 10000,
      paymentMethod: 'cheque' as const,
      status: 'pending' as const,
      description: 'Security Deposit'
    },
    {
      id: '4',
      paymentId: 'PAY004',
      date: '2024-01-08',
      amount: 800,
      paymentMethod: 'card' as const,
      status: 'completed' as const,
      description: 'Online Service Fee'
    }
  ] as FinancePayment[],
  invoices: [
    {
      id: '1',
      invoiceId: 'INV001',
      date: '2024-01-01',
      amount: 5000,
      dueDate: '2024-02-01',
      status: 'sent' as const,
      description: 'Monthly Maintenance - February 2024'
    },
    {
      id: '2',
      invoiceId: 'INV002',
      date: '2024-01-05',
      amount: 2500,
      dueDate: '2024-01-20',
      status: 'paid' as const,
      description: 'Plumbing Services'
    },
    {
      id: '3',
      invoiceId: 'INV003',
      date: '2024-01-03',
      amount: 1200,
      dueDate: '2024-01-18',
      status: 'overdue' as const,
      description: 'Cleaning Services'
    },
    {
      id: '4',
      invoiceId: 'INV004',
      date: '2024-01-07',
      amount: 3000,
      dueDate: '2024-02-07',
      status: 'sent' as const,
      description: 'Security Services'
    }
  ] as FinanceInvoice[],
  reports: [
    {
      id: '1',
      reportId: 'REP001',
      date: '2024-01-31',
      type: 'monthly-statement' as const,
      status: 'ready' as const,
      description: 'Monthly Statement - January 2024'
    },
    {
      id: '2',
      reportId: 'REP002',
      date: '2024-01-15',
      type: 'tax-summary' as const,
      status: 'downloaded' as const,
      description: 'Annual Tax Summary - 2023'
    },
    {
      id: '3',
      reportId: 'REP003',
      date: '2024-01-20',
      type: 'payment-history' as const,
      status: 'ready' as const,
      description: 'Payment History - Q4 2023'
    },
    {
      id: '4',
      reportId: 'REP004',
      date: '2024-01-25',
      type: 'dues-summary' as const,
      status: 'generating' as const,
      description: 'Outstanding Dues Summary'
    }
  ] as FinancialReport[]
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    background: #2563eb;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${({ status }) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'background: #d1fae5; color: #065f46;';
      case 'pending':
      case 'sent':
        return 'background: #fef3c7; color: #92400e;';
      case 'failed':
      case 'cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      case 'overdue':
        return 'background: #fecaca; color: #b91c1c;';
      case 'generating':
        return 'background: #ede9fe; color: #7c2d12;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const ViewMoreButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f8fafc;
  }
`;

const FinancePage: React.FC = () => {
  const [financeData] = useState(mockFinanceData);
  const [showMore, setShowMore] = useState(false);

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Show only first 3 items in each section by default
  const getDisplayData = (data: any[]) => {
    return showMore ? data : data.slice(0, 3);
  };

  return (
    <Container>
      <Title>
        <FiCreditCard />
        Finance
      </Title>

      {/* Transactions Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <FiCreditCard />
            Transactions
          </SectionTitle>
          <ActionButton>
            <FiDownload />
            Export
          </ActionButton>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Transaction ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment Method</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {getDisplayData(financeData.transactions).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {transaction.type}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status}>
                    {transaction.status}
                  </StatusBadge>
                </TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {transaction.paymentMethod.replace('-', ' ')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      {/* Dues Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <FiAlertCircle />
            Dues
          </SectionTitle>
          <ActionButton>
            <FiCreditCard />
            Pay All
          </ActionButton>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Due ID</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Due Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment Method</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {getDisplayData(financeData.dues).map((due) => (
              <TableRow key={due.id}>
                <TableCell>{due.dueId}</TableCell>
                <TableCell>{formatCurrency(due.amount)}</TableCell>
                <TableCell>{formatDate(due.dueDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={due.status}>
                    {due.status.replace('-', ' ')}
                  </StatusBadge>
                </TableCell>
                <TableCell>{due.paymentMethod || 'Not Set'}</TableCell>
                <TableCell>{due.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      {/* Payments Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <FiDollarSign />
            Payments
          </SectionTitle>
          <ActionButton>
            <FiDownload />
            Export
          </ActionButton>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Payment ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Payment Method</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {getDisplayData(financeData.payments).map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.paymentId}</TableCell>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {payment.paymentMethod.replace('-', ' ')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status}>
                    {payment.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{payment.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      {/* Invoices Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <FiFileText />
            Invoices
          </SectionTitle>
          <ActionButton>
            <FiDownload />
            Export
          </ActionButton>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Invoice ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Due Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {getDisplayData(financeData.invoices).map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status}>
                    {invoice.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{invoice.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      {/* Financial Reports Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <FiBarChart />
            Financial Reports
          </SectionTitle>
          <ActionButton>
            <FiFileText />
            Generate Report
          </ActionButton>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Report ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {getDisplayData(financeData.reports).map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{formatDate(report.date)}</TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {report.type.replace('-', ' ')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={report.status}>
                    {report.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{report.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <ViewMoreButton onClick={() => setShowMore(!showMore)}>
          <FiMoreHorizontal />
          {showMore ? 'View Less' : 'View More'}
        </ViewMoreButton>
      </SectionCard>
    </Container>
  );
};

export default FinancePage;
