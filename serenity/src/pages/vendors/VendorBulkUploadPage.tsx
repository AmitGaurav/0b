import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  FaUpload,
  FaDownload,
  FaFileAlt,
  FaFileCsv,
  FaFileExcel,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaTrash,
  FaEye,
  FaInfoCircle,
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import {
  PageContainer,
  PageTitle,
  PageSubtitle,
  ContentCard,
  StatsGrid,
  StatCard as LayoutStatCard,
  StatIcon,
  StatValue,
  StatLabel,
  Button
} from '../../components/common/PageLayout';

// Types for upload functionality
interface UploadStats {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  totalVendors: number;
  recentUpload: string | null;
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  currentFile: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
}

interface UploadResult {
  id: string;
  fileName: string;
  status: 'success' | 'error' | 'warning';
  uploadedAt: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: string[];
  warnings: string[];
}

interface FileInfo {
  file: File;
  id: string;
  preview?: string;
  errors: string[];
  isValid: boolean;
}

// Styled Components following Society Members design patterns
const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.gray[600]};
    max-width: 800px;
    margin: 0 auto;
  }
`;

const UploadSection = styled(ContentCard)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SampleDownloadSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SampleCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
  
  .icon {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const DropZone = styled.div<{ isDragActive?: boolean; hasFiles?: boolean }>`
  border: 2px dashed ${({ theme, isDragActive, hasFiles }) => 
    isDragActive ? theme.colors.primary[400] : 
    hasFiles ? theme.colors.success[400] : 
    theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  background: ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[50] : theme.colors.gray[50]};
  transition: ${({ theme }) => theme.transition.all};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  .upload-icon {
    font-size: 3rem;
    color: ${({ theme, isDragActive }) => 
      isDragActive ? theme.colors.primary[500] : theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .supported-formats {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[500]};
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

const FileList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FileItem = styled.div<{ isValid?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, isValid }) => 
    isValid === false ? theme.colors.error[300] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  .file-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    flex: 1;
    
    .file-icon {
      font-size: 1.5rem;
      color: ${({ theme, isValid }) => 
        isValid === false ? theme.colors.error[500] : theme.colors.primary[500]};
    }
    
    .file-details {
      .file-name {
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
        color: ${({ theme }) => theme.colors.gray[900]};
        margin-bottom: 2px;
      }
      
      .file-size {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.gray[500]};
      }
      
      .file-errors {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.error[600]};
        margin-top: 4px;
      }
    }
  }
  
  .file-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const ProgressSection = styled.div<{ show?: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ProgressCard = styled(ContentCard)`
  text-align: center;
  
  .progress-icon {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary[500]}, 
      ${({ theme }) => theme.colors.primary[600]}
    );
    transition: width 0.3s ease;
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

const ResultsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const ResultCard = styled.div<{ status?: 'success' | 'error' | 'warning' }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, status }) => 
    status === 'success' ? theme.colors.success[300] :
    status === 'error' ? theme.colors.error[300] :
    status === 'warning' ? theme.colors.warning[300] :
    theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  
  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    
    .result-info {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing[3]};
      
      .result-icon {
        font-size: 1.5rem;
        color: ${({ theme, status }) => 
          status === 'success' ? theme.colors.success[500] :
          status === 'error' ? theme.colors.error[500] :
          status === 'warning' ? theme.colors.warning[500] :
          theme.colors.gray[500]};
      }
      
      .result-details {
        .file-name {
          font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
          color: ${({ theme }) => theme.colors.gray[900]};
        }
        
        .upload-time {
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
          color: ${({ theme }) => theme.colors.gray[500]};
        }
      }
    }
    
    .result-actions {
      display: flex;
      gap: ${({ theme }) => theme.spacing[2]};
    }
  }
  
  .result-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    
    .stat {
      text-align: center;
      
      .stat-value {
        font-size: ${({ theme }) => theme.typography.fontSize.xl};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        color: ${({ theme }) => theme.colors.gray[900]};
      }
      
      .stat-label {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.gray[600]};
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
  
  .result-messages {
    .error-list, .warning-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        padding: ${({ theme }) => theme.spacing[1]} 0;
        color: ${({ theme, status }) => 
          status === 'error' ? theme.colors.error[700] : theme.colors.warning[700]};
      }
    }
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const VendorBulkUploadPage: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    currentFile: null,
    status: 'idle'
  });
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock stats - in real app, fetch from API
  const [stats] = useState<UploadStats>({
    totalFiles: 12,
    successfulUploads: 10,
    failedUploads: 2,
    totalVendors: 248,
    recentUpload: '2024-01-15'
  });

  // File validation with enhanced security checks
  const validateFile = useCallback((file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const minSize = 1; // 1 byte minimum
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use CSV or Excel files.');
    }

    // File extension validation (additional security)
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      errors.push('File extension not allowed. Use .csv, .xls, or .xlsx files.');
    }

    // Size validation
    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }
    if (file.size < minSize) {
      errors.push('File appears to be empty.');
    }

    // File name validation
    if (file.name.length > 100) {
      errors.push('File name too long. Maximum 100 characters.');
    }
    if (file.name.trim().length === 0) {
      errors.push('File name cannot be empty.');
    }

    // Security: Check for suspicious file names
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|scr|com|pif)$/i,
      /\.(js|vbs|ps1|sh)$/i,
      /\.(php|asp|jsp|html|htm)$/i,
      /\.\./, // Path traversal
      /[<>:"|?*]/ // Invalid characters
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('File name contains invalid or suspicious characters.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList) => {
    const newFiles: FileInfo[] = [];
    let validCount = 0;
    let invalidCount = 0;
    
    Array.from(selectedFiles).forEach(file => {
      const validation = validateFile(file);
      newFiles.push({
        file,
        id: `${Date.now()}-${Math.random()}`,
        isValid: validation.isValid,
        errors: validation.errors
      });
      
      if (validation.isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    // Show notification
    if (validCount > 0 && invalidCount === 0) {
      toast.success(`${validCount} file(s) added successfully`);
    } else if (validCount > 0 && invalidCount > 0) {
      toast.warning(`${validCount} valid file(s) added, ${invalidCount} file(s) have errors`);
    } else if (invalidCount > 0) {
      toast.error(`${invalidCount} file(s) rejected due to validation errors`);
    }
  }, [validateFile]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // File input click handler
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (fileToRemove) {
      toast.info(`File "${fileToRemove.file.name}" removed`);
    }
  };

  // Download sample files
  const handleDownloadSample = (format: 'csv' | 'excel') => {
    try {
      // Mock sample data
      const sampleData = [
        ['Vendor Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Service Category', 'Status'],
        ['ABC Cleaning Services', 'John Doe', 'john@abccleaning.com', '9876543210', '123 Main St, City', 'Cleaning', 'ACTIVE'],
        ['XYZ Security', 'Jane Smith', 'jane@xyzsecurity.com', '9876543211', '456 Oak Ave, City', 'Security', 'ACTIVE'],
        ['Quick Repairs Co', 'Bob Wilson', 'bob@quickrepairs.com', '9876543212', '789 Pine Rd, City', 'Maintenance', 'INACTIVE']
      ];

      if (format === 'csv') {
        const csvContent = sampleData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vendor_upload_template.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV template downloaded successfully');
      } else {
        // For Excel, you would use a library like xlsx
        toast.info('Excel template download feature coming soon');
      }
    } catch (error) {
      toast.error('Failed to download template. Please try again.');
    }
  };

  // Start upload process
  const handleStartUpload = async () => {
    const validFiles = files.filter(f => f.isValid);
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return;
    }

    toast.info(`Starting upload of ${validFiles.length} file(s)...`);

    setUploadProgress({
      isUploading: true,
      progress: 0,
      currentFile: validFiles[0].file.name,
      status: 'uploading'
    });

    // Mock upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mock results
        const mockResults: UploadResult[] = validFiles.map(fileInfo => ({
          id: fileInfo.id,
          fileName: fileInfo.file.name,
          status: Math.random() > 0.8 ? 'error' : 'success',
          uploadedAt: new Date().toISOString(),
          totalRows: Math.floor(Math.random() * 100) + 10,
          successRows: Math.floor(Math.random() * 90) + 5,
          errorRows: Math.floor(Math.random() * 5),
          errors: Math.random() > 0.7 ? ['Invalid email format in row 5', 'Missing phone number in row 12'] : [],
          warnings: Math.random() > 0.8 ? ['Duplicate vendor name in row 8'] : []
        }));

        const successCount = mockResults.filter(r => r.status === 'success').length;
        const errorCount = mockResults.filter(r => r.status === 'error').length;

        setUploadResults(mockResults);
        setUploadProgress(prev => ({ ...prev, status: 'completed', isUploading: false }));
        setFiles([]); // Clear files after upload

        // Show completion notification
        if (errorCount === 0) {
          toast.success(`All ${successCount} file(s) uploaded successfully!`);
        } else if (successCount > 0) {
          toast.warning(`${successCount} file(s) uploaded successfully, ${errorCount} failed`);
        } else {
          toast.error(`Upload failed for all ${errorCount} file(s)`);
        }
      } else {
        setUploadProgress(prev => ({ ...prev, progress }));
      }
    }, 200);
  };

  return (
    <PageContainer>
      <Header>
        <h1><FaUpload /> Vendor Bulk Upload</h1>
        <p>Upload multiple vendor records using CSV or Excel files with comprehensive validation and progress tracking</p>
      </Header>

      {/* Statistics Dashboard */}
      <StatsGrid>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaFileAlt />
          </StatIcon>
          <StatValue>{stats.totalFiles}</StatValue>
          <StatLabel>Total Uploads</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{stats.successfulUploads}</StatValue>
          <StatLabel>Successful</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#f44336">
            <FaTimes />
          </StatIcon>
          <StatValue>{stats.failedUploads}</StatValue>
          <StatLabel>Failed</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#2196F3">
            <FaUsers />
          </StatIcon>
          <StatValue>{stats.totalVendors}</StatValue>
          <StatLabel>Total Vendors</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#FF9800">
            <FaCalendarAlt />
          </StatIcon>
          <StatValue>{stats.recentUpload ? new Date(stats.recentUpload).toLocaleDateString() : 'Never'}</StatValue>
          <StatLabel>Last Upload</StatLabel>
        </LayoutStatCard>
      </StatsGrid>

      {/* Sample Download Section */}
      <UploadSection>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
          <FaDownload style={{ marginRight: '0.5rem' }} />
          Download Sample Templates
        </h2>
        <SampleDownloadSection>
          <SampleCard>
            <div className="icon">
              <FaFileCsv />
            </div>
            <h3>CSV Template</h3>
            <p>Download a CSV template with sample vendor data and proper column headers</p>
            <Button 
              onClick={() => handleDownloadSample('csv')} 
              variant="primary"
              aria-label="Download CSV template for vendor bulk upload"
            >
              <FaDownload aria-hidden="true" />
              Download CSV
            </Button>
          </SampleCard>
          <SampleCard>
            <div className="icon">
              <FaFileExcel />
            </div>
            <h3>Excel Template</h3>
            <p>Download an Excel template with formatted columns and validation rules</p>
            <Button 
              onClick={() => handleDownloadSample('excel')} 
              variant="primary"
              aria-label="Download Excel template for vendor bulk upload"
            >
              <FaDownload aria-hidden="true" />
              Download Excel
            </Button>
          </SampleCard>
        </SampleDownloadSection>
      </UploadSection>

      {/* Upload Section */}
      <UploadSection>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
          <FaCloudUploadAlt style={{ marginRight: '0.5rem' }} />
          Upload Vendor Files
        </h2>
        
        <DropZone
          isDragActive={isDragActive}
          hasFiles={files.length > 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileInputClick}
          role="button"
          tabIndex={0}
          aria-label="Upload vendor files by dragging and dropping or clicking to browse"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFileInputClick();
            }
          }}
        >
          <div className="upload-icon" aria-hidden="true">
            <FaCloudUploadAlt />
          </div>
          <h3>{isDragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}</h3>
          <p>Upload your vendor data files for bulk processing</p>
          <Button variant="primary" aria-describedby="file-format-info">
            <FaUpload />
            Choose Files
          </Button>
          <div className="supported-formats" id="file-format-info">
            Supported formats: CSV, Excel (.xlsx, .xls) • Max size: 10MB per file
          </div>
        </DropZone>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          aria-label="Select vendor files for bulk upload"
        />

        {files.length > 0 && (
          <FileList>
            <h3 style={{ marginBottom: '1rem', color: '#1a202c' }}>Selected Files ({files.length})</h3>
            {files.map(fileInfo => (
              <FileItem key={fileInfo.id} isValid={fileInfo.isValid}>
                <div className="file-info">
                  <div className="file-icon">
                    {fileInfo.file.type.includes('csv') ? <FaFileCsv /> : <FaFileExcel />}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{fileInfo.file.name}</div>
                    <div className="file-size">
                      {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {fileInfo.errors.length > 0 && (
                      <div className="file-errors">
                        {fileInfo.errors.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="file-actions">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFile(fileInfo.id)}
                    style={{ padding: '0.5rem', minWidth: 'auto' }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </FileItem>
            ))}
            
            {files.some(f => f.isValid) && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Button
                  onClick={handleStartUpload}
                  variant="primary"
                  disabled={uploadProgress.isUploading}
                >
                  <FaUpload />
                  Upload {files.filter(f => f.isValid).length} File(s)
                </Button>
              </div>
            )}
          </FileList>
        )}
      </UploadSection>

      {/* Progress Section */}
      <ProgressSection show={uploadProgress.isUploading || uploadProgress.status === 'completed'}>
        <ProgressCard>
          {uploadProgress.isUploading && (
            <>
              <div className="progress-icon">
                <FaSpinner />
              </div>
              <h3>Uploading Files...</h3>
              <p>Processing: {uploadProgress.currentFile}</p>
              <ProgressBar>
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </ProgressBar>
              <p>{Math.round(uploadProgress.progress)}% Complete</p>
            </>
          )}
          
          {uploadProgress.status === 'completed' && (
            <>
              <div style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }}>
                <FaCheckCircle />
              </div>
              <h3>Upload Completed!</h3>
              <p>All files have been processed. Check the results below.</p>
            </>
          )}
        </ProgressCard>
      </ProgressSection>

      {/* Results Section */}
      {uploadResults.length > 0 && (
        <ResultsSection>
          <ContentCard>
            <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
              <FaChartBar style={{ marginRight: '0.5rem' }} />
              Upload Results
            </h2>
            
            <ResultsGrid>
              {uploadResults.map(result => (
                <ResultCard key={result.id} status={result.status}>
                  <div className="result-header">
                    <div className="result-info">
                      <div className="result-icon">
                        {result.status === 'success' && <FaCheckCircle />}
                        {result.status === 'error' && <FaTimes />}
                        {result.status === 'warning' && <FaExclamationTriangle />}
                      </div>
                      <div className="result-details">
                        <div className="file-name">{result.fileName}</div>
                        <div className="upload-time">
                          {new Date(result.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="result-actions">
                      <Button variant="secondary" style={{ padding: '0.5rem', minWidth: 'auto' }}>
                        <FaEye />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="result-stats">
                    <div className="stat">
                      <div className="stat-value">{result.totalRows}</div>
                      <div className="stat-label">Total</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{result.successRows}</div>
                      <div className="stat-label">Success</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{result.errorRows}</div>
                      <div className="stat-label">Errors</div>
                    </div>
                  </div>
                  
                  {(result.errors.length > 0 || result.warnings.length > 0) && (
                    <div className="result-messages">
                      {result.errors.length > 0 && (
                        <ul className="error-list">
                          {result.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      )}
                      {result.warnings.length > 0 && (
                        <ul className="warning-list">
                          {result.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </ResultCard>
              ))}
            </ResultsGrid>
          </ContentCard>
        </ResultsSection>
      )}
    </PageContainer>
  );
};

export default VendorBulkUploadPage;