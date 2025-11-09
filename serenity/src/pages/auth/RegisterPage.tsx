import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiHome } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { authAPI, Society } from '../../services/api/authAPI';

const Form = styled.form`
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasIcon?: boolean; hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  ${({ hasIcon }) => hasIcon && 'padding-left: 40px;'}
  ${({ hasIcon }) => hasIcon && 'padding-right: 40px;'}
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const Select = styled.select<{ hasIcon?: boolean; hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  ${({ hasIcon }) => hasIcon && 'padding-left: 40px;'}
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }

  option {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['loading'].includes(prop)
})<{ variant?: 'primary' | 'secondary'; loading?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid;
  cursor: ${({ loading }) => loading ? 'not-allowed' : 'pointer'};
  opacity: ${({ loading }) => loading ? 0.7 : 1};
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ variant = 'primary', theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary[600]};
        border-color: ${theme.colors.primary[600]};
        color: ${theme.colors.white};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary[700]};
          border-color: ${theme.colors.primary[700]};
        }
      `;
    }
    return `
      background: ${theme.colors.white};
      border-color: ${theme.colors.gray[300]};
      color: ${theme.colors.gray[700]};
      
      &:hover:not(:disabled) {
        background: ${theme.colors.gray[50]};
      }
    `;
  }}
`;

const BottomLinks = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const LinkText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

// Form validation schema
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  societyId: yup
    .number()
    .required('Please select a society')
    .typeError('Please select a society'),
  address: yup
    .string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  occupation: yup
    .string()
    .min(2, 'Occupation must be at least 2 characters')
    .required('Occupation is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface RegisterFormData {
  name: string;
  email: string;
  societyId: number;
  address: string;
  occupation: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loadingSocieties, setLoadingSocieties] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  // Fetch societies on component mount
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoadingSocieties(true);
        const societyList = await authAPI.getSocieties();
        // Transform societies to include displayName
        const transformedSocieties = societyList.map(society => ({
          ...society,
          displayName: `${society.name} (${society.id})`
        }));
        setSocieties(transformedSocieties);
      } catch (error) {
        console.error('Failed to fetch societies:', error);
        toast.error('Failed to load societies. Please try again.');
      } finally {
        setLoadingSocieties(false);
      }
    };

    fetchSocieties();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      const { confirmPassword, ...formData } = data;
      
      // Transform data to match RegisterData interface
      const userData = {
        username: formData.email, // Email is used as username
        email: formData.email,
        password: formData.password,
        societyId: formData.societyId,
        name: formData.name,
        address: formData.address,
        occupation: formData.occupation,
      };
      
      await registerUser(userData);
      toast.success('Registration successful! Welcome to Serenity.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <InputContainer>
            <InputIcon>
              <FiUser size={18} />
            </InputIcon>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              hasIcon
              hasError={!!errors.name}
              {...register('name')}
            />
          </InputContainer>
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputContainer>
            <InputIcon>
              <FiMail size={18} />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              hasIcon
              hasError={!!errors.email}
              {...register('email')}
            />
          </InputContainer>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="societyId">Society</Label>
          <InputContainer>
            <InputIcon>
              <FiHome size={18} />
            </InputIcon>
            <Select
              id="societyId"
              hasIcon
              hasError={!!errors.societyId}
              {...register('societyId', { valueAsNumber: true })}
              disabled={loadingSocieties}
            >
              <option value="">
                {loadingSocieties ? 'Loading societies...' : 'Select a society'}
              </option>
              {societies.map((society) => (
                <option key={society.id} value={society.id}>
                  {society.displayName}
                </option>
              ))}
            </Select>
          </InputContainer>
          {errors.societyId && <ErrorMessage>{errors.societyId.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <InputContainer>
            <InputIcon>
              <FiUser size={18} />
            </InputIcon>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address"
              hasIcon
              hasError={!!errors.address}
              {...register('address')}
            />
          </InputContainer>
          {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="occupation">Occupation</Label>
          <InputContainer>
            <InputIcon>
              <FiUser size={18} />
            </InputIcon>
            <Input
              id="occupation"
              type="text"
              placeholder="Enter your occupation"
              hasIcon
              hasError={!!errors.occupation}
              {...register('occupation')}
            />
          </InputContainer>
          {errors.occupation && <ErrorMessage>{errors.occupation.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputContainer>
            <InputIcon>
              <FiLock size={18} />
            </InputIcon>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              hasIcon
              hasError={!!errors.password}
              {...register('password')}
            />
            <ToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </ToggleButton>
          </InputContainer>
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <InputContainer>
            <InputIcon>
              <FiLock size={18} />
            </InputIcon>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              hasIcon
              hasError={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <ToggleButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </ToggleButton>
          </InputContainer>
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
          )}
        </FormGroup>

        {error && (
          <ErrorMessage style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </ErrorMessage>
        )}

        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <BottomLinks>
        <LinkText>
          Already have an account?{' '}
          <StyledLink to="/auth/login">Sign in here</StyledLink>
        </LinkText>
      </BottomLinks>
    </div>
  );
};

export default RegisterPage;
