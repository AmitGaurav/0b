import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiFile, FiTrash2, FiCheck, FiX, FiClock, FiUsers, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';

// Local interfaces
interface BulkUploadTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  columns: string[];
  sampleData: any[];
}

interface BulkUploadHistory {
  id: string;
  fileName: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'completed' | 'processing' | 'failed';
  totalRecords: number;
  successRecords: number;
  errorRecords: number;
  progress: number;
}

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 80px);
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 8px 0 0 0;
  font-size: 16px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || props.theme.colors.primary};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.color || props.theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TemplateGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const TemplateCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: #f1f5f9;
  }
`;

const TemplateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TemplateIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const TemplateDetails = styled.div``;

const TemplateName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const TemplateDescription = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const UploadZone = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  background: #f8fafc;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 24px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
  }

  &.dragover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${props => props.theme.colors.primary};
  font-size: 24px;
`;

const UploadText = styled.div`
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary}dd;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: #f1f5f9;
    color: #475569;
    
    &:hover {
      background: #e2e8f0;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  `}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableHeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  
  &:hover {
    background: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  color: #334155;
  font-size: 14px;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.status === 'completed' && `
    background: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.status === 'processing' && `
    background: #fef3c7;
    color: #92400e;
  `}
  
  ${props => props.status === 'failed' && `
    background: #fee2e2;
    color: #991b1b;
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  margin: 8px 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  color: #94a3b8;
`;

const FileInput = styled.input`
  display: none;
`;

// Mock data
const mockTemplates: BulkUploadTemplate[] = [
  {
    id: '1',
    name: 'Society Members',
    description: 'Upload member information in bulk',
    type: 'members',
    columns: ['name', 'email', 'phone', 'unit', 'role'],
    sampleData: []
  },
  {
    id: '2',
    name: 'Society Units',
    description: 'Upload unit details and ownership',
    type: 'units',
    columns: ['unit_number', 'floor', 'type', 'area', 'owner'],
    sampleData: []
  },
  {
    id: '3',
    name: 'Society Amenities',
    description: 'Upload amenity information',
    type: 'amenities',
    columns: ['name', 'type', 'capacity', 'booking_fee'],
    sampleData: []
  },
  {
    id: '4',
    name: 'Parking Slots',
    description: 'Upload parking slot details',
    type: 'parking',
    columns: ['slot_number', 'type', 'location', 'assigned_to'],
    sampleData: []
  }
];

const mockHistory: BulkUploadHistory[] = [
  {
    id: '1',
    fileName: 'members_batch_1.xlsx',
    type: 'members',
    uploadedBy: 'John Admin',
    uploadedAt: new Date('2024-01-15'),
    status: 'completed',
    totalRecords: 150,
    successRecords: 145,
    errorRecords: 5,
    progress: 100
  },
  {
    id: '2',
    fileName: 'units_data.csv',
    type: 'units',
    uploadedBy: 'Jane Manager',
    uploadedAt: new Date('2024-01-14'),
    status: 'processing',
    totalRecords: 80,
    successRecords: 60,
    errorRecords: 0,
    progress: 75
  },
  {
    id: '3',
    fileName: 'amenities_list.xlsx',
    type: 'amenities',
    uploadedBy: 'Mike Admin',
    uploadedAt: new Date('2024-01-13'),
    status: 'failed',
    totalRecords: 25,
    successRecords: 0,
    errorRecords: 25,
    progress: 0
  }
];

const BulkUploadPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadHistory, setUploadHistory] = useState<BulkUploadHistory[]>(mockHistory);
  const [currentUploads, setCurrentUploads] = useState<File[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const downloadTemplate = (template: BulkUploadTemplate) => {
    // Mock template download
    const blob = new Blob(['Template content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}_Template.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FiCheckCircle />;
      case 'processing': return <FiRefreshCw />;
      case 'failed': return <FiXCircle />;
      default: return <FiClock />;
    }
  };

  const totalUploads = uploadHistory.length;
  const successfulUploads = uploadHistory.filter(h => h.status === 'completed').length;
  const failedUploads = uploadHistory.filter(h => h.status === 'failed').length;
  const processingUploads = uploadHistory.filter(h => h.status === 'processing').length;

  return (
    <Container>
        <Header>
          <div>
            <Title>Bulk Upload</Title>
            <Subtitle>Upload society data in bulk using templates</Subtitle>
          </div>
          <HeaderActions>
            <Button variant="secondary">
              <FiRefreshCw />
              Refresh
            </Button>
          </HeaderActions>
        </Header>

        <StatsContainer>
          <StatCard color="#3b82f6">
            <StatValue color="#3b82f6">{totalUploads}</StatValue>
            <StatLabel>Total Uploads</StatLabel>
          </StatCard>
          <StatCard color="#10b981">
            <StatValue color="#10b981">{successfulUploads}</StatValue>
            <StatLabel>Successful</StatLabel>
          </StatCard>
          <StatCard color="#f59e0b">
            <StatValue color="#f59e0b">{processingUploads}</StatValue>
            <StatLabel>Processing</StatLabel>
          </StatCard>
          <StatCard color="#ef4444">
            <StatValue color="#ef4444">{failedUploads}</StatValue>
            <StatLabel>Failed</StatLabel>
          </StatCard>
        </StatsContainer>

        <ContentGrid>
          <Section>
            <SectionTitle>
              <FiDownload />
              Download Templates
            </SectionTitle>
            <TemplateGrid>
              {mockTemplates.map((template) => (
                <TemplateCard key={template.id}>
                  <TemplateInfo>
                    <TemplateIcon>
                      <FiFile />
                    </TemplateIcon>
                    <TemplateDetails>
                      <TemplateName>{template.name}</TemplateName>
                      <TemplateDescription>{template.description}</TemplateDescription>
                    </TemplateDetails>
                  </TemplateInfo>
                  <Button 
                    variant="primary" 
                    onClick={() => downloadTemplate(template)}
                  >
                    <FiDownload />
                    Download
                  </Button>
                </TemplateCard>
              ))}
            </TemplateGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiUpload />
              Upload Files
            </SectionTitle>
            <UploadZone 
              onDrop={handleDrop} 
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <UploadIcon>
                <FiUpload />
              </UploadIcon>
              <UploadText>Drag & drop files here</UploadText>
              <UploadSubtext>or click to browse files</UploadSubtext>
              <FileInput 
                id="file-input"
                type="file" 
                multiple 
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
              />
            </UploadZone>
            
            {selectedFiles.length > 0 && (
              <div>
                <h4>Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={{ margin: '8px 0', padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                    <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <Button variant="primary">
                    <FiUpload />
                    Start Upload
                  </Button>
                  <Button variant="secondary" onClick={() => setSelectedFiles([])}>
                    <FiX />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </Section>
        </ContentGrid>

        <Section>
          <SectionTitle>
            <FiClock />
            Upload History
          </SectionTitle>
          {uploadHistory.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiFile />
              </EmptyIcon>
              <div>No upload history found</div>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>File Name</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Uploaded By</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Records</TableHeaderCell>
                  <TableHeaderCell>Progress</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {uploadHistory.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell>
                      <strong>{upload.fileName}</strong>
                    </TableCell>
                    <TableCell>{upload.type}</TableCell>
                    <TableCell>{upload.uploadedBy}</TableCell>
                    <TableCell>{upload.uploadedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={upload.status}>
                        {getStatusIcon(upload.status)}
                        {upload.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {upload.successRecords}/{upload.totalRecords}
                      {upload.errorRecords > 0 && (
                        <span style={{ color: '#ef4444', marginLeft: '8px' }}>
                          ({upload.errorRecords} errors)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div style={{ minWidth: '100px' }}>
                        <ProgressBar>
                          <ProgressFill progress={upload.progress} />
                        </ProgressBar>
                        {upload.progress}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                          <FiDownload />
                        </Button>
                        <Button variant="danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                          <FiTrash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>
      </Container>
  );
};

export default BulkUploadPage;