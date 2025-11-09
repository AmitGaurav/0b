import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { FaUser, FaUserPlus } from 'react-icons/fa';

// Basic styled components
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1a202c;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
  
  p {
    font-size: 1.125rem;
    color: #718096;
  }
`;

const Form = styled.form`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  border: none;
  
  &:hover {
    background: #2563eb;
  }
`;

// Enhanced form data interface
interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  department: string;
  dateOfJoining: string;
  status: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  gender?: string;
  salary?: number;
  workingHours?: string;
  societyId: number;
}

const StaffRegistrationPageTest: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    control, 
    handleSubmit,
    formState: { errors }
  } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      role: '',
      department: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'PENDING_VERIFICATION',
      societyId: 1
    }
  });

  const onSubmit = async (data: StaffFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Form data:', data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FaUserPlus /> Staff Registration (Test Version)
        </h1>
        <p>Testing the staff registration form with basic functionality.</p>
      </Header>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">
            <FaUser /> Full Name
          </Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input 
                id="name"
                {...field}
                placeholder="Enter full name"
              />
            )}
          />
          {errors.name && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.name.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">
            <FaUser /> Email Address
          </Label>
          <Controller
            name="email"
            control={control}
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <Input 
                id="email"
                type="email"
                {...field}
                placeholder="Enter email address"
              />
            )}
          />
          {errors.email && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.email.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">
            <FaUser /> Phone Number
          </Label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone is required' }}
            render={({ field }) => (
              <Input 
                id="phone"
                type="tel"
                {...field}
                placeholder="Enter phone number"
              />
            )}
          />
          {errors.phone && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.phone.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="address">
            <FaUser /> Address
          </Label>
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field }) => (
              <textarea 
                id="address"
                {...field}
                placeholder="Enter complete address"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  background: 'white',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            )}
          />
          {errors.address && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.address.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">
            <FaUser /> Role
          </Label>
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <select 
                id="role"
                {...field}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  background: 'white'
                }}
              >
                <option value="">Select role</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="SECURITY">Security</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
                <option value="GARDENER">Gardener</option>
                <option value="DRIVER">Driver</option>
                <option value="OTHER">Other</option>
              </select>
            )}
          />
          {errors.role && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.role.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="department">
            <FaUser /> Department
          </Label>
          <Controller
            name="department"
            control={control}
            rules={{ required: 'Department is required' }}
            render={({ field }) => (
              <select 
                id="department"
                {...field}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  background: 'white'
                }}
              >
                <option value="">Select department</option>
                <option value="ADMINISTRATION">Administration</option>
                <option value="SECURITY">Security</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
                <option value="GARDENING">Gardening</option>
                <option value="TRANSPORTATION">Transportation</option>
                <option value="OTHER">Other</option>
              </select>
            )}
          />
          {errors.department && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.department.message}
            </span>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="dateOfJoining">
            <FaUser /> Date of Joining
          </Label>
          <Controller
            name="dateOfJoining"
            control={control}
            rules={{ required: 'Date of joining is required' }}
            render={({ field }) => (
              <Input 
                id="dateOfJoining"
                type="date"
                {...field}
              />
            )}
          />
          {errors.dateOfJoining && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.dateOfJoining.message}
            </span>
          )}
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Register Staff'}
        </Button>
      </Form>
    </PageContainer>
  );
};

export default StaffRegistrationPageTest;